/* Espace Mariée Bahja — interactions */
(function () {
  "use strict";

  /* Numéro WhatsApp qui reçoit les demandes (indicatif + numéro, sans espaces ni « + »).
     Laissé vide : la demande est copiée et Messenger s'ouvre.
     Exemple : var WHATSAPP_NUMBER = "21612345678"; */
  var WHATSAPP_NUMBER = "";
  var MESSENGER_URL = "https://m.me/Imen.makeup.artist.hanen.haute.couture";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && "IntersectionObserver" in window) document.documentElement.classList.add("js-motion");

  /* 1. En-tête : transparent sur le hero, opaque ensuite */
  var header = document.getElementById("siteHeader");
  var hero = document.getElementById("top");
  function onScroll() {
    header.classList.toggle("solid", window.scrollY > hero.offsetHeight - 90);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* 2. Menu mobile */
  var toggle = document.getElementById("menuToggle");
  var mobileNav = document.getElementById("mobileNav");
  function setMenu(open) {
    mobileNav.classList.toggle("open", open);
    header.classList.toggle("menu-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Fermer le menu" : "Ouvrir le menu");
  }
  toggle.addEventListener("click", function () { setMenu(!mobileNav.classList.contains("open")); });
  mobileNav.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", function () { setMenu(false); }); });

  /* 4. Apparition des blocs au défilement */
  if (document.documentElement.classList.contains("js-motion")) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in-view"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* 5. Filtres du lookbook */
  var filters = Array.prototype.slice.call(document.querySelectorAll(".filter"));
  var looks = Array.prototype.slice.call(document.querySelectorAll(".look"));
  function applyFilter(cat) {
    filters.forEach(function (f) { f.setAttribute("aria-pressed", String(f.dataset.filter === cat)); });
    looks.forEach(function (l) { l.classList.toggle("is-hidden", cat !== "all" && l.dataset.cat !== cat); });
  }
  filters.forEach(function (f) { f.addEventListener("click", function () { applyFilter(f.dataset.filter); }); });
  document.querySelectorAll("[data-filter-link]").forEach(function (link) {
    link.addEventListener("click", function () { applyFilter(link.dataset.filterLink); });
  });

  /* 6. Lightbox (parcourt les photos visibles) */
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lbImg");
  var lbCount = document.getElementById("lbCount");
  var visible = [], current = 0, lastFocus = null;
  function show(i) {
    current = (i + visible.length) % visible.length;
    var img = visible[current].querySelector("img");
    lbImg.src = img.src; lbImg.alt = img.alt;
    lbCount.textContent = (current + 1) + " / " + visible.length;
  }
  function openLb(look) {
    visible = looks.filter(function (l) { return !l.classList.contains("is-hidden"); });
    lastFocus = document.activeElement;
    show(visible.indexOf(look));
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    document.getElementById("lbClose").focus();
  }
  function closeLb() {
    lb.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }
  looks.forEach(function (l) { l.addEventListener("click", function () { openLb(l); }); });
  document.getElementById("lbClose").addEventListener("click", closeLb);
  document.getElementById("lbPrev").addEventListener("click", function () { show(current - 1); });
  document.getElementById("lbNext").addEventListener("click", function () { show(current + 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileNav.classList.contains("open")) { setMenu(false); toggle.focus(); }
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb();
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });

  /* 8. Formulaire -> message WhatsApp pré-rempli */
  var form = document.getElementById("bookingForm");
  var errorBox = document.getElementById("formError");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    var name = form.name.value.trim();
    var phone = form.phone.value.trim();
    form.name.classList.toggle("invalid", !name);
    form.phone.classList.toggle("invalid", !phone);
    if (!name || !phone) {
      errorBox.textContent = "Indiquez votre nom et votre téléphone pour envoyer la demande.";
      errorBox.hidden = false;
      (name ? form.phone : form.name).focus();
      return;
    }
    errorBox.hidden = true;
    var lines = [
      "Bonjour Espace Mariée Bahja,",
      "je souhaite prendre rendez-vous.",
      "",
      "Nom : " + name,
      "Téléphone : " + phone,
      "Prestation : " + form.service.value
    ];
    if (form.date.value) {
      var d = new Date(form.date.value + "T00:00:00");
      lines.push("Date de l'événement : " + d.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }));
    }
    var msg = form.message.value.trim();
    if (msg) lines.push("", msg);
    var text = lines.join("\n");
    var success = document.getElementById("formSuccess");
    if (WHATSAPP_NUMBER) {
      window.open("https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text), "_blank", "noopener");
      return;
    }
    // Pas de WhatsApp : on copie la demande et on ouvre Messenger
    function openMessenger(copied) {
      success.textContent = copied
        ? "Votre demande est copiée : collez-la dans la conversation Messenger qui vient de s'ouvrir."
        : "Messenger s'ouvre : envoyez-nous votre demande dans la conversation.";
      success.hidden = false;
      window.open(MESSENGER_URL, "_blank", "noopener");
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () { openMessenger(true); }, function () { openMessenger(false); });
    } else {
      openMessenger(false);
    }
  });

  /* 9. Année */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
