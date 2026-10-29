# Deploy the website to Hostinger

1. Sign in to Hostinger **hPanel** with an account that has website hosting access.
2. Open **Websites → Manage/Dashboard → Files → File Manager** for `interfaceai.io`.
3. Open the website's document root, usually `public_html`. Verify this is the correct domain before replacing anything.
4. Back up any existing `index.html` or `index.php`.
5. Upload the repository's root `index.html` into the document root.
6. Visit `https://interfaceai.io` and test navigation and contact links.
7. If the domain is not pointing to this Hostinger hosting plan, configure its DNS according to the hosting account's instructions and wait for propagation.
8. Enable/check SSL in Hostinger, and confirm the contact mailbox works.

The site is static: no Node.js, database, build step, or server-side app is required. The SVG logo, CSS and JavaScript are embedded in the HTML.

**Note:** Uploading to GitHub does not automatically deploy to Hostinger. A separate deployment integration or manual upload is required.
