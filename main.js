// ---------- Init ----------
document.addEventListener("DOMContentLoaded", () => {
    renderPortfolio();
    initTheme();
    initCopyDelegation();
    initPdfDelegation();
    initContactPopover();
    initStarfield();
    initScrollSpy();
    initClock();
    initProgressBar();
    initScrollHeader();
    initSmoothSubnav();
    initHeroActions();
    initIntro();
    initA11yAnnounce();
});

// ---------- Theme ----------
function initTheme() {
    const root = document.documentElement;
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", () => {
        const isDark = root.classList.toggle("dark");
        root.classList.toggle("light", !isDark);
        try {
            localStorage.setItem("theme", isDark ? "dark" : "light");
        } catch { }
        announce(isDark ? "Switched to dark theme" : "Switched to light theme");
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onOsChange = (e) => {
        if (localStorage.getItem("theme")) return;
        root.classList.toggle("dark", e.matches);
        root.classList.toggle("light", !e.matches);
    };
    if (mq.addEventListener) mq.addEventListener("change", onOsChange);
    else if (mq.addListener) mq.addListener(onOsChange);
}

// ---------- Copy / PDF delegation ----------
function initCopyDelegation() {
    document.addEventListener("click", (e) => {
        const btn = e.target.closest("[data-copy]");
        if (!btn) return;
        copyToClipboard(btn.dataset.copy, btn);
    });
}

function initPdfDelegation() {
    document.addEventListener("click", (e) => {
        const toggle = e.target.closest("[data-pdf-toggle]");
        if (toggle) {
            togglePdfPreview(toggle.dataset.pdfToggle, toggle);
            return;
        }
        const close = e.target.closest("[data-pdf-close]");
        if (close) {
            togglePdfPreview(close.dataset.pdfClose);
        }
    });
}

function copyToClipboard(value, button) {
    if (!navigator.clipboard) {
        announce("Clipboard unavailable");
        return;
    }
    navigator.clipboard
        .writeText(value)
        .then(() => {
            const original = button.textContent;
            button.textContent = "✓ Copied";
            button.classList.add("copied");
            announce(button.getAttribute("aria-label") || "Value copied to clipboard");
            setTimeout(() => {
                button.textContent = original;
                button.classList.remove("copied");
            }, 2000);
        })
        .catch((err) => {
            console.error("Copy failed:", err);
            announce("Copy failed");
        });
}

function togglePdfPreview(projectId, btnElement) {
    const container = document.getElementById(`pdf-container-${ projectId }`);
    if (!container) return;
    const iframe = container.querySelector("iframe");
    const isHidden = container.style.display === "none";

    if (isHidden) {
        if (iframe && !iframe.getAttribute("src") && iframe.getAttribute("data-src")) {
            iframe.setAttribute("src", iframe.getAttribute("data-src"));
        }
        container.style.display = "block";
        if (btnElement) btnElement.style.display = "none";
        announce("Document preview opened");
    } else {
        container.style.display = "none";
        const wrapper = container.closest(".pe-pdf-preview-wrapper");
        const previewBtn = wrapper && wrapper.querySelector(".pdf-preview-btn");
        if (previewBtn) previewBtn.style.display = "inline-flex";
        announce("Document preview closed");
    }
}

// ---------- Contact popover ----------
function initContactPopover() {
    const trigger = document.getElementById("header-contact-trigger");
    const popover = document.getElementById("header-contact-popover");
    if (!trigger || !popover) return;

    trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        const isOpen = popover.classList.toggle("show");
        trigger.setAttribute("aria-expanded", String(isOpen));
    });

    window.addEventListener("click", (e) => {
        if (!e.target.closest(".header-contact-dropdown")) {
            popover.classList.remove("show");
            trigger.setAttribute("aria-expanded", "false");
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && popover.classList.contains("show")) {
            popover.classList.remove("show");
            trigger.setAttribute("aria-expanded", "false");
            trigger.focus();
        }
    });
}

