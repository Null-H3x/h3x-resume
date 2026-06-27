# H3x-Resume

Static resume website in the [H3x-Dash](https://github.com/Null-H3x/h3x-dash) cyberpunk theme. Built for drag-and-drop deployment on Namecheap cPanel or any static host.

## Quick start

Edit `data/resume.json` for the live site, or update `Resume.docx` and re-sync the JSON. Upload to `public_html` (see [DEPLOY.md](DEPLOY.md)).

Local preview:

```bash
python -m http.server 8080
```

Open `http://localhost:8080`.

## Structure

```
index.html          Main page
css/style.css       Theme
js/resume.js        Renders resume.json
data/resume.json    All resume content
```

## License

MIT
