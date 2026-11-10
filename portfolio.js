// ---------- Utilities ----------
function escapeHtml(str) {
    return String(str)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function safeEncodeUrl(url) {
    if (!url) return "";
    if (/^https?:\/\//i.test(url) || /^(mailto|tel):/i.test(url)) return url;
    return encodeURI(url);
}

// ---------- Main render ----------
function renderPortfolio() {
    renderNavigation();
    renderMobileNavigation();
    renderContactInfo();
    renderPersonalDetails();
    renderHeroStats();
    renderProjectFilters();
    renderProjects();
    renderSkills();
    renderEducation();
}

// ---------- Navigation ----------
function renderNavigation() {
    const mainNavList = document.getElementById("main-nav-list");
    let html = `<li><a href="#about" class="nav-item active" data-target="about" aria-current="location"><span class="nav-num">01</span><span class="nav-label">ABOUT</span></a></li>`;

    html += `<li class="has-subnav"><a href="#projects" class="nav-item" data-target="projects"><span class="nav-num">02</span><span class="nav-label">PROJECTS & EXPERIENCE</span></a><ul class="project-subnav">`;
    portfolioData.projects.forEach((p) => {
        html += `<li><a href="#${ p.id }" class="subnav-item" data-target="${ p.id }"><span class="nav-num">${ p.index }</span><span class="nav-label">${ escapeHtml(p.title) }</span></a></li>`;
    });
    html += `</ul></li>`;

    html += `<li><a href="#skills" class="nav-item" data-target="skills"><span class="nav-num">03</span><span class="nav-label">SKILLS</span></a></li>`;
    html += `<li><a href="#education" class="nav-item" data-target="education"><span class="nav-num">04</span><span class="nav-label">EDUCATION</span></a></li>`;

    mainNavList.innerHTML = html;
}

function renderMobileNavigation() {
    const list = document.getElementById("mobile-nav-list");
    if (!list) return;
    const items = [
        { target: "about", num: "01" },
        { target: "projects", num: "02" },
        { target: "skills", num: "03" },
        { target: "education", num: "04" },
    ];
    list.innerHTML = items
        .map(
            (it) =>
                `<li><a href="#${ it.target }" class="mobile-nav-item ${ it.target === "about" ? "active" : "" }" data-target="${ it.target }" aria-label="Go to ${ it.target }">${ it.num }</a></li>`,
        )
        .join("");
}

// ---------- Contact ----------
function renderContactInfo() {
    const popover = document.getElementById("header-contact-popover");
    const heroContactCard = document.getElementById("hero-contact-card");

    let popoverHtml = "";
    let heroCardHtml = "";

    portfolioData.contact.forEach((c) => {
        const targetAttr = c.external ? 'target="_blank" rel="noopener noreferrer"' : "";
        const safeHref = safeEncodeUrl(c.href);
        const copyAttr = escapeHtml(c.copyText);

        popoverHtml += `
            <div class="popover-item">
                <span class="popover-label">${ escapeHtml(c.label) }</span>
                <div class="popover-value-row">
                    <a href="${ safeHref }" ${ targetAttr }>${ escapeHtml(c.value) }</a>
                    <button type="button" class="copy-btn-sm" data-copy="${ copyAttr }" aria-label="${ escapeHtml(c.copyAria) }">Copy</button>
                </div>
            </div>`;

        heroCardHtml += `
            <div class="hero-contact-row">
                <span class="hc-label">${ escapeHtml(c.label) }</span>
                <div class="hc-val-group">
                    <a href="${ safeHref }" ${ targetAttr }>${ escapeHtml(c.value) }</a>
                    <button type="button" class="copy-btn" data-copy="${ copyAttr }" aria-label="${ escapeHtml(c.copyAria) }">Copy</button>
                </div>
            </div>`;
    });

    popover.innerHTML = popoverHtml;
    heroContactCard.innerHTML = heroCardHtml;
}

// ---------- Personal ----------
function renderPersonalDetails() {
    document.getElementById("header-brand-name").textContent = portfolioData.personal.name;
    document.getElementById("hero-status").textContent = portfolioData.personal.status;
    document.getElementById("hero-title").textContent = portfolioData.personal.name;
    document.getElementById("hero-subtitle").textContent = portfolioData.personal.role;
    document.getElementById("hero-tagline").textContent = portfolioData.personal.tagline;
}

function renderHeroStats() {
    const container = document.getElementById("hero-stats");
    if (!container) return;
    const edu = portfolioData.education.find((e) => !e.isCert);
    const gpa = edu ? edu.gpa.split(" / ")[0] : "";
    container.innerHTML = `
        <div class="hero-stat"><strong>${ portfolioData.projects.length }</strong><span>Projects</span></div>
        <div class="hero-stat"><strong>2+</strong><span>Years exp.</span></div>
        <div class="hero-stat"><strong>${ gpa }</strong><span>GPA / 4.0</span></div>
        <div class="hero-stat"><strong>IELTS 6.0</strong><span>English</span></div>
    `;
}

// ---------- Project filter ----------
function renderProjectFilters() {
    const container = document.getElementById("project-filters");
    if (!container) return;
    const cats = ["All", ...new Set(portfolioData.projects.map((p) => p.category))];
    container.innerHTML = cats
        .map(
            (c, i) =>
                `<button type="button" class="filter-chip ${ i === 0 ? "active" : "" }" data-filter="${ escapeHtml(c) }" role="tab" aria-selected="${ i === 0 }">${ escapeHtml(c) }</button>`,
        )
        .join("");
}

// ---------- Projects ----------
function renderProjects() {
    const projectsGrid = document.getElementById("projects-grid");
    let html = "";

    portfolioData.projects.forEach((p) => {
        const safeLink = safeEncodeUrl(p.link);
        const linkElement = p.isStatic
            ? `<span class="static pe-link">${ escapeHtml(p.linkText) }</span>`
            : `<a href="${ safeLink }" target="_blank" rel="noopener noreferrer" class="pe-link">${ escapeHtml(p.linkText) }</a>`;

        let decisionsHtml = "";
        p.decisions.forEach((d) => {
            decisionsHtml += `<li>${ escapeHtml(d) }</li>`;
        });

        let pdfHtml = "";
        if (p.pdfSrc) {
            const encodedPdf = safeEncodeUrl(p.pdfSrc);
            pdfHtml = `
                <div class="pe-pdf-preview-wrapper">
                    <button type="button" class="pdf-preview-btn" data-pdf-toggle="${ escapeHtml(p.id) }">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                        <span>Preview Document</span>
                    </button>
                    <div class="pe-pdf-container" id="pdf-container-${ escapeHtml(p.id) }" style="display: none;">
                        <div class="pdf-header-bar">
                            <span class="pdf-title">${ escapeHtml(p.pdfTitle || "Attached Document") }</span>
                            <button type="button" class="pdf-close-btn" data-pdf-close="${ escapeHtml(p.id) }" aria-label="Close document">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>
                        <iframe data-src="${ encodedPdf }" title="${ escapeHtml(p.pdfTitle || "PDF Preview") }" loading="lazy"></iframe>
                        <a class="pdf-mobile-fallback" href="${ encodedPdf }" target="_blank" rel="noopener noreferrer">
                            Open PDF in new tab ↗
                        </a>
                    </div>
                </div>`;
        }

        let techStackHtml = "";
        p.techStack.forEach((t) => {
            techStackHtml += `<span>${ escapeHtml(t) }</span>`;
        });

        html += `
            <article class="pe-item" id="${ escapeHtml(p.id) }" data-category="${ escapeHtml(p.category) }">
                <div class="pe-top">
                    <div class="pe-heading-group">
                        <span class="pe-index">${ p.index }</span>
                        <h3 class="pe-title">${ escapeHtml(p.title) }</h3>
                    </div>
                    ${ linkElement }
                </div>
                <div class="pe-meta-grid">
                    <div class="pe-meta-field"><strong>Role: </strong>${ escapeHtml(p.role) }</div>
                    <div class="pe-meta-field"><strong>Duration: </strong>${ escapeHtml(p.duration) }</div>
                    <div class="pe-meta-field"><strong>Domain: </strong>${ escapeHtml(p.domain) }</div>
                </div>
                <div class="pe-section-block"><h4 class="pe-subheading">Overview</h4><p class="pe-desc">${ escapeHtml(p.overview) }</p></div>
                <div class="pe-section-block"><h4 class="pe-subheading">Problem</h4><p class="pe-desc">${ escapeHtml(p.problem) }</p></div>
                <div class="pe-section-block"><h4 class="pe-subheading">Solution & Engineering Approach</h4><p class="pe-desc">${ escapeHtml(p.solution) }</p></div>
                <div class="pe-section-block"><h4 class="pe-subheading">Key Engineering Decisions</h4><ul class="pe-bullet-list">${ decisionsHtml }</ul></div>
                ${ pdfHtml }
                <div class="pe-tech-stack">${ techStackHtml }</div>
            </article>`;
    });

    projectsGrid.innerHTML = html;
}

// ---------- Skills ----------
function renderSkills() {
    const skillsGrid = document.getElementById("skills-grid");
    let html = "";

    portfolioData.skills.forEach((s) => {
        if (s.fullWidth) {
            let softSkillsHtml = "";
            s.softSkills.forEach((ss) => {
                // softSkills contains trusted authored HTML
                softSkillsHtml += `<li>${ ss }</li>`;
            });
            html += `<div class="skill-category full-width"><h3>${ escapeHtml(s.category) }</h3><ul class="soft-skills-list">${ softSkillsHtml }</ul></div>`;
        } else {
            const chips = s.tags
                .split(",")
                .map((t) => t.trim())
                .filter(Boolean)
                .map((t) => `<span class="skill-chip">${ escapeHtml(t) }</span>`)
                .join("");
            html += `<div class="skill-category"><h3>${ escapeHtml(s.category) }</h3><div class="skill-chips">${ chips }</div></div>`;
        }
    });

    skillsGrid.innerHTML = html;
}

// ---------- Education ----------
function renderEducation() {
    const educationStack = document.getElementById("education-stack");
    let html = "";

    portfolioData.education.forEach((e) => {
        if (e.isCert) {
            html += `<div class="education-card cert-card"><div class="edu-top"><h3 class="edu-degree">${ escapeHtml(e.degree) }</h3></div><p class="edu-institution cert-title-row"><a href="${ safeEncodeUrl(e.certLink) }" target="_blank" rel="noopener noreferrer" class="cert-link">${ escapeHtml(e.institution) }</a></p></div>`;
        } else {
            html += `<div class="education-card"><div class="edu-top"><h3 class="edu-degree">${ escapeHtml(e.degree) }</h3><span class="edu-years">${ escapeHtml(e.years) }</span></div><p class="edu-institution">${ escapeHtml(e.institution) }</p><div class="edu-metrics"><div class="metric-badge">GPA: <strong>${ escapeHtml(e.gpa) }</strong></div><div class="metric-badge">English: <strong>${ escapeHtml(e.english) }</strong></div></div></div>`;
        }
    });

    educationStack.innerHTML = html;
}

// ---------- Exports ----------
function buildMarkdown() {
    const p = portfolioData.personal;
    let md = `# ${ p.name }\n\n**${ p.role }** — ${ p.status }\n\n${ p.tagline }\n\n`;
    md += `## Contact\n\n`;
    portfolioData.contact.forEach((c) => {
        md += `- **${ c.label }:** [${ c.value }](${ c.href })\n`;
    });
    md += `\n## Projects\n`;
    portfolioData.projects.forEach((pr) => {
        md += `\n### ${ pr.index }. ${ pr.title }\n\n`;
        md += `- **Role:** ${ pr.role }\n- **Duration:** ${ pr.duration }\n- **Domain:** ${ pr.domain }\n\n`;
        md += `${ pr.overview }\n\n`;
        md += `**Stack:** ${ pr.techStack.join(", ") }\n`;
    });
    md += `\n## Skills\n\n`;
    portfolioData.skills.forEach((s) => {
        if (!s.fullWidth) md += `- **${ s.category }:** ${ s.tags }\n`;
    });
    md += `\n## Education\n\n`;
    portfolioData.education.forEach((e) => {
        if (e.isCert) {
            md += `- **${ e.degree }** — ${ e.institution }\n`;
        } else {
            md += `- **${ e.degree }** (${ e.years }) — ${ e.institution } · GPA ${ e.gpa } · ${ e.english }\n`;
        }
    });
    return md;
}

function buildVCard() {
    const p = portfolioData.personal;
    const get = (label) => portfolioData.contact.find((x) => x.label === label)?.value || "";
    const escape = (s) => String(s).replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const [firstName, ...rest] = p.name.split(" ");
    return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${ escape(rest.join(" ") || firstName) };${ escape(firstName) };;;`,
        `FN:${ escape(p.name) }`,
        `TITLE:${ escape(p.role) }`,
        `TEL;TYPE=CELL:${ get("Phone") }`,
        `EMAIL:${ get("Email") }`,
        `URL:${ get("GitHub") }`,
        `URL:${ get("LinkedIn") }`,
        `NOTE:${ escape(p.tagline) }`,
        "END:VCARD",
    ].join("\r\n");
}
