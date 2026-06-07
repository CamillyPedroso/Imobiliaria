/**
 * lancamentos.js
 * Funcionalidades da página Lançamentos — Anselmo Pedroso Imóveis
 *
 * Módulos:
 *   1. Header: menu mobile + dropdown via teclado/clique
 *   2. Galeria: lightbox com navegação por teclado e touch
 *   3. Formulário: validação + geração de link WhatsApp
 *   4. Botões "Tenho interesse": preenche a unidade no select do form
 *   5. Scroll suave para âncoras
 */

(function () {
  "use strict";

  /* ──────────────────────────────────────────────
     1. HEADER — MENU MOBILE & DROPDOWN
  ────────────────────────────────────────────── */
  const burger = document.getElementById("lc-burger");
  const nav = document.getElementById("lc-nav");
  const dropBtns = document.querySelectorAll(".lc-nav__dropdown-btn");

  // Abre/fecha menu mobile
  if (burger && nav) {
    burger.addEventListener("click", () => {
      const isOpen = nav.classList.toggle("lc-nav--open");
      burger.setAttribute("aria-expanded", isOpen);
    });

    // Fecha ao clicar em link do menu
    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        nav.classList.remove("lc-nav--open");
        burger.setAttribute("aria-expanded", false);
      });
    });
  }

  // Dropdown hover/click
  dropBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const parent = btn.closest(".lc-nav__dropdown");
      const isOpen = parent.classList.toggle("lc-nav__dropdown--open");

      // Fecha os outros
      dropBtns.forEach((other) => {
        if (other !== btn) {
          other
            .closest(".lc-nav__dropdown")
            .classList.remove("lc-nav__dropdown--open");
        }
      });

      e.stopPropagation();
    });
  });

  /* ──────────────────────────────────────────────
     2. GALERIA / LIGHTBOX
  ────────────────────────────────────────────── */
  const galleryItems = document.querySelectorAll(".lc-galeria__item");
  const lightbox = document.getElementById("lc-lightbox");
  const lbImg = document.getElementById("lc-lb-img");
  const lbCaption = document.getElementById("lc-lb-caption");
  const lbClose = document.getElementById("lc-lb-close");
  const lbPrev = document.getElementById("lc-lb-prev");
  const lbNext = document.getElementById("lc-lb-next");

  // Monta array de imagens da galeria
  const images = Array.from(galleryItems).map((item) => ({
    src: item.querySelector("img").src,
    alt: item.querySelector("img").alt,
    caption: item.querySelector(".lc-galeria__caption")?.textContent || "",
  }));

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    setLightboxImage(currentIndex);
    lightbox.classList.add("lc-lightbox--open");
    document.body.style.overflow = "hidden";
    lbClose.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("lc-lightbox--open");
    document.body.style.overflow = "";
  }

  function setLightboxImage(index) {
    const { src, alt, caption } = images[index];
    lbImg.src = src;
    lbImg.alt = alt;
    lbCaption.textContent = caption;
    currentIndex = index;
  }

  function prevImage() {
    setLightboxImage((currentIndex - 1 + images.length) % images.length);
  }

  function nextImage() {
    setLightboxImage((currentIndex + 1) % images.length);
  }

  // Abrir ao clicar nos itens
  galleryItems.forEach((item, i) => {
    item.addEventListener("click", () => openLightbox(i));
    // Acessibilidade: suporte a teclado
    item.setAttribute("tabindex", "0");
    item.setAttribute("role", "button");
    item.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openLightbox(i);
      }
    });
  });

  if (lbClose) lbClose.addEventListener("click", closeLightbox);
  if (lbPrev) lbPrev.addEventListener("click", prevImage);
  if (lbNext) lbNext.addEventListener("click", nextImage);

  // Fechar ao clicar fora da imagem
  if (lightbox) {
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox) closeLightbox();
    });
  }

  // Teclado no lightbox
  document.addEventListener("keydown", (e) => {
    if (!lightbox?.classList.contains("lc-lightbox--open")) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") prevImage();
    if (e.key === "ArrowRight") nextImage();
  });

  // Touch / swipe no mobile
  if (lightbox) {
    let touchStartX = 0;
    lightbox.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );
    lightbox.addEventListener(
      "touchend",
      (e) => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 50) diff > 0 ? nextImage() : prevImage();
      },
      { passive: true },
    );
  }

  /* ──────────────────────────────────────────────
     3. BOTÕES "TENHO INTERESSE" — preenche o select
  ────────────────────────────────────────────── */
  const interestBtns = document.querySelectorAll(".lc-btn--interest");
  const selectUnidade = document.getElementById("lc-unidade");

  interestBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const unidade = btn.dataset.unidade || "";

      if (selectUnidade) {
        // Tenta encontrar a opção mais próxima
        const options = Array.from(selectUnidade.options);
        const match = options.find(
          (opt) =>
            unidade.toLowerCase().includes(opt.value.toLowerCase()) ||
            (opt.value.toLowerCase().includes("cobertura") &&
              unidade.toLowerCase().includes("cobertura")) ||
            (opt.value.toLowerCase().includes("3") &&
              unidade.includes("3 dorm")) ||
            (opt.value.toLowerCase().includes("2") &&
              unidade.includes("2 dorm") &&
              !unidade.includes("3 dorm")),
        );
        if (match) selectUnidade.value = match.value;
      }
    });
  });

  /* ──────────────────────────────────────────────
     4. FORMULÁRIO — validação + WhatsApp
  ────────────────────────────────────────────── */
  const form = document.getElementById("lc-form");

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      let valid = true;

      const nome = document.getElementById("lc-nome");
      const wpp = document.getElementById("lc-wpp");
      const tipo = document.getElementById("lc-tipo");
      const unidade = document.getElementById("lc-unidade");

      // Limpa erros anteriores
      [nome, wpp, tipo, unidade].forEach((el) => {
        if (el) el.classList.remove("lc-input--error");
      });

      // Validação nome
      if (!nome?.value.trim()) {
        nome.classList.add("lc-input--error");
        nome.focus();
        valid = false;
      }

      // Validação WhatsApp (mínimo 10 dígitos)
      const wppDigits = wpp?.value.replace(/\D/g, "");
      if (!wppDigits || wppDigits.length < 10) {
        wpp.classList.add("lc-input--error");
        if (valid) wpp.focus();
        valid = false;
      }

      if (!valid) return;

      // Monta a mensagem para o WhatsApp
      const nomeVal = nome.value.trim();
      const tipoVal = tipo?.value || "Mais informações";
      const unidadeVal = unidade?.value || "Ainda não sei";

      const msg = [
        `Olá, tenho interesse em receber informações antecipadas sobre o lançamento Jardim Haut.`,
        ``,
        `*Nome:* ${nomeVal}`,
        `*Interesse:* ${tipoVal}`,
        `*Unidade:* ${unidadeVal}`,
        ``,
        `Gostaria de saber mais detalhes sobre disponibilidade, valores e condições.`,
      ].join("\n");

      const encoded = encodeURIComponent(msg);
      const url = `https://wa.me/5551995483061?text=${encoded}`;

      window.open(url, "_blank", "noopener,noreferrer");
    });

    // Remove erro ao digitar
    form.querySelectorAll("input, select").forEach((el) => {
      el.addEventListener("input", () =>
        el.classList.remove("lc-input--error"),
      );
      el.addEventListener("change", () =>
        el.classList.remove("lc-input--error"),
      );
    });
  }

  /* ──────────────────────────────────────────────
     5. SCROLL SUAVE para âncoras internas
  ────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (e) => {
      const target = document.querySelector(anchor.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const headerH = document.querySelector(".lc-header")?.offsetHeight || 70;
      const top =
        target.getBoundingClientRect().top + window.scrollY - headerH - 20;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ──────────────────────────────────────────────
     6. HEADER: sombra ao rolar
  ────────────────────────────────────────────── */
  const header = document.querySelector(".lc-header");
  if (header) {
    const updateHeader = () => {
      header.style.borderBottomColor =
        window.scrollY > 50 ? "rgba(184,144,80,0.3)" : "rgba(184,144,80,0.15)";
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
  }
})();
