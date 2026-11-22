# RAGO — portfolio

Black-and-red portfolio site for music videos, cinematic pieces and short films. Plain HTML, CSS and JavaScript, so there's nothing to install.

## Files

| File | What it is |
|---|---|
| `index.html` | Page structure, About text, email and social links |
| `style.css` | Colours and layout (the colours are at the very top) |
| `script.js` | **Your video list** (top of the file) |
| `assets/portrait.jpg` | Your Polaroid, shown in the INFO panel |
| `assets/thumbs/` | Cover images for your videos (optional) |
| `assets/previews/` | Short silent loops that play when a video is in focus (optional) |

## Adding a video

Open `script.js`. At the top there are 6 blank project blocks. Fill one in:

```js
{
  title: "Night Drive",
  artist: "Artist Name",
  category: "music",            // "music", "cinematic" or "short"
  youtube: "https://www.youtube.com/watch?v=XXXXXXXXXXX",
  vimeo: "",
  thumb: "",                    // blank = uses the YouTube thumbnail
  preview: "assets/previews/nightdrive.mp4",   // optional
  date: "March 2026",
  place: "London",
  credits: [
    ["Director", "Rago"],
    ["DOP", "Name"],
    ["Editor", "Name"],
  ],
},
```

Blank blocks show up as empty red frames that say "ADD VIDEO". Delete the ones you don't need, or copy and paste a block to add more.

**Preview loops** make the site feel alive, like the strips on DONPROD. Export a 5–10 second clip with no audio at 720p, keep it under about 3 MB, and put it in `assets/previews/`.

**Vimeo videos** don't get an automatic thumbnail, so add a `thumb` image for those.

## Changing your details

In `index.html`, search for `hello@rago.com` and `yourhandle`, and replace them with your email and handles. Your bio is in the INFO section.

## Putting it online free (GitHub Pages)

1. Sign up at github.com.
2. Create a **new repository** called `yourusername.github.io` and set it to Public.
3. Click **"uploading an existing file"**. Drag in everything in this folder, including `assets`, then click **Commit changes**.
4. Go to **Settings → Pages**, choose branch `main` and folder `/ (root)`, then click **Save**.
5. After a minute or two the site is live at `https://yourusername.github.io`.

To update the site, edit a file on GitHub using the pencil icon and commit. The site refreshes on its own.

## Custom domain (optional, about £10/year)

Buy a domain (Cloudflare, Porkbun or Namecheap). In the repo, go to **Settings → Pages → Custom domain** and enter it. Then add the DNS records GitHub shows you at your domain provider, and tick **Enforce HTTPS**.
