(function(){
  "use strict";

  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- nav scrolled state ---- */
  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---- mobile nav toggle ---- */
  var burger = document.getElementById("navBurger");
  var navMobile = document.getElementById("navMobile");
  if (burger && navMobile) {
    burger.addEventListener("click", function () {
      var open = navMobile.classList.toggle("open");
      burger.setAttribute("aria-expanded", open ? "true" : "false");
    });
    navMobile.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        navMobile.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---- scroll-spy for section nav links ---- */
  var navLinks = document.querySelectorAll(".nav-links a, .cs-nav-inner a");
  var sections = [];
  navLinks.forEach(function (link) {
    var id = link.getAttribute("href");
    if (id && id.charAt(0) === "#") {
      var target = document.querySelector(id);
      if (target) sections.push({ link: link, target: target });
    }
  });
  if (sections.length && "IntersectionObserver" in window) {
    var spy = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          var match = sections.find(function (s) { return s.target === entry.target; });
          if (!match) return;
          if (entry.isIntersecting) {
            sections.forEach(function (s) { s.link.classList.remove("active"); });
            match.link.classList.add("active");
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach(function (s) { spy.observe(s.target); });
  }

  /* ---- reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else if ("IntersectionObserver" in window) {
    var reveal = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            reveal.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach(function (el) { reveal.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- copy email on click of the plain-text email link ---- */
  var copyEmail = document.getElementById("copyEmail");
  if (copyEmail && navigator.clipboard) {
    copyEmail.addEventListener("click", function (e) {
      e.preventDefault();
      var addr = "abhishekku919917@gmail.com";
      navigator.clipboard.writeText(addr).then(function () {
        var original = copyEmail.textContent;
        copyEmail.textContent = "Copied ✓";
        setTimeout(function () { copyEmail.textContent = original; }, 1600);
      }).catch(function () {
        window.location.href = "mailto:" + addr;
      });
    });
  }

  /* ---- footer year ---- */
  var yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = "Designed & built by Abhishek Kumar. © " + new Date().getFullYear();
  }

  /* ---- architecture diagram (case study pages) ---- */
  var archNodes = document.querySelectorAll(".arch-node");
  var archDetail = document.getElementById("archDetail");
  if (archNodes.length && archDetail) {
    archNodes.forEach(function (node) {
      node.addEventListener("click", function () {
        archNodes.forEach(function (n) { n.classList.remove("active"); });
        node.classList.add("active");
        archDetail.textContent = node.getAttribute("data-detail") || "";
      });
    });
  }
})();
