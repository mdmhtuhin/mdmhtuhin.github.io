/* mdmhtuhin.github.io — site behavior (vanilla JS, no dependencies) */
(function () {
    "use strict";

    var prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Icons ---------- */
    function renderIcons() {
        if (window.lucide) window.lucide.createIcons();
    }
    renderIcons();

    /* ---------- Theme ---------- */
    // The inline head script applies the initial theme before paint;
    // here we only handle toggling.
    function toggleTheme() {
        var isLight = document.documentElement.classList.toggle("light");
        localStorage.theme = isLight ? "light" : "dark";
        var meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute("content", isLight ? "#fafafa" : "#0b0b10");
    }
    ["theme-toggle", "theme-toggle-mobile"].forEach(function (id) {
        var btn = document.getElementById(id);
        if (btn) btn.addEventListener("click", toggleTheme);
    });

    /* ---------- Mobile menu ---------- */
    var menuBtn = document.getElementById("mobile-menu-btn");
    var mobileMenu = document.getElementById("mobile-menu");

    function setMenu(open) {
        if (!menuBtn || !mobileMenu) return;
        mobileMenu.hidden = !open;
        menuBtn.setAttribute("aria-expanded", String(open));
        menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
        menuBtn.innerHTML = '<i data-lucide="' + (open ? "x" : "menu") + '" id="menu-icon"></i>';
        renderIcons();
    }

    if (menuBtn) {
        menuBtn.addEventListener("click", function () {
            setMenu(mobileMenu.hidden);
        });
    }
    document.querySelectorAll(".mobile-link").forEach(function (link) {
        link.addEventListener("click", function () { setMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileMenu && !mobileMenu.hidden) setMenu(false);
    });

    /* ---------- Navbar: scrolled state + progress bar + back-to-top ---------- */
    var navbar = document.getElementById("navbar");
    var progressBar = document.getElementById("scroll-progress-bar");
    var backToTop = document.getElementById("back-to-top");
    var ticking = false;

    function onScroll() {
        var y = window.scrollY;
        if (navbar) navbar.classList.toggle("scrolled", y > 24);
        if (backToTop) backToTop.classList.toggle("show", y > 480);
        if (progressBar) {
            var max = document.documentElement.scrollHeight - window.innerHeight;
            progressBar.style.width = (max > 0 ? (y / max) * 100 : 0) + "%";
        }
        ticking = false;
    }
    window.addEventListener("scroll", function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(onScroll);
        }
    }, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener("click", function () {
            window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
        });
    }

    /* ---------- Reveal on scroll ---------- */
    if (!("IntersectionObserver" in window)) {
        document.documentElement.classList.remove("js");
    }
    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("is-visible");
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    document.querySelectorAll(".reveal-on-scroll").forEach(function (el) {
        revealObserver.observe(el);
    });

    /* ---------- Scrollspy ---------- */
    var navLinks = document.querySelectorAll(".nav-link[data-section]");
    if (navLinks.length) {
        var linkFor = {};
        navLinks.forEach(function (link) { linkFor[link.dataset.section] = link; });

        var spyObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    navLinks.forEach(function (l) { l.classList.remove("active"); l.removeAttribute("aria-current"); });
                    var link = linkFor[entry.target.id];
                    if (link) { link.classList.add("active"); link.setAttribute("aria-current", "true"); }
                }
            });
        }, { rootMargin: "-35% 0px -55% 0px" });

        Object.keys(linkFor).forEach(function (id) {
            var section = document.getElementById(id);
            if (section) spyObserver.observe(section);
        });
    }

    /* ---------- Stat count-up ---------- */
    function animateCount(el) {
        var target = parseInt(el.dataset.target, 10) || 0;
        if (prefersReducedMotion || target <= 1) {
            el.textContent = target;
            return;
        }
        var duration = 1400;
        var start = null;
        function step(ts) {
            if (start === null) start = ts;
            var p = Math.min((ts - start) / duration, 1);
            var eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target);
            if (p < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    var countObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                animateCount(entry.target);
                countObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll(".count-up").forEach(function (el) {
        countObserver.observe(el);
    });

    /* ---------- Hero role rotator ---------- */
    var roleEl = document.getElementById("role-rotator");
    if (roleEl && !prefersReducedMotion) {
        var roles = [
            "scalable backends",
            "realtime systems",
            "mobile & web apps",
            "developer-friendly APIs"
        ];
        var roleIndex = 0;
        setInterval(function () {
            roleEl.classList.add("role-fade");
            setTimeout(function () {
                roleIndex = (roleIndex + 1) % roles.length;
                roleEl.textContent = roles[roleIndex];
                roleEl.classList.remove("role-fade");
            }, 320);
        }, 3200);
    }

    /* ---------- Spotlight hover on cards ---------- */
    if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll(".spotlight-card").forEach(function (card) {
            card.addEventListener("mousemove", function (e) {
                var rect = card.getBoundingClientRect();
                card.style.setProperty("--mx", (e.clientX - rect.left) + "px");
                card.style.setProperty("--my", (e.clientY - rect.top) + "px");
            });
        });
    }

    /* ---------- Contact form ---------- */
    // The form posts to FormSubmit and redirects back with ?sent=true.
    var form = document.getElementById("contact-form");
    if (form) {
        form.addEventListener("submit", function () {
            var btn = form.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                var text = btn.querySelector(".btn-text");
                if (text) text.textContent = "Sending…";
            }
        });
    }
    if (new URLSearchParams(window.location.search).get("sent") === "true") {
        var success = document.getElementById("form-success");
        if (success) success.hidden = false;
        history.replaceState(null, "", window.location.pathname + window.location.hash);
    }

    /* ---------- Smooth anchor scrolling (with nav offset handled by CSS) ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var target = document.querySelector(anchor.getAttribute("href"));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: prefersReducedMotion ? "auto" : "smooth", block: "start" });
                history.replaceState(null, "", anchor.getAttribute("href"));
            }
        });
    });
})();
