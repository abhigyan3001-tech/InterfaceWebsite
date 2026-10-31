<?php
// Handles the contact form on contact.html and emails the inquiry to the team.
// Responds with JSON when called from the page's script, otherwise redirects back with ?status=...

declare(strict_types=1);

const TO_EMAIL = 'contact@interfaceai.io';
// Must be a mailbox on our own domain, or the host may refuse to send and receivers may mark it as spam.
const FROM_EMAIL = 'contact@interfaceai.io';
const MAX_PER_HOUR = 5;

$wantsJson = str_contains($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json');

function respond(bool $ok, string $status, string $message, int $code = 200): never
{
    global $wantsJson;
    if ($wantsJson) {
        http_response_code($code);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode(['ok' => $ok, 'message' => $message]);
    } else {
        header('Location: contact.html?status=' . $status, true, 303);
    }
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Location: contact.html', true, 303);
    exit;
}

// Bots tend to fill every field; people never see this one. Pretend it worked.
if (trim((string)($_POST['website'] ?? '')) !== '') {
    respond(true, 'sent', 'Thanks! Your message has been sent.');
}

$name = trim((string)($_POST['name'] ?? ''));
$email = trim((string)($_POST['email'] ?? ''));
$description = trim((string)($_POST['description'] ?? ''));

$len = fn(string $s): int => mb_strlen($s, 'UTF-8');
if (
    $name === '' || $len($name) > 100 || preg_match('/[\r\n]/', $name)
    || $len($email) > 254 || !filter_var($email, FILTER_VALIDATE_EMAIL)
    || $len($description) < 10 || $len($description) > 3000
) {
    respond(false, 'invalid', 'Please enter your name, a valid email address and a description of at least 10 characters.', 422);
}

// Simple per-visitor limit so the form can't be used to flood the inbox.
$rateFile = sys_get_temp_dir() . '/interfaceai-contact-' . hash('sha256', $_SERVER['REMOTE_ADDR'] ?? '') . '.json';
$recent = is_file($rateFile) ? (json_decode((string)file_get_contents($rateFile), true) ?: []) : [];
$recent = array_values(array_filter($recent, fn($t) => is_int($t) && $t > time() - 3600));
if (count($recent) >= MAX_PER_HOUR) {
    respond(false, 'limit', 'You have sent several messages recently. Please try again later or email us directly.', 429);
}

$subject = mb_encode_mimeheader('Website enquiry from ' . $name, 'UTF-8', 'B', "\r\n");
$body = "New enquiry from the interfaceai.io contact form\n\n"
    . "Name: {$name}\n"
    . "Email: {$email}\n"
    . 'Sent: ' . gmdate('Y-m-d H:i') . " UTC\n\n"
    . "Description:\n{$description}\n";
$headers = implode("\r\n", [
    'From: Interface AI Website <' . FROM_EMAIL . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
]);

if (!mail(TO_EMAIL, $subject, $body, $headers, '-f' . FROM_EMAIL)) {
    error_log('contact.php: mail() failed');
    respond(false, 'error', 'Sorry, your message could not be sent. Please email us at ' . TO_EMAIL . '.', 500);
}

$recent[] = time();
@file_put_contents($rateFile, json_encode($recent), LOCK_EX);

respond(true, 'sent', "Thank you for reaching out! We've received your request and will get back to you by email soon.");
