/* =====================================================================
   CONFIG — BAGIAN YANG BOLEH KAMU EDIT (cuma di sini!)
   ---------------------------------------------------------------------
   CARA GANTI GAMBAR : taruh file di folder "gambar", lalu tulis path-nya
                       di "gambar" (contoh: "gambar/donat baru.jpeg").
   CARA TAMBAH VARIAN: tambah satu baris { nama: "Nama Rasa", gambar: "gambar/file.jpeg" }
                       di dalam daftar "varian". Hapus baris = hapus varian.
   "warna" = warna aksen kartu varian (kode hex, boleh dikosongkan).
   Kalau gambar kosong/tidak ketemu, otomatis tampil placeholder pastel 🍩.
   ===================================================================== */
const CONFIG = {
  namaToko: "DONAT KEMBAR",
  nomorWA: "083115472370",                       // format 08xxxx, otomatis jadi 62xxxx
  linkInstagram: "https://www.instagram.com/donat_kembar_2/",
  alamat: "Tanjung Beringin, Pasar 4.5, Kecamatan Hinai",
  harga: 2000,                                    // harga per biji (semua varian)
  tagline: "Donat empuk dan bomboloni isi lumer, digoreng pagi ini khusus buat kamu.",

  // Hero: dua foto "kembar" (isi 2 path gambar)
  gambarHero: ["gambar/5.donat coklat.jpeg", "gambar/8.donat strawberry.jpeg"],

  // Galeri mini di Home (isi 4 path gambar)
  gambarGaleri: [
    "gambar/3.cromboloni strawberry.jpeg",
    "gambar/6.donat matcha.jpeg",
    "gambar/1.cromboloni blueberry.jpeg",
    "gambar/7.donat oreo strawberry.jpeg"
  ],

  // Daftar varian menu
  varian: [
    { nama: "Bomboloni Blueberry",   gambar: "gambar/1.cromboloni blueberry.jpeg",   warna: "#5b4b9a" },
    { nama: "Bomboloni Coklat",      gambar: "gambar/2.cromboloni coklat.jpeg",      warna: "#6b3f2a" },
    { nama: "Bomboloni Strawberry",  gambar: "gambar/3.cromboloni strawberry.jpeg",  warna: "#d8325f" },
    { nama: "Donat Coklat Keju",      gambar: "gambar/4.donat coklat keju.jpeg",      warna: "#8a5a3c" },
    { nama: "Donat Coklat",           gambar: "gambar/5.donat coklat.jpeg",           warna: "#4a2a1d" },
    { nama: "Donat Matcha",           gambar: "gambar/6.donat matcha.jpeg",           warna: "#7c8a43" },
    { nama: "Donat Oreo Strawberry",  gambar: "gambar/7.donat oreo strawberry.jpeg",  warna: "#c42a6c" },
    { nama: "Donat Strawberry",       gambar: "gambar/8.donat strawberry.jpeg",       warna: "#f0457e" },
    { nama: "Donat Coklat Kacang", gambar: "gambar/coklat kacang.jpeg", warna: "#6b3f2a" },
    { nama: "Donat Taro Keju", gambar: "gambar/taro.jpeg", warna: "#8e55bd" },
    { nama: "Donnat Matcha Keju", gambar: "gambar/matcha keju.jpeg", warna: "#7c8a43" },
    { nama: "Donat Tiramisu Kacang", gambar: "gambar/tiramisu kacang.jpeg", warna: "#b49a78" }
  ]
};
/* ===================== AKHIR CONFIG — jangan ubah di bawah ===================== */

