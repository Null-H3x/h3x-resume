# Deploy to Namecheap cPanel

This is a **static** resume site — no Python, Node, or database required. Upload the files and it works.

## Folder structure

```
public_html/          ← your cPanel web root (or a subdomain folder)
├── index.html
├── css/
│   └── style.css
├── js/
│   └── resume.js
└── data/
    └── resume.json   ← edit this file to update your resume
```

## Drag-and-drop upload

1. Log in to **Namecheap** → **Hosting List** → **Manage** → **cPanel**.
2. Open **File Manager**.
3. Go to `public_html` (main domain) or the folder for your subdomain.
4. If replacing an old site, back up existing files first.
5. Upload these files keeping the folder structure:
   - Drag `index.html` into `public_html`
   - Create folders `css`, `js`, and `data` if they do not exist
   - Upload `style.css` → `css/`, `resume.js` → `js/`, `resume.json` → `data/`
6. Visit your domain — the site should load immediately.

**Alternative:** Zip the project on your PC, upload the zip to cPanel, then use **Extract** in File Manager.

## Edit your resume

All content lives in **`data/resume.json`**. In cPanel File Manager:

1. Navigate to `public_html/data/resume.json`
2. Right-click → **Edit** (or **Code Editor**)
3. Change name, experience, skills, links, etc.
4. Save — refresh your browser to see updates

No rebuild step. No compile step.

## Optional: custom domain / SSL

- **SSL:** cPanel → **SSL/TLS Status** → run AutoSSL (usually free with Namecheap).
- **Subdomain:** cPanel → **Subdomains** → point e.g. `resume.yourdomain.com` to a folder, upload files there.

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Blank page / "Could not load resume.json" | Ensure `data/resume.json` exists and paths match the folder structure |
| Styles missing | Confirm `css/style.css` is in `css/`, not the root |
| Old content after edit | Hard refresh (Ctrl+F5) or clear browser cache |

## Local preview

Open a terminal in this project folder and run:

```bash
python -m http.server 8080
```

Then visit `http://localhost:8080` (fetch requires a local server, not `file://`).
