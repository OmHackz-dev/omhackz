OmHackz — Portfolio + Blog (Static HTML + JSONBin)

Overview
- A fast, static site for portfolio, blog, downloads, and a private admin page.
- Pure HTML/CSS/JS with separate files; no build step required.
- Content (blog posts and downloads) is managed in-browser and saved to JSONBin.

Features
- Poppins typography, white background, black text
- Font Awesome icons (`https://site-assets.fontawesome.com/releases/v6.7.2/css/all.css`)
- Clean routes via `vercel.json` (`/blog`, `/downloads`, `/links`, `/admin`)
- Links page auto-parses `links.md`
- Admin UI writes to JSONBin; credentials stored in LocalStorage

Pages
- `/` → Home
- `/blog` → Blog (reads posts from JSONBin)
- `/downloads` → Downloads (reads items from JSONBin)
- `/links` → Links (renders from `links.md`)
- `/admin` → Admin (configure JSONBin + CRUD posts/downloads)

Project Structure
```
index.html
blog.html
downloads.html
links.html
admin.html
css/styles.css
js/main.js
js/storage.js
js/blog.js
js/downloads.js
js/admin.js
links.md
images/
vercel.json
env.txt (optional, local dev convenience)
```

Quick Start (Local)
1) Open `admin.html` in a browser.
2) In JSONBin Settings:
   - Paste your JSONBin API key
   - Provide two Bin IDs:
     - Posts bin with `{ "posts": [] }`
     - Downloads bin with `{ "items": [] }`
3) Save. The keys/IDs are stored only in your browser.

Optional: env.txt Bootstrap
- You can place an `env.txt` in the project root for local convenience; it will be read at runtime and stored to LocalStorage.
- Supported keys (either form works):
```
Json Bin api key = <YOUR_MASTER_KEY>
Posts Bin bin id = <BIN_ID_FOR_POSTS>
Downloads Bin Bin id = <BIN_ID_FOR_DOWNLOADS>
# or
JSON_BIN_API_KEY = <YOUR_MASTER_KEY>
POSTS_BIN_ID = <BIN_ID_FOR_POSTS>
DOWNLOADS_BIN_ID = <BIN_ID_FOR_DOWNLOADS>
```

Deploy on Vercel
1) Push this repository to GitHub.
2) Import into Vercel (Framework Preset: “Other”).
3) No build command required; Output directory: project root.
4) `vercel.json` provides clean URL rewrites:
```
{
  "cleanUrls": true,
  "trailingSlash": false,
  "rewrites": [
    { "source": "/", "destination": "/index.html" },
    { "source": "/blog", "destination": "/blog.html" },
    { "source": "/downloads", "destination": "/downloads.html" },
    { "source": "/links", "destination": "/links.html" },
    { "source": "/admin", "destination": "/admin.html" }
  ]
}
```

Security Note
- The JSONBin API key is used client-side and stored in LocalStorage. For public repositories, do NOT commit your API key. Prefer entering the key at runtime via the Admin page. If you must use `env.txt`, keep it out of version control.

License
- MIT — do what you want, attribution appreciated.