// ---------- Starfield ----------
function initStarfield() {
    const canvas = document.getElementById("starfield-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const root = document.documentElement;
    const reduceMotionMQ = window.matchMedia("(prefers-reduced-motion: reduce)");
    let width, height;
    let stars = [];
    let ripples = [];

    const mouse = { x: -1000, y: -1000 };
    window.addEventListener("pointermove", (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    function buildStars() {
        stars = Array.from({ length: 120 }, () => ({
            x: Math.random() * width,
            y: Math.random() * height,
            size: Math.random() * 1.5 + 0.5,
            speedX: (Math.random() - 0.5) * 0.2,
            speedY: (Math.random() - 0.5) * 0.2,
        }));
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        const dpr = window.devicePixelRatio || 1;
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        canvas.style.width = `${ width }px`;
        canvas.style.height = `${ height }px`;
        buildStars();
    }

    window.addEventListener("resize", resize);
    resize();

    window.addEventListener("click", (e) => {
        if (reduceMotionMQ.matches) return;
        if (e.target.closest("button") || e.target.closest("a")) return;
        ripples.push({ x: e.clientX, y: e.clientY, startTime: Date.now() });
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        const isDark = root.classList.contains("dark");
        const [r, g, b] = isDark ? [52, 211, 153] : [6, 95, 70];
        const reduce = reduceMotionMQ.matches;

        stars.forEach((s) => {
            if (!reduce) {
                s.x = (s.x + s.speedX + width) % width;
                s.y = (s.y + s.speedY + height) % height;
            }
            const dist = Math.hypot(s.x - mouse.x, s.y - mouse.y);
            const influence = Math.max(0, 1 - dist / 180);
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size + influence * 2, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${ r }, ${ g }, ${ b }, ${ isDark ? 0.25 + influence * 0.55 : 0.15 + influence * 0.45 })`;
            ctx.fill();
        });

        if (!reduce) {
            ripples = ripples.filter((rpl) => {
                const age = (Date.now() - rpl.startTime) / 1000;
                if (age > 1.2) return false;
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${ r }, ${ g }, ${ b }, ${ 0.4 * (1 - age / 1.2) })`;
                ctx.lineWidth = 1.5;
                ctx.arc(rpl.x, rpl.y, age * 150, 0, Math.PI * 2);
                ctx.stroke();
                return true;
            });
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// ---------- Scroll spy ----------
function initScrollSpy() {
    const sections = document.querySelectorAll(".content-section");
    const navItems = document.querySelectorAll(".section-nav .nav-item");
    const subnavItems = document.querySelectorAll(".section-nav .subnav-item");
    const mobileItems = document.querySelectorAll(".mobile-nav .mobile-nav-item");
    const projectItems = document.querySelectorAll(".pe-item");

    const setActive = (list, targetId) => {
        list.forEach((item) => {
            const isMatch = item.getAttribute("data-target") === targetId;
            item.classList.toggle("active", isMatch);
            if (isMatch && item.tagName === "A" && (list === navItems || list === mobileItems)) {
                item.setAttribute("aria-current", "location");
            } else if (item.tagName === "A") {
                item.removeAttribute("aria-current");
            }
        });
    };

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                setActive(navItems, id);
                setActive(mobileItems, id);
            });
        },
        { root: null, rootMargin: "-20% 0px -60% 0px", threshold: 0 },
    );

    sections.forEach((s) => sectionObserver.observe(s));

    const projectObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                setActive(subnavItems, entry.target.id);
            });
        },
        { root: null, rootMargin: "-10% 0px -50% 0px", threshold: 0 },
    );

    projectItems.forEach((p) => projectObserver.observe(p));

    // Entrance animation observer (shared)
    const entranceObserver = new IntersectionObserver(
        (entries, obs) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    obs.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -10% 0px" },
    );
    sections.forEach((s) => entranceObserver.observe(s));
}

