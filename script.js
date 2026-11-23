/* ================================================================
   YOUR PROJECTS — the only part you need to edit.

   Each { ... } block is one video. They're blank for now; each blank
   one shows on the site as an empty red frame. Fill them in when
   you're ready, delete ones you don't need, or copy-paste to add more.

     title     – video name                    e.g. "Night Drive"
     artist    – artist / client / "Short film"
     category  – "music", "cinematic" or "short"
     youtube   – YouTube link   (use this OR vimeo)
     vimeo     – Vimeo link
     thumb     – optional cover image, e.g. "assets/thumbs/nightdrive.jpg"
                 (leave blank to use the YouTube thumbnail automatically)
     preview   – optional short silent loop that plays when the strip is
                 in focus, e.g. "assets/previews/nightdrive.mp4"
     date      – e.g. "March 2026"
     place     – e.g. "London"
     credits   – list of [role, name] pairs

   Order here = order on the site (top first).
================================================================ */
const PROJECTS = [
  {
    title: "",          // ← type the video's title here
    artist: "",         // ← and the artist
    category: "music",
    youtube: "https://www.youtube.com/watch?v=ZV2RTrbZaJE",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [
      ["Director", "Rago"],
      ["DOP", ""],
      ["Editor", ""],
    ],
  },
  {
    title: "",          // ← type the video's title here
    artist: "",         // ← and the artist
    category: "music",
    youtube: "https://www.youtube.com/watch?v=rdZJokQbXrc",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [["Director", "Rago"]],
  },
  {
    title: "",
    artist: "",
    category: "cinematic",
    youtube: "",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [["Director", "Rago"]],
  },
  {
    title: "",
    artist: "",
    category: "short",
    youtube: "",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [["Writer / Director", "Rago"]],
  },
  {
    title: "",
    artist: "",
    category: "music",
    youtube: "",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [["Director", "Rago"]],
  },
  {
    title: "",
    artist: "",
    category: "cinematic",
    youtube: "",
    vimeo: "",
    thumb: "",
    preview: "",
    date: "",
    place: "",
    credits: [["Director", "Rago"]],
  },
];


/* ================================================================
   You don't need to edit anything below here.
================================================================ */

const $ = s => document.querySelector(s);
const pad = n => String(n).padStart(2, "0");
const esc = (s = "") => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const ytId = u => (u || "").match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
const vmId = u => (u || "").match(/vimeo\.com\/(?:video\/)?(\d+)/)?.[1];
const titleOf = (p, i) => p.title || `Untitled ${pad(i + 1)}`;
const artistOf = p => p.artist || "Artist";
const coverOf = p => p.thumb || (ytId(p.youtube) ? `https://i.ytimg.com/vi/${ytId(p.youtube)}/maxresdefault.jpg` : "");

// Some YouTube videos have no high-res thumbnail; YouTube then sends a small grey
// placeholder (120px wide). When that happens, swap to the standard thumbnail.
document.addEventListener("load", e => {
  const img = e.target;
  if (img.tagName === "IMG" && img.src.includes("/maxresdefault.jpg") && img.naturalWidth <= 120) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}, true);
document.addEventListener("error", e => {
  const img = e.target;
  if (img.tagName === "IMG" && img.src.includes("/maxresdefault.jpg")) {
    img.src = img.src.replace("maxresdefault", "hqdefault");
  }
}, true);

/* ---------- build the reel ---------- */
const reel = $("#reel");
reel.innerHTML = PROJECTS.map((p, i) => {
  const cover = coverOf(p);
  return `
  <li class="vf" data-i="${i}" data-cat="${p.category}">
    <button class="strip" type="button" aria-label="Open ${esc(titleOf(p, i))}">
      ${cover ? `<img src="${esc(cover)}" alt="" loading="lazy">`
              : `<span class="slot">${pad(i + 1)} / ADD VIDEO</span>`}
      ${p.preview ? `<video src="${esc(p.preview)}" muted loop playsinline preload="none"></video>` : ""}
    </button>
    <div class="strip-label"><span>${esc(titleOf(p, i))}</span><span>${esc(artistOf(p))}</span></div>
  </li>`;
}).join("");

const items = () => [...reel.children].filter(li => !li.hidden);

/* ---------- which strip is in focus ---------- */
let activeLi = null;
function updateActive() {
  const visible = items();
  const mid = innerHeight / 2;
  let best = null, bestD = Infinity;
  for (const li of visible) {
    const r = li.getBoundingClientRect();
    const d = Math.abs(r.top + r.height / 2 - mid);
    if (d < bestD) { bestD = d; best = li; }
  }
  if (best === activeLi) return;
  activeLi?.classList.remove("is-active");
  activeLi?.querySelector("video")?.pause();
  activeLi?.querySelector(".strip")?.classList.remove("playing");
  activeLi = best;
  if (!best) return;
  best.classList.add("is-active");

  const v = best.querySelector("video");
  if (v && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    v.play().then(() => best.querySelector(".strip").classList.add("playing")).catch(() => {});
  }

  const i = +best.dataset.i, p = PROJECTS[i];
  $("#nowTitle").textContent = titleOf(p, i).toUpperCase();
  $("#nowCredit").textContent = artistOf(p).toUpperCase();
  const pos = visible.indexOf(best);
  $("#nowIndex").textContent = pad(pos + 1);
  [...$("#ticks").children].forEach((t, k) => t.classList.toggle("on", k === Math.round(pos / Math.max(visible.length - 1, 1) * 23)));
}
$("#ticks").innerHTML = "<i></i>".repeat(24);
addEventListener("scroll", () => requestAnimationFrame(updateActive), { passive: true });
addEventListener("resize", updateActive);

