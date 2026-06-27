# Deploy H3x-Resume to Namecheap cPanel

This site is **100% static** — no Python, Node, database, or build step on the server. You upload files; the browser does the rest.

---

## What you need before starting

- A Namecheap hosting plan with **cPanel** (Shared Hosting, etc.)
- Your domain pointed at Namecheap (usually automatic when you buy domain + hosting together)
- The site files from this repo on your PC (`C:\Users\H3x\h3x-resume`)

---

## Files to upload

Upload **only** these (not `.git`, not `Resume.docx` unless you want it downloadable):

```
public_html/
├── index.html
├── .htaccess          ← optional but recommended
├── css/
│   └── style.css
├── js/
│   └── resume.js
└── data/
    └── resume.json
```

Your live resume content comes from `data/resume.json`. To change the site after upload, edit that file in cPanel **or** update `Resume.docx` locally, run `python scripts/parse_resume.py`, and re-upload `data/resume.json`.

---

## Method A — Zip upload (easiest for first time)

### Step 1: Create a zip on your PC

1. Open `C:\Users\H3x\h3x-resume`
2. Select these items:
   - `index.html`
   - `.htaccess`
   - the `css` folder
   - the `js` folder
   - the `data` folder
3. Right-click → **Send to** → **Compressed (zipped) folder**
4. Name it something like `h3x-resume.zip`

### Step 2: Log in to Namecheap

1. Go to [https://www.namecheap.com](https://www.namecheap.com) and sign in
2. Click **Dashboard** → **Hosting List**
3. Click **Manage** next to your hosting plan
4. Click **Go to cPanel** (or **cPanel** button)

### Step 3: Open File Manager

1. In cPanel, find the **Files** section
2. Click **File Manager**
3. When asked for directory, choose **Web Root** (`public_html`) and click **Go**

You should now see `public_html` — this is your website root.

### Step 4: Clean up default page (if present)

If you see `index.html` or a `cgi-bin` folder from a default “coming soon” page:

1. Select the old `index.html` (if any)
2. Click **Delete** (or rename it to `index.html.old` as backup)

### Step 5: Upload and extract the zip

1. Click **Upload** in the top toolbar
2. Drag `h3x-resume.zip` into the upload area (or click **Select File**)
3. Wait until upload reaches 100%
4. Go back to **File Manager** (link at bottom of upload page)
5. In `public_html`, find `h3x-resume.zip`
6. Right-click the zip → **Extract**
7. If files extract into a subfolder like `h3x-resume/`, open that folder, **Select All**, click **Move**, and move everything up into `public_html` itself  
   Your URL must serve `public_html/index.html`, not `public_html/h3x-resume/index.html`
8. Delete the empty subfolder and the `.zip` when done

### Step 6: Verify folder structure

In `public_html`, you should see:

```
index.html
.htaccess
css/style.css
js/resume.js
data/resume.json
```

Click **+ Settings** (top right) and enable **Show Hidden Files** if you don’t see `.htaccess`.

### Step 7: Visit your site

Open your browser and go to:

- `https://yourdomain.com`  
  or whatever domain Namecheap assigned

You should see the H3x-Resume site with your name and content.

---

## Method B — Drag-and-drop upload (no zip)

1. Follow Steps 2–4 above to reach `public_html`
2. Click **Upload** and upload `index.html` and `.htaccess`
3. Click **+ Folder** and create folders: `css`, `js`, `data`
4. Open the `css` folder → **Upload** → upload `style.css`
5. Open the `js` folder → **Upload** → upload `resume.js`
6. Open the `data` folder → **Upload** → upload `resume.json`
7. Visit your domain

---

## Enable HTTPS (SSL)

Namecheap usually includes free SSL:

1. In cPanel, open **SSL/TLS Status** (or **AutoSSL**)
2. Click **Run AutoSSL** or **Install** for your domain
3. Wait a few minutes, then visit `https://yourdomain.com`

---

## Use a subdomain (optional)

Example: `resume.yourdomain.com`

1. cPanel → **Domains** → **Subdomains**
2. Create subdomain `resume` → document root will be something like `public_html/resume`
3. Upload the site files into **that** folder instead of root `public_html`
4. Run AutoSSL for the subdomain

---

## Updating the site later

### Quick edit (one field, typo, etc.)

1. cPanel → **File Manager** → `public_html/data/resume.json`
2. Right-click → **Edit** or **Code Editor**
3. Save → hard refresh browser (**Ctrl+F5**)

### Full update from Word resume

1. On your PC, edit `Resume.docx`
2. Run: `python scripts/parse_resume.py`
3. Re-upload **only** `data/resume.json` to cPanel (overwrites the old one)

---

## Troubleshooting

| Problem | Likely cause | Fix |
|---------|--------------|-----|
| “Index of /” directory listing | No `index.html` in `public_html` | Move `index.html` to web root |
| Unstyled plain page | `css/style.css` missing or wrong path | Confirm `css/style.css` exists |
| “Could not load resume.json” | Missing or wrong `data/` folder | Upload `data/resume.json` |
| 404 on homepage | Files in wrong subfolder | Move contents to `public_html`, not a nested folder |
| Old content after edit | Browser cache | Ctrl+F5 or try incognito |
| Site shows Namecheap default page | Old `index.html` still present | Delete/rename default page |

---

## Local preview (before uploading)

On your PC, in the project folder:

```powershell
cd C:\Users\H3x\h3x-resume
python -m http.server 8080
```

Open `http://localhost:8080` — do **not** double-click `index.html` directly (the browser blocks loading `resume.json` from disk).

---

## Need help from Namecheap?

- [Namecheap cPanel docs](https://www.namecheap.com/support/knowledgebase/category/hosting/cpanel/)
- Live chat from your Namecheap dashboard if File Manager or DNS issues persist
