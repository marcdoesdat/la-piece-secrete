(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* En-tête : fond au défilement ------------------------------------------ */
  var header = document.querySelector("[data-header]");
  function onScroll() {
    header.classList.toggle("is-scrolled", window.scrollY > 24);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* Menu mobile ----------------------------------------------------------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.querySelector("[data-nav]");

  function setMenu(open) {
    toggle.setAttribute("aria-expanded", String(open));
    nav.classList.toggle("is-open", open);
    header.classList.toggle("menu-open", open);
  }

  toggle.addEventListener("click", function () {
    setMenu(toggle.getAttribute("aria-expanded") !== "true");
  });
  nav.addEventListener("click", function (e) {
    if (e.target.closest("a")) setMenu(false);
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && nav.classList.contains("is-open")) {
      setMenu(false);
      toggle.focus();
    }
  });

  /* La bibliothèque s'entrouvre ------------------------------------------- */
  var secret = document.querySelector("[data-secret]");
  if (secret) {
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        secret.classList.add("is-open");
      });
    });
  }

  /* Apparitions au défilement --------------------------------------------- */
  var revealables = document.querySelectorAll("[data-reveal]");
  if (!reduceMotion && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealables.forEach(function (el) {
      // Léger décalage entre éléments voisins d'une même grille
      var siblings = el.parentElement.querySelectorAll(":scope > [data-reveal]");
      var index = Array.prototype.indexOf.call(siblings, el);
      if (index > 0) el.style.transitionDelay = Math.min(index, 5) * 80 + "ms";
      io.observe(el);
    });
  } else {
    revealables.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* Pièce réversible : Ce soir / Jour de visite --------------------------- */
  var card = document.querySelector("[data-mode]");
  if (card) {
    var buttons = card.querySelectorAll("[data-mode-btn]");
    var values = card.querySelectorAll(".modes__value");

    function setMode(mode) {
      if (card.getAttribute("data-mode") === mode) return;
      card.setAttribute("data-mode", mode);
      buttons.forEach(function (b) {
        b.setAttribute("aria-checked", String(b.getAttribute("data-mode-btn") === mode));
      });
      values.forEach(function (v) {
        v.classList.add("is-swapping");
        setTimeout(function () {
          v.textContent = v.getAttribute("data-" + mode);
          v.classList.remove("is-swapping");
        }, reduceMotion ? 0 : 220);
      });
    }

    buttons.forEach(function (b, i) {
      b.addEventListener("click", function () { setMode(b.getAttribute("data-mode-btn")); });
      b.addEventListener("keydown", function (e) {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          var next = buttons[(i + 1) % buttons.length];
          next.focus();
          setMode(next.getAttribute("data-mode-btn"));
          e.preventDefault();
        }
      });
    });
  }

  /* Formulaire de consultation -------------------------------------------- */
  var form = document.querySelector("[data-form]");
  if (form) {
    var email = form.querySelector("#courriel");
    var emailError = form.querySelector("#courriel-erreur");
    var status = form.querySelector("[data-status]");
    var submit = form.querySelector("[data-submit]");
    var success = document.querySelector("[data-success]");
    var submitLabel = submit.textContent;

    function emailIsValid() {
      var ok = email.value.trim() !== "" && email.checkValidity();
      email.setAttribute("aria-invalid", String(!ok));
      emailError.hidden = ok;
      return ok;
    }

    email.addEventListener("blur", function () {
      if (email.value.trim() !== "") emailIsValid();
    });
    email.addEventListener("input", function () {
      if (email.getAttribute("aria-invalid") === "true") emailIsValid();
    });

    function showSuccess() {
      form.hidden = true;
      success.hidden = false;
      success.focus();
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      status.textContent = "";

      if (!emailIsValid()) {
        email.focus();
        return;
      }

      // Pot de miel : un robot a rempli le champ caché
      if (form.elements._gotcha && form.elements._gotcha.value) {
        showSuccess();
        return;
      }

      submit.disabled = true;
      submit.textContent = "Envoi en cours…";

      // Envoi à Formspree (l'URL est dans l'attribut action du formulaire)
      fetch(form.action, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: new FormData(form)
      })
        .then(function (res) {
          if (res.ok) {
            showSuccess();
            return;
          }
          return res.json().catch(function () { return {}; }).then(function (data) {
            var errors = (data && data.errors) || [];
            var emailRejected = errors.some(function (err) { return err.field === "email"; });
            if (emailRejected) {
              email.setAttribute("aria-invalid", "true");
              emailError.hidden = false;
              email.focus();
            } else {
              throw new Error("HTTP " + res.status);
            }
          });
        })
        .catch(function () {
          status.textContent = "L’envoi n’a pas fonctionné. Réessayez dans un instant.";
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = submitLabel;
        });
    });
  }

  /* Année courante -------------------------------------------------------- */
  var year = document.querySelector("[data-year]");
  if (year) year.textContent = new Date().getFullYear();
})();