(function () {
  "use strict";
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const rupiah = n => "Rp" + n.toLocaleString("id-ID");
  const cart = {};            // { index: jumlah }
  const picks = {};           // jumlah di kartu menu (sebelum ditekan Pesan)

  /* ---------- Gambar dengan placeholder ---------- */
  function img(src, alt) {
    const i = new Image();
    i.alt = alt || "";
    i.loading = "lazy";
    i.addEventListener("error", () => i.replaceWith(document.createTextNode("🍩")));
    if (!src) { queueMicrotask(() => i.dispatchEvent(new Event("error"))); return i; }
    i.src = encodeURI(src);
    return i;
  }
  function frame(cls, src, alt) {
    const d = document.createElement("div");
    d.className = cls;
    d.appendChild(img(src, alt));
    return d;
  }

  /* ---------- Teks dari CONFIG ---------- */
  const waNum = CONFIG.nomorWA.replace(/\D/g, "").replace(/^0/, "62");
  const nama = CONFIG.namaToko;
  const namaCantik = nama.toLowerCase().replace(/(^|\s)\S/g, m => m.toUpperCase());
  document.title = namaCantik + " — Donat & Bomboloni " + rupiah(CONFIG.harga) + " di Hinai";
  $("#brandName").textContent = namaCantik;
  $("#tagline").textContent = CONFIG.tagline;
  $("#fBig").textContent = namaCantik;
  $("#fText").textContent = nama + " — " + CONFIG.alamat;
  $("#copy").textContent = "© " + new Date().getFullYear() + " " + nama + ". Dibuat dengan manis.";
  $("#igLink").href = CONFIG.linkInstagram;
  $("#heroWA").href = "https://wa.me/" + waNum + "?text=" + encodeURIComponent("Halo " + nama + ", saya mau pesan donat 🍩");

  /* ---------- Hero kembar + sprinkles ---------- */
  const art = $("#heroArt");
  art.prepend(frame("twin a", CONFIG.gambarHero[0], "Donat"), frame("twin b", CONFIG.gambarHero[1], "Donat"));

  const spr = $("#sprinkles");
  const warnaSp = ["#f0457e", "#fffaf3", "#2b1610", "#7c8a43", "#fbc9d9"];
  for (let i = 0; i < 16; i++) {
    const s = document.createElement("span");
    s.className = "sp";
    s.style.cssText = `left:${(i * 61 + 7) % 97}%;top:${(i * 37 + 5) % 92}%;background:${warnaSp[i % 5]};--r:${(i * 47) % 180}deg;--t:${7 + (i % 5)}s;--d:-${i}s`;
    spr.appendChild(s);
  }

  /* ---------- Marquee nama varian ---------- */
  const names = CONFIG.varian.map(v => v.nama);
  $("#track").innerHTML = names.concat(names).concat(names).concat(names).map(n => `<span>${n}</span>`).join("");

  /* ---------- Galeri ---------- */
  CONFIG.gambarGaleri.slice(0, 4).forEach(src => $("#gallery").appendChild(frame("g reveal", src, "Galeri donat")));

  /* ---------- Menu ---------- */
  CONFIG.varian.forEach((v, i) => {
    picks[i] = 1;
    const c = document.createElement("article");
    c.className = "card reveal";
    c.dataset.grp = v.nama.split(" ")[0];
    if (v.warna) c.style.setProperty("--c", v.warna);
    c.appendChild(frame("thumb", v.gambar, v.nama));
    const info = document.createElement("div");
    info.className = "info";
    info.innerHTML = `<h3></h3><span class="price">${rupiah(CONFIG.harga)} / biji</span>
      <div class="buy"><div class="qty"><button aria-label="Kurangi" data-a="min">−</button><b>1</b><button aria-label="Tambah" data-a="plus">+</button></div>
      <button class="add">Pesan</button></div>`;
    $("h3", info).textContent = v.nama;
    c.appendChild(info);
    info.addEventListener("click", e => {
      const b = e.target.closest("button");
      if (!b) return;
      const out = $("b", info);
      if (b.dataset.a === "min") picks[i] = Math.max(1, picks[i] - 1);
      else if (b.dataset.a === "plus") picks[i] = Math.min(99, picks[i] + 1);
      else if (b.classList.contains("add")) {
        cart[i] = Math.min(99, (cart[i] || 0) + picks[i]);
        toast(`${picks[i]} ${v.nama} masuk keranjang`);
        picks[i] = 1;
        renderCart(true);
      }
      out.textContent = picks[i];
    });
    $("#grid").appendChild(c);
  });

  /* ---------- Filter menu ---------- */
  const grup = ["Semua"].concat([...new Set(CONFIG.varian.map(v => v.nama.split(" ")[0]))]);
  grup.forEach((g, i) => {
    const b = document.createElement("button");
    b.className = "chip" + (i ? "" : " on");
    b.textContent = g;
    b.onclick = () => {
      $$(".chip").forEach(x => x.classList.toggle("on", x === b));
      $$(".card").forEach(c => { c.hidden = i && c.dataset.grp !== g; });
    };
    $("#chips").appendChild(b);
  });
  if (grup.length < 3) $("#chips").style.display = "none";

  /* ---------- Keranjang ---------- */
  function renderCart(bump) {
    const ul = $("#items");
    ul.innerHTML = "";
    let total = 0, count = 0;
    Object.keys(cart).forEach(k => {
      const q = cart[k], v = CONFIG.varian[k];
      total += q * CONFIG.harga; count += q;
      const li = document.createElement("li");
      li.appendChild(frame("ph", v.gambar, v.nama));
      const t = document.createElement("div");
      t.innerHTML = `<div class="nm"></div><div class="sub">${rupiah(CONFIG.harga)} × ${q} = ${rupiah(q * CONFIG.harga)}</div>`;
      $(".nm", t).textContent = v.nama;
      const ctl = document.createElement("div");
      ctl.className = "ctl";
      ctl.innerHTML = `<button data-k="${k}" data-d="-1" aria-label="Kurangi">−</button><b>${q}</b><button data-k="${k}" data-d="1" aria-label="Tambah">+</button><button class="del" data-k="${k}" data-d="x" aria-label="Hapus ${v.nama}">🗑</button>`;
      li.append(t, ctl);
      ul.appendChild(li);
    });
    const has = count > 0;
    $("#empty").style.display = has ? "none" : "block";
    $("#form").style.display = has ? "grid" : "none";
    $("#totalRow").style.display = has ? "flex" : "none";
    $("#total").textContent = rupiah(total);
    const bd = $("#badge");
    bd.textContent = count; bd.dataset.n = count;
    if (bump) { const f = $("#cartBtn"); f.classList.remove("pop"); void f.offsetWidth; f.classList.add("pop"); }
  }
  $("#items").addEventListener("click", e => {
    const b = e.target.closest("button[data-k]");
    if (!b) return;
    const k = b.dataset.k, d = b.dataset.d;
    if (d === "x") delete cart[k];
    else { cart[k] += +d; if (cart[k] <= 0) delete cart[k]; if (cart[k] > 99) cart[k] = 99; }
    renderCart();
  });

  const panel = $("#cart"), ov = $("#overlay");
  function openCart(o) {
    panel.classList.toggle("open", o);
    ov.classList.toggle("show", o);
    panel.setAttribute("aria-hidden", !o);
    document.body.style.overflow = o ? "hidden" : "";
  }
  $("#cartBtn").onclick = () => openCart(true);
  $("#closeCart").onclick = ov.onclick = () => openCart(false);
  document.addEventListener("keydown", e => { if (e.key === "Escape") { openCart(false); setNav(false); } });

  /* ---------- Form + WhatsApp ---------- */
  function setErr(id, inputId, msg) {
    $(id).textContent = msg;
    $(inputId).classList.toggle("bad", !!msg);
    return !msg;
  }
  $("#sendWA").addEventListener("click", () => {
    const n = $("#fNama").value.trim();
    const hp = $("#fHP").value.trim();
    const digits = hp.replace(/\D/g, "");
    const okN = setErr("#eNama", "#fNama", n ? "" : "Nama belum diisi nih, biar kami tahu siapa yang pesan 😊");
    const okH = setErr("#eHP", "#fHP", !hp ? "Nomor HP-nya diisi dulu ya, supaya bisa kami hubungi."
      : (digits.length < 9 || digits.length > 15 || !/^[0-9+\-\s()]+$/.test(hp)) ? "Nomor HP kurang pas. Coba tulis angkanya saja, contoh 08123456789." : "");
    if (!okN || !okH) { (okN ? $("#fHP") : $("#fNama")).focus(); return; }

    const metode = $("input[name=metode]:checked").value;
    const cat = $("#fCatatan").value.trim();
    let total = 0;
    const baris = Object.keys(cart).map(k => {
      const q = cart[k], sub = q * CONFIG.harga;
      total += sub;
      return `- ${CONFIG.varian[k].nama} x ${q} = ${rupiah(sub)}`;
    });
    const pesan = `Halo ${nama}, saya mau pesan donat:\n${baris.join("\n")}\nTotal: ${rupiah(total)}\nNama: ${n}\nNo HP: ${hp}\nMetode: ${metode}\nAlamat/Catatan: ${cat || "-"}\nTerima kasih!`;
    window.open("https://wa.me/" + waNum + "?text=" + encodeURIComponent(pesan), "_blank", "noopener");
  });
  ["#fNama", "#fHP"].forEach(s => $(s).addEventListener("input", () => { $(s).classList.remove("bad"); $(s === "#fNama" ? "#eNama" : "#eHP").textContent = ""; }));

  /* ---------- Toast ---------- */
  let tt;
  function toast(m) {
    const t = $("#toast");
    t.textContent = m; t.classList.add("show");
    clearTimeout(tt); tt = setTimeout(() => t.classList.remove("show"), 1800);
  }

  /* ---------- Navigasi (single page) ---------- */
  const burger = $("#burger"), links = $("#links");
  function setNav(o) { links.classList.toggle("open", o); burger.setAttribute("aria-expanded", o); }
  burger.onclick = () => setNav(!links.classList.contains("open"));

function show(page, push) {
    const halaman = ["home", "menu", "about", "contact"];

    if (!halaman.includes(page)) page = "home";

    $$(".page").forEach(p => {
        p.classList.toggle("active", p.id === "page-" + page);
    });

    $$(".links a").forEach(a => {
        a.classList.toggle("active", a.dataset.page === page);
    });

    if (push) history.pushState(null, "", "#" + page);

    window.scrollTo({ top: 0, behavior: "smooth" });
    setNav(false);
    setTimeout(observe, 50);
}
  document.addEventListener("click", e => {
    const el = e.target.closest("[data-page]");
    if (!el) return;
    e.preventDefault();
    show(el.dataset.page, true);
  });
  window.addEventListener("popstate", () => show(location.hash.slice(1), false));

  /* ---------- Animasi scroll ---------- */
  const io = "IntersectionObserver" in window ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
  }), { threshold: .12 }) : null;
  function observe() {
    $$(".reveal:not(.in)").forEach((el, i) => {
      if (!io) return el.classList.add("in");
      el.style.transitionDelay = (i % 4) * 70 + "ms";
      io.observe(el);
    });
  }

  renderCart();
  show(location.hash.slice(1), false);
  window.scrollTo(0, 0);
})();
