(() => {
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const onReady = (callback) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback, { once: true });
      return;
    }
    callback();
  };

  const hideLoader = () => {
    const loader = document.querySelector(".loader-wrapper");
    if (!loader) return;

    const close = () => {
      loader.classList.add("is-hidden");
      window.setTimeout(() => loader.remove(), prefersReducedMotion ? 0 : 300);
    };

    if (document.readyState === "complete") {
      close();
    } else {
      window.addEventListener("load", close, { once: true });
      window.setTimeout(close, 2500);
    }
  };

  const setupNavigation = () => {
    document.querySelectorAll(".navbar").forEach((navbar, index) => {
      const button = navbar.querySelector(".menu-button");
      const menu = navbar.querySelector(".nav-menu");
      if (!button || !menu) return;

      const desktopQuery = window.matchMedia("(min-width: 992px)");
      const closeButtons = menu.querySelectorAll("[data-menu-close]");
      const menuId = menu.id || `site-menu-${index + 1}`;
      menu.id = menuId;
      button.setAttribute("aria-controls", menuId);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-label", "Abrir menu");

      const setOpen = (open) => {
        button.classList.toggle("w--open", open);
        menu.classList.toggle("is-open", open);
        document.body.classList.toggle("nav-open", open);
        button.setAttribute("aria-expanded", String(open));
        button.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
      };

      button.addEventListener("click", () => {
        setOpen(button.getAttribute("aria-expanded") !== "true");
      });

      button.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        button.click();
      });

      menu.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => setOpen(false));
      });

      closeButtons.forEach((closeButton) => {
        closeButton.addEventListener("click", () => setOpen(false));
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") setOpen(false);
      });

      const closeOnDesktop = () => {
        if (desktopQuery.matches) setOpen(false);
      };

      if (desktopQuery.addEventListener) {
        desktopQuery.addEventListener("change", closeOnDesktop);
      } else {
        desktopQuery.addListener(closeOnDesktop);
      }
    });
  };

  const setupContactForms = () => {
    document.querySelectorAll("[data-contact-form]").forEach((form) => {
      const status = form.querySelector("[data-form-status]");
      const button = form.querySelector("button[type='submit']");

      const setStatus = (message, state = "") => {
        if (!status) return;
        status.textContent = message;
        status.dataset.state = state;
      };

      form.addEventListener("submit", async (event) => {
        if (!window.fetch) return;
        event.preventDefault();

        if (!form.checkValidity()) {
          form.reportValidity();
          return;
        }

        const originalLabel = button ? button.textContent : "";
        if (button) {
          button.disabled = true;
          button.textContent = "Enviando...";
        }
        setStatus("Enviando tu mensaje...", "loading");

        try {
          const response = await fetch(form.action, {
            method: "POST",
            headers: { Accept: "application/json" },
            body: new URLSearchParams(new FormData(form))
          });

          const result = await response.json().catch(() => ({}));
          if (!response.ok || result.ok === false) {
            const message = Array.isArray(result.errors)
              ? result.errors.join(" ")
              : "No pudimos enviar el mensaje. Intenta de nuevo.";
            throw new Error(message);
          }

          setStatus("Mensaje enviado. Te llevamos a la pagina de gracias.", "success");
          const redirect = form.querySelector("input[name='_redirect']")?.value || "/pages/gracias.html";
          window.location.href = redirect;
        } catch (error) {
          setStatus(error.message || "No pudimos enviar el mensaje. Intenta de nuevo.", "error");
          if (button) {
            button.disabled = false;
            button.textContent = originalLabel;
          }
        }
      });
    });
  };

  const setupPopups = () => {
    const popups = Array.from(document.querySelectorAll(".popup"));
    if (!popups.length) return;

    let previousFocus = null;

    const closePopup = (popup) => {
      popup.classList.remove("is-open");
      popup.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
      if (previousFocus && typeof previousFocus.focus === "function") {
        previousFocus.focus();
      }
    };

    const openPopup = (popup) => {
      previousFocus = document.activeElement;
      popup.classList.add("is-open");
      popup.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
      const focusTarget = popup.querySelector("a, button, [tabindex]:not([tabindex='-1'])");
      if (focusTarget) focusTarget.focus({ preventScroll: true });
    };

    popups.forEach((popup, index) => {
      popup.setAttribute("role", "dialog");
      popup.setAttribute("aria-modal", "true");
      popup.setAttribute("aria-hidden", "true");
      popup.setAttribute("aria-label", popup.querySelector(".popup_heading")?.textContent?.trim() || `Producto ${index + 1}`);

      popup.addEventListener("click", (event) => {
        if (event.target === popup || event.target.closest(".exit_div")) closePopup(popup);
      });
    });

    document.querySelectorAll(".div-block-2.productos").forEach((card, index) => {
      const popup = popups[index];
      if (!popup) return;

      card.setAttribute("role", "button");
      card.setAttribute("tabindex", "0");
      card.setAttribute("aria-haspopup", "dialog");

      const activate = () => openPopup(popup);

      card.addEventListener("click", activate);
      card.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") return;
        event.preventDefault();
        activate();
      });
    });

    document.addEventListener("keydown", (event) => {
      if (event.key !== "Escape") return;
      const open = document.querySelector(".popup.is-open");
      if (open) closePopup(open);
    });
  };

  const setupPortfolioShowcase = () => {
    document.querySelectorAll(".portfolioslider").forEach((slider) => {
      const slides = Array.from(slider.querySelectorAll(".w-slide"));
      const live = slider.querySelector(".w-slider-aria-label");

      slider.setAttribute("aria-label", "Nuestros trabajos");
      if (live) live.textContent = "Cinco trabajos destacados visibles.";

      const clearActive = () => {
        slides.forEach((slide) => slide.classList.remove("is-active"));
        slider.classList.remove("has-active");
      };

      slides.forEach((slide) => {
        slide.style.transform = "";
        slide.removeAttribute("aria-hidden");
        slide.querySelectorAll("[aria-hidden]").forEach((element) => element.removeAttribute("aria-hidden"));
        slide.querySelectorAll("[tabindex='-1']").forEach((element) => element.removeAttribute("tabindex"));
      });

      slider.addEventListener("pointerleave", clearActive);
      slider.addEventListener("focusout", (event) => {
        if (!slider.contains(event.relatedTarget)) clearActive();
      });

      slides.forEach((slide) => {
        slide.addEventListener("pointerenter", () => {
          slides.forEach((item) => item.classList.toggle("is-active", item === slide));
          slider.classList.add("has-active");
        });

        slide.addEventListener("focusin", () => {
          slides.forEach((item) => item.classList.toggle("is-active", item === slide));
          slider.classList.add("has-active");
        });
      });
    });
  };

  const setupLightbox = () => {
    const links = Array.from(document.querySelectorAll(".lightbox-link"));
    if (!links.length) return;

    const overlay = document.createElement("div");
    overlay.className = "tp-lightbox";
    overlay.innerHTML = `
      <button class="tp-lightbox__close" type="button" aria-label="Cerrar imagen">×</button>
      <img alt="" />
    `;
    document.body.appendChild(overlay);

    const image = overlay.querySelector("img");
    const closeButton = overlay.querySelector("button");
    let previousFocus = null;

    const close = () => {
      overlay.classList.remove("is-open");
      document.body.classList.remove("modal-open");
      if (previousFocus) previousFocus.focus();
    };

    links.forEach((link) => {
      link.addEventListener("click", (event) => {
        const source = link.querySelector("img");
        if (!source) return;
        event.preventDefault();
        previousFocus = document.activeElement;
        image.src = source.currentSrc || source.src;
        image.alt = source.alt || "Trabajo de The Point";
        overlay.classList.add("is-open");
        document.body.classList.add("modal-open");
        closeButton.focus({ preventScroll: true });
      });
    });

    closeButton.addEventListener("click", close);
    overlay.addEventListener("click", (event) => {
      if (event.target === overlay) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && overlay.classList.contains("is-open")) close();
    });
  };

  const setupHeroMotion = () => {
    if (prefersReducedMotion) return;

    document.querySelectorAll(".hero_background_animated, .footer_background_animated").forEach((layer) => {
      const parent = layer.closest(".hero_section, .footer, .productssection") || document.body;

      parent.addEventListener("pointermove", (event) => {
        const rect = parent.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        layer.style.transform = `rotateX(${(-y * 6).toFixed(2)}deg) rotateY(${(x * 6).toFixed(2)}deg)`;
      });

      parent.addEventListener("pointerleave", () => {
        layer.style.transform = "";
      });
    });
  };

  onReady(() => {
    document.documentElement.classList.add("js-enabled");
    hideLoader();
    setupNavigation();
    setupContactForms();
    setupPopups();
    setupPortfolioShowcase();
    setupLightbox();
    setupHeroMotion();
  });
})();
