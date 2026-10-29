# Deploy the website to Hostinger

1. Sign in to Hostinger **hPanel** with an account that has website hosting access.
2. Open **Websites → Manage/Dashboard → Files → File Manager** for `interfaceai.io`.
3. Open the website's document root, usually `public_html`. Verify this is the correct domain before replacing anything.
4. Back up any existing `index.html` or `index.php`.
5. Upload these files into the document root, keeping the same folder structure:
   - `index.html`
   - `privacy.html`
   - `contact.html` and `contact.php`
   - `favicon.svg`
   - `.htaccess` (a hidden file; enable "show hidden files" in File Manager to see it)
   - the `assets/` folder (`styles.css`, `main.js`)
6. Visit `https://interfaceai.io` and test navigation and contact links.
7. If the domain is not pointing to this Hostinger hosting plan, configure its DNS according to the hosting account's instructions and wait for propagation.
8. Enable SSL in Hostinger **before** relying on `.htaccess`, which redirects all traffic to HTTPS. Then check that `http://interfaceai.io` redirects to `https://`.
9. Send a test email to `contact@interfaceai.io` and confirm it arrives.
10. Optionally verify the security headers at https://securityheaders.com.

If the site shows a 500 error after uploading `.htaccess`, the host does not allow one of its directives; rename the file to `.htaccess.off` and contact Hostinger support.

The site is static: no Node.js, database, build step, or server-side app is required. CSS and JavaScript are in `assets/` so that the Content-Security-Policy in `.htaccess` can block inline scripts.

**Note:** Uploading to GitHub does not automatically deploy to Hostinger. A separate deployment integration or manual upload is required.

## Automatic deployment (Hostinger Git integration)

Every push to `main` can update the live site automatically.

### One-time setup
1. In hPanel, open **Websites → Manage** for `interfaceai.io`, then **Advanced → Git**.
2. Hostinger can only deploy into an **empty** folder. Back up `public_html` (download it from File Manager), then delete its contents.
3. Under **Create a New Repository**, enter:
   - **Repository:** `https://github.com/interfaceai1/InterfaceWebsite.git`
   - **Branch:** `main`
   - **Directory:** leave empty (deploys into `public_html`)
4. Click **Create**, then **Deploy** in the list below it. Check that `https://interfaceai.io` loads.
5. In the same list, click **Auto Deployment** and copy the **Webhook URL**.
6. In GitHub, open the repository's **Settings → Webhooks → Add webhook**:
   - **Payload URL:** the webhook URL from step 5
   - **Content type:** `application/json`
   - **Events:** *Just the push event*
   - Save, and check that the delivery shows a green tick under **Recent Deliveries**.

The repository is public, so no SSH/deploy key is needed. If it is made private, copy the SSH key shown in hPanel's Git section into GitHub's **Settings → Deploy keys** and use the SSH clone URL (`git@github.com:interfaceai1/InterfaceWebsite.git`) instead.

### After setup
- Merge or push to `main` → the webhook triggers Hostinger to pull the latest files, usually within a minute.
- To roll back, revert the commit on `main` and push.
- Don't edit files in `public_html` via File Manager: the next deployment can fail or overwrite them.
- `.htaccess` returns 403 Forbidden for `.git/`, `docs/` and `*.md`, because the whole repository is cloned into `public_html`.

## Contact form email

`contact.php` sends each submission to `contact@interfaceai.io` using PHP's `mail()`, with the visitor's address as *Reply-To*, so you can reply directly.

- Requires PHP 8.1 or newer (hPanel → **Advanced → PHP Configuration**).
- After deploying, submit a test message on `/contact.html` and check it arrives (look in spam too).
- If messages land in spam, make sure the domain's SPF record allows Hostinger to send for `interfaceai.io` (hPanel → **Emails → Email deliverability**, or **Domains → DNS / Nameservers**). If the mailbox is hosted elsewhere, add Hostinger to that SPF record rather than creating a second one.
- Each visitor can send up to 5 messages per hour. A hidden field silently discards most bot submissions.


## Updating CSS or JavaScript (cache busting)

Browsers and Hostinger's CDN cache `assets/styles.css` and `assets/main.js` for up to 7 days. Every page links them with a version number, e.g. `assets/styles.css?v=3`.

**Whenever you change either file, increase the number on every page** (`index.html`, `contact.html`, `privacy.html`), e.g. `?v=3` → `?v=4`. Otherwise visitors may keep seeing the old styles. If a change still doesn't show after deploying, use **Cache → Clear cache** on the website's hPanel dashboard.
