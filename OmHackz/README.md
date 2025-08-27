OmHackz Portfolio + Blog (Static HTML + JSONBin)

Setup
- Open `admin.html` in your browser.
- Enter your JSONBin API key in the JSONBin Settings section.
- Create two bins in JSONBin (or let the UI create them via API):
  - Posts bin should contain an object like: `{ "posts": [] }`
  - Downloads bin should contain an object like: `{ "items": [] }`
- Paste each bin's ID into the corresponding input and Save.

Usage
- Blog: add, edit, delete posts from `admin.html` → renders on `blog.html`.
- Downloads: add, edit, delete items from `admin.html` → renders on `downloads.html`.

Notes
- Keys and IDs are saved only in your browser LocalStorage.
- The site uses Poppins, white background, black text, and Font Awesome icons.