// ---------- Clock ----------
function initClock() {
    function updateClock() {
        if (document.hidden) return;
        const now = new Date();
        const pad = (n) => String(n).padStart(2, "0");
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

        const timeEl = document.getElementById("clock-time");
        if (timeEl) timeEl.textContent = `${ pad(now.getHours()) }:${ pad(now.getMinutes()) }:${ pad(now.getSeconds()) }`;

        const dateEl = document.getElementById("clock-date");
        if (dateEl) {
            dateEl.textContent = `${ weekdays[now.getDay()] }, ${ months[now.getMonth()] } ${ now.getDate() }, ${ now.getFullYear() }`;
        }
    }
    setInterval(updateClock, 1000);
    updateClock();
}

// ---------- Progress bar ----------
function initProgressBar() {
    const bar = document.getElementById("progress-bar");
    if (!bar) return;
    const update = () => {
        const h = document.documentElement;
        const max = h.scrollHeight - h.clientHeight;
        const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
        bar.style.width = pct + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
}

// ---------- Scroll header + scroll to top ----------
function initScrollHeader() {
    const header = document.getElementById("compact-header");
    const topBtn = document.getElementById("scroll-top");
    window.addEventListener(
        "scroll",
        () => {
            const y = window.scrollY;
            if (header) header.classList.toggle("visible", y > window.innerHeight * 0.4);
            if (topBtn) topBtn.classList.toggle("visible", y > 500);
        },
        { passive: true },
    );

    const yearEl = document.getElementById("current-year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    if (topBtn) {
        topBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
}

// ---------- Smooth subnav ----------
function initSmoothSubnav() {
    document.querySelectorAll(".section-nav .subnav-item, .mobile-nav .mobile-nav-item").forEach((anchor) => {
        anchor.addEventListener("click", function (e) {
            const targetId = this.getAttribute("href");
            if (!targetId || !targetId.startsWith("#") || targetId.length <= 1) return;
            const target = document.querySelector(targetId);
            if (!target) return;
            e.preventDefault();
            const offset = 90;
            const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({ top: y, behavior: "smooth" });
            history.pushState({}, "", targetId);
        });
    });
}

// ---------- Hero actions (vCard + Markdown) ----------
function initHeroActions() {
    const vcardBtn = document.getElementById("download-vcard-btn");
    if (vcardBtn) {
        vcardBtn.addEventListener("click", () => {
            try {
                const blob = new Blob([buildVCard()], { type: "text/vcard" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "tran-tuan-thinh.vcf";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                announce("Contact card downloaded");
            } catch (err) {
                console.error(err);
                announce("Download failed");
            }
        });
    }

    const mdBtn = document.getElementById("copy-markdown-btn");
    if (mdBtn) {
        mdBtn.addEventListener("click", () => {
            copyToClipboard(buildMarkdown(), mdBtn);
        });
    }
}

// ---------- Project filter (delegation) ----------
document.addEventListener("click", (e) => {
    const chip = e.target.closest(".filter-chip");
    if (!chip) return;
    const container = chip.closest(".project-filters");
    if (!container) return;
    container.querySelectorAll(".filter-chip").forEach((b) => {
        b.classList.remove("active");
        b.setAttribute("aria-selected", "false");
    });
    chip.classList.add("active");
    chip.setAttribute("aria-selected", "true");
    const filter = chip.dataset.filter;
    document.querySelectorAll(".pe-item").forEach((item) => {
        const match = filter === "All" || item.dataset.category === filter;
        item.style.display = match ? "" : "none";
    });
});

// ---------- A11y announce ----------
function announce(msg) {
    const el = document.getElementById("a11y-live");
    if (!el) return;
    el.textContent = "";
    requestAnimationFrame(() => {
        el.textContent = msg;
    });
}

function initA11yAnnounce() {
    // Reserved for future global announcements.
}

// ---------- Intro screen ----------
function initIntro() {
    window.addEventListener("load", () => {
        const introScreen = document.getElementById("intro-screen");
        if (!introScreen) return;

        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (reduceMotion) {
            introScreen.remove();
            return;
        }

        // Skip on very fast connections after 1200ms to avoid a stuck overlay
        const timeout = setTimeout(finishIntro, 1500);

        function finishIntro() {
            clearTimeout(timeout);
            introScreen.classList.add("active");
            setTimeout(() => introScreen.remove(), 850);
        }

        setTimeout(finishIntro, 800);
    });
}