function refreshCount() {
  $("#total").textContent = pad(items().length);
  activeLi = null;
  updateActive();
}

/* ---------- category filter (bottom-left) ---------- */
document.querySelectorAll("[data-filter]").forEach(btn => btn.addEventListener("click", () => {
  const f = btn.dataset.filter;
  document.querySelectorAll("[data-filter]").forEach(b => b.classList.toggle("is-on", b === btn));
  [...reel.children].forEach(li => li.hidden = f !== "all" && li.dataset.cat !== f);
  scrollTo({ top: 0 });
  refreshCount();
}));

/* ---------- reel / grid switch (right) ---------- */
document.querySelectorAll("[data-view]").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll("[data-view]").forEach(b => b.classList.toggle("is-on", b === btn));
  document.body.classList.toggle("grid-view", btn.dataset.view === "grid");
  scrollTo({ top: 0 });
  refreshCount();
}));

/* ---------- project page ---------- */
const project = $("#project");
let current = 0, lastFocus = null;

function openProject(i) {
  current = i;
  const p = PROJECTS[i];
  const cover = coverOf(p);
  const playable = ytId(p.youtube) || vmId(p.vimeo);

  $("#pMedia").innerHTML = cover
    ? `<img src="${esc(cover)}" alt="">`
    : `<span class="slot">${playable ? "" : "NO VIDEO YET<br>ADD A YOUTUBE OR VIMEO LINK IN SCRIPT.JS"}</span>`;
  $("#pPlay").hidden = !playable;
  $("#pTitle").textContent = titleOf(p, i);
  $("#pArtist").textContent = artistOf(p);
  $("#pCredits").innerHTML = (p.credits || []).map(([r, n]) => `<dt>${esc(r)}</dt><dd>${esc(n || "—")}</dd>`).join("");
  $("#pDate").textContent = p.date || "";
  $("#pPlace").textContent = p.place || "";

  if (project.hidden) lastFocus = document.activeElement;
  project.hidden = false;
  project.querySelector(".p-scroll").scrollTop = 0;
  document.body.classList.add("locked");
  $("#pPlay").hidden ? project.querySelector("[data-close]").focus() : $("#pPlay").focus();
}

$("#pPlay").addEventListener("click", () => {
  const p = PROJECTS[current];
  const yt = ytId(p.youtube), vm = vmId(p.vimeo);
  const src = yt ? `https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&rel=0`
                 : `https://player.vimeo.com/video/${vm}?autoplay=1&dnt=1`;
  $("#pMedia").innerHTML = `<iframe src="${src}" allow="autoplay; fullscreen; picture-in-picture" allowfullscreen title="${esc(titleOf(p, current))}"></iframe>`;
  $("#pPlay").hidden = true;
});

function step(dir) {
  const visible = items().map(li => +li.dataset.i);
  const k = visible.indexOf(current);
  openProject(visible[(k + dir + visible.length) % visible.length]);
}
$("#pPrev").addEventListener("click", () => step(-1));
$("#pNext").addEventListener("click", () => step(1));

reel.addEventListener("click", e => {
  const li = e.target.closest("li");
  if (li) openProject(+li.dataset.i);
});

/* ---------- info panel ---------- */
const info = $("#info");
$("[data-open-info]").addEventListener("click", () => {
  lastFocus = document.activeElement;
  info.hidden = false;
  document.body.classList.add("locked");
  info.querySelector("[data-close]").focus();
});

/* ---------- closing ---------- */
function closeAll() {
  if (project.hidden && info.hidden) return;
  project.hidden = info.hidden = true;
  $("#pMedia").innerHTML = "";               // stops any playing video
  if (document.body.classList.contains("entered")) document.body.classList.remove("locked");
  lastFocus?.focus?.();
}
document.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeAll));
addEventListener("keydown", e => {
  if (e.key === "Escape") closeAll();
  if (!project.hidden && e.key === "ArrowRight") step(1);
  if (!project.hidden && e.key === "ArrowLeft") step(-1);
});
/* ---------- intro gate ---------- */
const gate = $("#gate");
function enter() {
  document.body.classList.add("entered");
  document.body.classList.remove("locked");
  gate.setAttribute("aria-hidden", "true");
  gate.inert = true;
  scrollTo({ top: 0 });
  setTimeout(refreshCount, 50);
}
function showGate() {
  closeAll();
  gate.inert = false;
  gate.removeAttribute("aria-hidden");
  document.body.classList.remove("entered");
  document.body.classList.add("locked");
  $("#enter").focus();
}
$("#enter").addEventListener("click", enter);
// scrolling down or pressing Enter/arrow on the intro also enters
gate.addEventListener("wheel", e => { if (e.deltaY > 20) enter(); }, { passive: true });
addEventListener("keydown", e => {
  if (!document.body.classList.contains("entered") && ["ArrowDown", "PageDown", " "].includes(e.key) && e.target === document.body) { e.preventDefault(); enter(); }
});
let touchY = null;
gate.addEventListener("touchstart", e => touchY = e.touches[0].clientY, { passive: true });
gate.addEventListener("touchend", e => {
  if (touchY !== null && gate.scrollTop + gate.clientHeight >= gate.scrollHeight - 2 && touchY - e.changedTouches[0].clientY > 60) enter();
  touchY = null;
});

// "RGO-FILMS" in the corner brings the intro back
$("[data-home]").addEventListener("click", e => { e.preventDefault(); showGate(); });

/* ---------- crosshair cursor (mouse only) ---------- */
if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
  const c = $("#cursor");
  document.body.classList.add("has-cursor");
  addEventListener("mousemove", e => {
    c.classList.add("ready");
    c.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    c.classList.toggle("hot", !!e.target.closest("button, a"));
  });
}

refreshCount();
