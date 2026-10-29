# Deploy the website to Hostinger

1. Sign in to Hostinger **hPanel** with an account that has website hosting access.
2. Open **Websites → Manage/Dashboard → Files → File Manager** for `interfaceai.io`.
3. Open the website's document root, usually `public_html`. Verify this is the correct domain before replacing anything.
4. Back up any existing `index.html` or `index.php`.
5. Upload these files into the document root, keeping the same folder structure:
   - `index.html`
   - `privacy.html`
   - `favicon.svg`
   - `.htaccess` (a hidden file; enable "show hidden files" in File Manager to see it)
   - the `assets/` folder (`styles.css`, `main.js`)
6. Visit `https://interfaceai.io` and test navigation and contact links.
7. If the domain is not pointing to this Hostinger hosting plan, configure its DNS according to the hosting account's instructions and wait for propagation.
8. Enable SSL in Hostinger **before** relying on `.htaccess`, which redirects all traffic to HTTPS. Then check that `http://interfaceai.io` redirects to `https://`.
9. Send a test email to `contact@interface.io` and confirm it arrives.
10. Optionally verify the security headers at https://securityheaders.com.

If the site shows a 500 error after uploading `.htaccess`, the host does not allow one of its directives; rename the file to `.htaccess.off` and contact Hostinger support.

The site is static: no Node.js, database, build step, or server-side app is required. CSS and JavaScript are in `assets/` so that the Content-Security-Policy in `.htaccess` can block inline scripts.

**Note:** Uploading to GitHub does not automatically deploy to Hostinger. A separate deployment integration or manual upload is required.
