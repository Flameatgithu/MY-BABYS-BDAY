/* ═══════════════════════════════════════════════════════════════
   alishba-birthday · app.js
   Features: config hydration, scroll reveals, chapter rail,
   confetti, the quiz, the candle ceremony, the sealed note,
   and a generative soft melody (no audio files, no autoplay).
   ═══════════════════════════════════════════════════════════════ */

(function () {
  "use strict";

  var C = window.CONFIG || {};
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var $$ = function (sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); };

  function el(tag, cls, text) {
    var node = document.createElement(tag);
    if (cls) node.className = cls;
    if (text != null) node.textContent = text;
    return node;
  }
  function getPath(path, obj) {
    return path.split(".").reduce(function (acc, key) {
      return acc == null ? undefined : acc[key];
    }, obj);
  }
  var ROMANS = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII"];

  /* ── 1 · Hydrate simple text bindings ───────────────────────── */

  $$("[data-config]").forEach(function (node) {
    var val = getPath(node.getAttribute("data-config"), C);
    if (typeof val === "string") node.textContent = val;
  });

  $$("[data-year]").forEach(function (n) { n.textContent = String(new Date().getFullYear()); });

  /* ── 2 · Letter ─────────────────────────────────────────────── */

  var letterBody = $("#letter-body");
  if (letterBody && C.letter && C.letter.body) {
    letterBody.innerHTML = "";
    C.letter.body.forEach(function (para) {
      letterBody.appendChild(el("p", null, para));
    });
  }

  /* ── 3 · Poems ──────────────────────────────────────────────── */

  var poemList = $("#poem-list");
  if (poemList && C.poems) {
    poemList.innerHTML = "";
    C.poems.forEach(function (poem, i) {
      var card = el("article", "poem-card");
      card.setAttribute("data-reveal", "");
      card.appendChild(el("span", "poem-num", "poem " + (ROMANS[i] || i + 1)));
      card.appendChild(el("h3", "poem-title", poem.title));
      card.appendChild(el("p", "poem-text", poem.text));
      poemList.appendChild(card);
    });
  }

  /* ── 4 · Notes + photos ─────────────────────────────────────── */

  var noteGrid = $("#note-grid");
  if (noteGrid && C.notes) {
    noteGrid.innerHTML = "";
    C.notes.forEach(function (text, i) {
      var card = el("article", "note-card");
      card.setAttribute("data-reveal", "");
      card.appendChild(el("p", "note-label", "keep no. " + (i + 1)));
      card.appendChild(el("p", "note-text", text));
      noteGrid.appendChild(card);
    });
  }

  var photoStrip = $("#photo-strip");
  var photoStore = "giftphoto-";
  function storeGet(i) { try { return localStorage.getItem(photoStore + i); } catch (e) { return null; } }
  function storeSet(i, data) { try { localStorage.setItem(photoStore + i, data); } catch (e) { /* full or blocked — this session only */ } }

  (function photos() {
    if (!photoStrip || !C.photos) return;
    photoStrip.innerHTML = "";

    var picker = document.createElement("input");
    picker.type = "file";
    picker.accept = "image/*";
    picker.style.display = "none";
    var picking = -1;
    picker.addEventListener("change", function () {
      var f = picker.files && picker.files[0];
      if (f && picking > -1) applyPhoto(picking, f, true);
      picker.value = "";
      picking = -1;
    });
    photoStrip.appendChild(picker);

    function setPhoto(i, url, alt) {
      var fig = photoStrip.children[i];
      if (!fig) return;
      var slot = $(".slot", fig);
      var empty = $(".slot-empty", slot);
      if (empty) empty.remove();
      var old = $("img", slot);
      if (old) old.remove();
      var img = el("img");
      img.src = url;
      img.alt = alt || "A shared memory";
      img.loading = "lazy";
      slot.appendChild(img);
      fig.classList.add("has-photo");
    }

    function makeEmptySlot(fig, i, missing) {
      var slot = $(".slot", fig);
      var old = $("img", slot);
      if (old) old.remove();
      var note = el("div", "slot-empty");
      if (missing) {
        note.appendChild(el("span", null, "photo on its way —"));
        note.appendChild(el("span", null, "save it as " + (C.photos[i] && C.photos[i].src.replace(/\.[a-z0-9]+$/i, "") || "photos/us-" + (i + 1))));
      } else {
        note.appendChild(el("span", null, "tap to add a photo —"));
        note.appendChild(el("span", null, "or drop one right on me"));
      }
      if (!missing) note.title = "Add a photo";
      note.addEventListener("click", function () {
        picking = i;
        picker.click();
      });
      slot.appendChild(note);
      fig.classList.remove("has-photo");
    }

    function applyPhoto(i, file, persist) {
      if (!file || !file.type || file.type.indexOf("image/") !== 0) return;
      var reader = new FileReader();
      reader.onload = function () {
        var url = String(reader.result);
        setPhoto(i, url, C.photos[i].caption || "A memory");
        if (persist && url.length < 1400000) storeSet(i, url);
      };
      reader.readAsDataURL(file);
    }

    /* Try the configured extension first, then common ones — so
       us-1.jpg / us-1.jpeg / us-1.png / us-1.webp all work. */
    var PHOTO_EXTS = ["jpg", "jpeg", "png", "webp", "jfif", "avif", "gif"];
    function extOf(src) {
      var m = /\.([a-z0-9]+)$/i.exec(src);
      return m ? m[1].toLowerCase() : "jpg";
    }

    function attemptFileLoad(fig, i, base, ext) {
      var queue = [ext || "jpg"].concat(PHOTO_EXTS.filter(function (x) { return x !== (ext || "jpg"); }));
      function attempt(k) {
        var slot = $(".slot", fig);
        var old = $("img", slot);
        if (old) old.remove();
        var img = el("img");
        img.alt = C.photos[i].caption || "A shared memory";
        img.loading = "lazy";
        img.addEventListener("error", function () {
          if (k < queue.length - 1) attempt(k + 1);
          else makeEmptySlot(fig, i, true);
        });
        img.src = base + "." + queue[k];
        slot.appendChild(img);
        fig.classList.add("has-photo");
      }
      attempt(0);
    }

    C.photos.forEach(function (photo, i) {
      var stored = storeGet(i);
      var fig = el("figure", "polaroid");
      var slot = el("div", "slot");
      fig.appendChild(slot);

      if (photo.src) {
        attemptFileLoad(fig, i, photo.src.replace(/\.[a-z0-9]+$/i, ""), extOf(photo.src));
      } else if (stored) {
        setPhoto(i, stored, photo.caption || "A shared memory");
      } else {
        makeEmptySlot(fig, i, false);
      }

      fig.appendChild(el("figcaption", "cap", photo.caption || ""));

      ["dragenter", "dragover"].forEach(function (evt) {
        fig.addEventListener(evt, function (e) {
          e.preventDefault();
          fig.classList.add("drop-hover");
        });
      });
      fig.addEventListener("dragleave", function () { fig.classList.remove("drop-hover"); });
      fig.addEventListener("dragend", function () { fig.classList.remove("drop-hover"); });
      fig.addEventListener("drop", function (e) {
        e.preventDefault();
        fig.classList.remove("drop-hover");
        var f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) applyPhoto(i, f, true);
      });

      photoStrip.appendChild(fig);
    });
  })();

  /* ── 5 · Envelope card items ────────────────────────────────── */

  var envList = $("#env-list");
  if (envList && C.envelope && C.envelope.items) {
    envList.innerHTML = "";
    C.envelope.items.forEach(function (item) {
      envList.appendChild(el("li", null, item));
    });
  }

  /* ── 6 · Confetti ───────────────────────────────────────────── */

  var fxCanvas = $("#fx");
  var fxCtx = fxCanvas ? fxCanvas.getContext("2d") : null;
  var fxParts = [];
  var fxRAF = null;
  var PALETTE = ["#C4485C", "#E4C079", "#F6E7D2", "#C88A4F", "#E08086", "#B8926A", "#fff8ef", "#8C3B54"];

  function fxResize() {
    if (!fxCanvas) return;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    fxCanvas.width = window.innerWidth * dpr;
    fxCanvas.height = window.innerHeight * dpr;
    fxCanvas._dpr = dpr;
  }
  fxResize();
  window.addEventListener("resize", fxResize);

  function burstAt(x, y, count, spread) {
    if (!fxCtx || reducedMotion) return;
    var dpr = fxCanvas._dpr || 1;
    count = count || 150;
    spread = spread || 5.2;
    for (var i = 0; i < count; i++) {
      var angle = Math.random() * Math.PI * 2;
      var speed = (Math.random() * 0.5 + 0.5) * spread * 2.4;
      fxParts.push({
        x: x * dpr, y: y * dpr,
        vx: Math.cos(angle) * speed * dpr,
        vy: Math.sin(angle) * speed * dpr - 2.2 * dpr,
        w: (4 + Math.random() * 5) * dpr,
        h: (7 + Math.random() * 6) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.25,
        color: PALETTE[(Math.random() * PALETTE.length) | 0],
        round: Math.random() < 0.25,
        life: 1
      });
    }
    if (!fxRAF) fxRAF = requestAnimationFrame(fxTick);
  }

  function burstCenter(node, count) {
    var r = node.getBoundingClientRect();
    burstAt(r.left + r.width / 2, r.top + r.height / 2, count);
  }

  function fxTick() {
    if (!fxCtx) return;
    var dpr = fxCanvas._dpr || 1;
    fxCtx.setTransform(1, 0, 0, 1, 0, 0);
    fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    fxCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fxParts = fxParts.filter(function (p) { return p.life > 0 && p.y < fxCanvas.height + 40 * dpr; });
    fxParts.forEach(function (p) {
      p.vy += 0.16 * dpr;
      p.vx *= 0.985;
      p.vy *= 0.985;
      p.x += p.vx;
      p.y += p.vy;
      p.rot += p.vr;
      if (p.y > fxCanvas.height - 10 * dpr) p.life -= 0.03;
      fxCtx.save();
      fxCtx.translate(p.x / dpr + p.w / 2, p.y / dpr + p.h / 2);
      fxCtx.rotate(p.rot);
      fxCtx.scale(1, Math.abs(Math.sin(p.rot * 2)) * 0.7 + 0.3);
      fxCtx.fillStyle = p.color;
      fxCtx.globalAlpha = Math.max(p.life, 0);
      if (p.round) {
        fxCtx.beginPath();
        fxCtx.arc(0, 0, p.w / 2, 0, Math.PI * 2);
        fxCtx.fill();
      } else {
        fxCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      }
      fxCtx.restore();
    });
    if (fxParts.length) {
      fxRAF = requestAnimationFrame(fxTick);
    } else {
      fxRAF = null;
      fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
    }
  }

  /* ── 7 · Small interaction sounds (only via audio ctx) ─────── */

  var sharedAudio = null;
  function ensureAudio() {
    if (sharedAudio) return sharedAudio;
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      sharedAudio = new AC();
    } catch (e) { sharedAudio = null; }
    return sharedAudio;
  }

  function poof() {
    var ctx = ensureAudio();
    if (!ctx) return;
    try {
      var dur = 0.16;
      var buf = ctx.createBuffer(1, ctx.sampleRate * dur, ctx.sampleRate);
      var data = buf.getChannelData(0);
      for (var i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / data.length, 2);
      var src = ctx.createBufferSource();
      src.buffer = buf;
      var filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 720;
      filter.Q.value = 0.8;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.22, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
    } catch (e) { /* sound is garnish, never the meal */ }
  }

  function chime() {
    var ctx = sharedAudio;
    if (!ctx || ctx.state === "suspended") return;
    try {
      [880, 1108.7, 1318.5].forEach(function (f, i) {
        var osc = ctx.createOscillator();
        var gain = ctx.createGain();
        var t0 = ctx.currentTime + i * 0.09;
        osc.type = "sine";
        osc.frequency.value = f;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.09, t0 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
        osc.connect(gain).connect(ctx.destination);
        osc.start(t0);
        osc.stop(t0 + 0.55);
      });
    } catch (e) { /* garnish */ }
  }

  /* ── 8 · The quiz ───────────────────────────────────────────── */

  (function quiz() {
    var stage = $("#quiz-stage");
    if (!stage || !C.quiz) return;
    stage.innerHTML = "";

    var idx = 0;
    var score = 0;

    function dotsRow() {
      var dots = el("div", "quiz-dots");
      C.quiz.forEach(function (_, i) {
        var dot = el("span", "quiz-dot" + (i < idx ? " done" : i === idx ? " now" : ""));
        dots.appendChild(dot);
      });
      return dots;
    }

    function renderIntro() {
      idx = 0; score = 0;
      var intro = el("div", "quiz-start");
      intro.appendChild(el("p", null, "Five picks. No wrong answers — just some that prove you know me better than you pretend."));
      var btn = el("button", "btn btn-solid", "Start the quiz");
      btn.type = "button";
      btn.addEventListener("click", function () { renderQuestion(); });
      intro.appendChild(btn);
      stage.appendChild(intro);
    }

    function renderQuestion() {
      stage.innerHTML = "";
      var q = C.quiz[idx];

      var meta = el("div", "quiz-meta");
      meta.appendChild(el("span", "quiz-progress", "question " + (idx + 1) + " of " + C.quiz.length));
      meta.appendChild(dotsRow());
      stage.appendChild(meta);

      stage.appendChild(el("h3", "quiz-q", q.q));

      var opts = el("div", "quiz-opts");
      var nextBtn = null;

      q.options.forEach(function (opt, oi) {
        var b = el("button", "quiz-opt", opt);
        b.type = "button";
        b.addEventListener("click", function () {
          if (nextBtn) return;
          var correct = oi === q.answer;
          if (correct) score++;
          poof();
          $$(".quiz-opt", opts).forEach(function (other) { other.disabled = true; });
          b.classList.add(correct ? "is-right" : "is-wrong");
          if (!correct) opts.children[q.answer].classList.add("is-right");
          stage.appendChild(el("p", "quiz-note", correct ? q.right : q.wrong));
          nextBtn = el("button", "btn btn-solid quiz-next", idx === C.quiz.length - 1 ? "See the verdict" : "Next question");
          nextBtn.type = "button";
          nextBtn.addEventListener("click", function () {
            idx++;
            if (idx < C.quiz.length) renderQuestion();
            else renderResult();
          });
          stage.appendChild(nextBtn);
          nextBtn.focus();
        });
        opts.appendChild(b);
      });
      stage.appendChild(opts);
    }

    function renderResult() {
      stage.innerHTML = "";
      var results = C.quizResults || {};
      var tier = score === C.quiz.length ? results.perfect : score === C.quiz.length - 1 ? results.four : score >= Math.ceil(C.quiz.length / 2) ? results.three : results.low;
      if (!tier) tier = { title: "Quiz complete", msg: "Whatever the number, the answer is love." };

      var out = el("div", "quiz-result");
      out.appendChild(el("p", "quiz-score", "you scored " + score + " / " + C.quiz.length));
      out.appendChild(el("h3", "quiz-over-title", tier.title));
      out.appendChild(el("p", "quiz-over-msg", tier.msg));

      var again = el("button", "btn btn-ghost", "Take it again");
      again.type = "button";
      again.addEventListener("click", renderIntro);
      out.appendChild(again);
      stage.appendChild(out);

      if (score === C.quiz.length) {
        burstCenter(stage, 220);
        chime();
      } else {
        burstCenter(stage, 90);
      }
    }

    renderIntro();
  })();

  /* ── 9 · The candle ceremony ────────────────────────────────── */

  (function cake() {
    var holder = $("#candles");
    var wrap = $(".cake-wrap");
    var countText = $("#cake-count");
    var wishCard = $("#wish-card");
    var relight = $("#relight");
    if (!holder || !wrap || !countText || !wishCard) return;

    var total = (C.cake && C.cake.count) || 5;

    function build() {
      holder.innerHTML = "";
      for (var i = 0; i < total; i++) {
        var btn = el("button", "candle");
        btn.type = "button";
        btn.setAttribute("aria-pressed", "false");
        btn.setAttribute("aria-label", "Blow out candle " + (i + 1) + " of " + total);
        var flame = el("span", "flame");
        flame.setAttribute("aria-hidden", "true");
        var smoke = el("span", "smoke");
        smoke.setAttribute("aria-hidden", "true");
        btn.appendChild(flame);
        btn.appendChild(smoke);
        btn.addEventListener("click", onCandle);
        holder.appendChild(btn);
      }
      updateCount();
    }

    function litCount() {
      return $$(".candle", holder).filter(function (c) { return !c.classList.contains("out"); }).length;
    }

    function updateCount() {
      var lit = litCount();
      countText.textContent = lit === 0
        ? "Every candle is out. One wish, one granted."
        : lit + " of " + total + " candles still lit — make it worth it.";
    }

    function onCandle(e) {
      var btn = e.currentTarget;
      if (btn.classList.contains("out")) return;
      btn.classList.add("out");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", "Candle " + ($$(".candle", holder).indexOf(btn) + 1) + " — blown out");
      poof();
      updateCount();
      if (litCount() === 0) finish();
    }

    function finish() {
      wrap.classList.add("done");
      setTimeout(function () {
        burstCenter(holder, 200);
        if (wishCard.hidden) {
          wishCard.hidden = false;
          chime();
          var focusable = $("button", wishCard);
          if (focusable) focusable.focus();
        }
      }, 650);
      countText.textContent = "All candles out — happy birthday, beautiful.";
    }

    if (relight) {
      relight.addEventListener("click", function () {
        wrap.classList.remove("done");
        wishCard.hidden = true;
        build();
        var first = $(".candle", holder);
        if (first) first.focus();
      });
    }

    build();
  })();

  /* ── 10 · The sealed note ───────────────────────────────────── */

  (function envelope() {
    var wrap = $("#env-wrap");
    var seal = $("#env-seal");
    var closeBtn = $("#env-close");
    var card = $("#env-card");
    var hint = $(".env-hint");
    if (!wrap || !seal || !closeBtn || !card) return;

    var HINT_CLOSED = "break the seal — it's yours";
    var HINT_OPEN = "pull the note down to tuck it away — or press esc";

    function isOpen() { return wrap.classList.contains("open"); }

    function open() {
      if (isOpen()) return;
      wrap.classList.remove("closing");
      wrap.classList.add("open");
      seal.setAttribute("aria-expanded", "true");
      if (hint) hint.textContent = HINT_OPEN;
      burstCenter(seal, 130);
      window.setTimeout(function () { closeBtn.focus(); }, 1050);
    }

    function shut() {
      if (!isOpen()) return;
      wrap.classList.add("closing");
      seal.setAttribute("aria-expanded", "false");
      if (hint) hint.textContent = HINT_CLOSED;
      window.setTimeout(function () {
        wrap.classList.remove("open");
        window.setTimeout(function () {
          wrap.classList.remove("closing");
          seal.focus();
        }, 80);
      }, 420);
    }

    seal.addEventListener("click", open);
    closeBtn.addEventListener("click", shut);

    document.addEventListener("keydown", function (e) {
      if (!isOpen()) return;
      if (e.key === "Escape" && !e.altKey && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        shut();
      }
    });

    /* — pull it down — */
    var startY = null;
    var pulling = false;
    var dragged = false;

    function setPull(dy) {
      var n = Math.min(Math.max(dy, 0), 260);
      card.style.transform = "translateX(-50%) translateY(calc(-46% + " + Math.round(n) + "px)) scale(0.985)";
    }
    function stopPull() {
      startY = null;
      if (pulling) {
        pulling = false;
        card.classList.remove("dragging");
      }
    }

    card.addEventListener("pointerdown", function (e) {
      if (!isOpen()) return;
      if (e.pointerType === "mouse" && e.button !== 0) return;
      startY = e.clientY;
      pulling = false;
      dragged = false;
      try { card.setPointerCapture(e.pointerId); } catch (err) { /* optional */ }
    });

    card.addEventListener("pointermove", function (e) {
      if (startY === null || !isOpen()) return;
      var dy = e.clientY - startY;
      if (!pulling && dy > 8) {
        pulling = true;
        dragged = true;
        card.classList.add("dragging");
        try { card.setPointerCapture(e.pointerId); } catch (err) { /* fine without */ }
      }
      if (pulling) {
        e.preventDefault();
        setPull(dy);
      }
    });

    card.addEventListener("pointerup", function (e) {
      if (startY === null) return;
      var wasPulling = pulling;
      var dy = e.clientY - startY;
      stopPull();
      if (wasPulling) {
        if (dy > 120) {
          /* tucked in: fade at the pulled spot, choreography does the rest */
          shut();
          window.setTimeout(function () { card.style.transform = ""; }, 560);
        } else {
          card.style.transform = "";
        }
      }
    });

    card.addEventListener("pointercancel", function () {
      stopPull();
      card.style.transform = "";
    });

    /* a real drag must never register as a click on "seal it again" */
    card.addEventListener("click", function (e) {
      if (dragged) {
        dragged = false;
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);
  })();

  /* ── 11 · Music · a soft melody, coded from scratch ─────────── */

  (function music() {
    var btn = $("#music-toggle");
    var label = $("[data-music-label]");
    if (!btn) return;

    var ctx = null;
    var master = null;
    var schedulerId = null;
    var nextTime = 0;
    var step = 0;
    var playing = false;

    var BPM = 64;
    var eighth = 60 / BPM / 2;
    var STEPS_PER_BAR = 8;
    var BARS = 4;

    var CHORDS = [
      [48, 52, 55, 59], /* Cmaj7  */
      [45, 52, 57, 60], /* Am7    */
      [41, 48, 53, 57], /* Fmaj7  */
      [43, 50, 55, 59]  /* G      */
    ];
    var ARP = [0, 1, 2, 3, 2, 3, 1, 2];

    function hz(m) { return 440 * Math.pow(2, (m - 69) / 12); }

    function pluck(freq, t, vel) {
      var osc = ctx.createOscillator();
      osc.type = "triangle";
      osc.frequency.value = freq;
      var filter = ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.value = 1500;
      filter.Q.value = 0.6;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(vel, t + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 1.05);
      osc.connect(filter).connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + 1.1);
    }

    function bass(freq, t) {
      var osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      var gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.exponentialRampToValueAtTime(0.16, t + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2);
      osc.connect(gain).connect(master);
      osc.start(t);
      osc.stop(t + 2.3);
    }

    function pad(t, chord) {
      [0, 2].forEach(function (ci) {
        var osc = ctx.createOscillator();
        osc.type = "triangle";
        osc.frequency.value = hz(chord[ci] + 12) * (ci === 0 ? 0.999 : 1.002);
        var gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, t);
        gain.gain.linearRampToValueAtTime(0.035, t + 1.1);
        gain.gain.linearRampToValueAtTime(0.0001, t + 3.6);
        osc.connect(gain).connect(master);
        osc.start(t);
        osc.stop(t + 3.7);
      });
    }

    function scheduleStep(i, t) {
      var bar = Math.floor(i / STEPS_PER_BAR) % BARS;
      var pos = i % STEPS_PER_BAR;
      var chord = CHORDS[bar];
      if (pos === 0) {
        bass(hz(chord[0]), t);
        pad(t, chord);
        /* a soft melody note on the first beat of each bar */
        pluck(hz(chord[(bar % 2) + 1] + 12), t, 0.14);
      }
      var note = chord[ARP[pos]] + 12;
      /* occasional sparkle an octave up */
      if (pos === 5 && bar % 2 === 1) note += 12;
      pluck(hz(note), t, pos === 0 ? 0.13 : 0.11);
    }

    function schedulerTick() {
      if (!ctx) return;
      while (nextTime < ctx.currentTime + 1.1) {
        scheduleStep(step, nextTime);
        step++;
        nextTime += eighth;
      }
    }

    function start() {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) {
        btn.disabled = true;
        btn.setAttribute("aria-label", "Music is not supported in this browser");
        return;
      }
      if (!ctx) {
        ctx = new AC();
        sharedAudio = ctx;
        master = ctx.createGain();
        master.gain.value = 0.85;
        var comp = ctx.createDynamicsCompressor();
        comp.threshold.value = -20;
        comp.ratio.value = 4;
        master.connect(comp).connect(ctx.destination);
        nextTime = ctx.currentTime + 0.12;
        step = 0;
        schedulerId = window.setInterval(schedulerTick, 250);
        schedulerTick();
      }
      ctx.resume().then(function () {
        playing = true;
        sync();
      }).catch(function () { sync(); });
    }

    function stop() {
      if (ctx) ctx.suspend().catch(function () {});
      playing = false;
      sync();
    }

    function sync() {
      btn.setAttribute("aria-pressed", playing ? "true" : "false");
      var text = playing ? (C.music && C.music.playing) || "Pause the music" : (C.music && C.music.label) || "Play soft music";
      if (label) label.textContent = text;
      btn.setAttribute("aria-label", playing ? "Pause soft background music" : "Play soft background music");
    }

    btn.addEventListener("click", function () { playing ? stop() : start(); });
    sync();
  })();

  /* ── 12 · Reveals & rail ────────────────────────────────────── */

  (function observers() {
    var revealNodes = $$("[data-reveal]");
    if (!("IntersectionObserver" in window) || reducedMotion) {
      revealNodes.forEach(function (n) { n.classList.add("in"); });
    } else {
      var revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            revealObs.unobserve(en.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -36px" });
      revealNodes.forEach(function (n) { revealObs.observe(n); });
    }

    var railLinks = $$(".rail a");
    var sections = railLinks.map(function (a) {
      return document.getElementById(a.getAttribute("data-rail"));
    }).filter(Boolean);

    var LIGHT = { candle: 1, paper: 1, candy: 1 };
    var railNav = $(".rail");

    function setActive(id) {
      railLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("data-rail") === id);
      });
      var sec = document.getElementById(id);
      if (railNav && sec) {
        railNav.classList.toggle("rail-dark", !!LIGHT[sec.getAttribute("data-theme")]);
      }
    }

    if ("IntersectionObserver" in window && sections.length) {
      var railObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) setActive(en.target.id);
        });
      }, { rootMargin: "-45% 0px -45% 0px" });
      sections.forEach(function (s) { railObs.observe(s); });
    }
  })();

  /* (nothing above auto-plays audio — music starts only by choice) */
})();
