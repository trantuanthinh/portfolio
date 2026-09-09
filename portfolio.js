// Render portfolio navigation, contact cards, and main sections from data
function renderPortfolio() {
    renderNavigation();
    renderContactInfo();
    renderPersonalDetails();
    renderProjects();
    renderSkills();
    renderEducation();
}

function renderNavigation() {
    const mainNavList = document.getElementById("main-nav-list");
    let html = `<li><a href="#about" class="nav-item active" data-target="about"><span class="nav-num">01</span><span class="nav-label">ABOUT</span></a></li>`;

    html += `<li class="has-subnav"><a href="#projects" class="nav-item" data-target="projects"><span class="nav-num">02</span><span class="nav-label">PROJECTS & EXPERIENCE</span></a><ul class="project-subnav">`;
    portfolioData.projects.forEach((p) => {
        html += `<li><a href="#${ p.id }" class="subnav-item" data-target="${ p.id }"><span class="nav-num">${ p.index }</span><span class="nav-label">${ p.title }</span></a></li>`;
    });
    html += `</ul></li>`;

    html += `<li><a href="#skills" class="nav-item" data-target="skills"><span class="nav-num">03</span><span class="nav-label">SKILLS</span></a></li>`;
    html += `<li><a href="#education" class="nav-item" data-target="education"><span class="nav-num">04</span><span class="nav-label">EDUCATION</span></a></li>`;

    mainNavList.innerHTML = html;
}

function renderContactInfo() {
    const popover = document.getElementById("header-contact-popover");
    const heroContactCard = document.getElementById("hero-contact-card");

    let popoverHtml = "";
    let heroCardHtml = "";

    portfolioData.contact.forEach((c) => {
        const targetAttr = c.external ? 'target="_blank" rel="noopener noreferrer"' : "";

        popoverHtml += `
                    <div class="popover-item">
                        <span class="popover-label">${ c.label }</span>
                        <div class="popover-value-row">
                            <a href="${ c.href }" ${ targetAttr }>${ c.value }</a>
                            <button type="button" class="copy-btn-sm" onclick="copyToClipboard('${ c.copyText }', this)" aria-label="${ c.copyAria }">Copy</button>
                        </div>
                    </div>`;

        heroCardHtml += `
                    <div class="hero-contact-row">
                        <span class="hc-label">${ c.label }</span>
                        <div class="hc-val-group">
                            <a href="${ c.href }" ${ targetAttr }>${ c.value }</a>
                            <button type="button" class="copy-btn" onclick="copyToClipboard('${ c.copyText }', this)" aria-label="${ c.copyAria }">Copy</button>
                        </div>
                    </div>`;
    });

    popover.innerHTML = popoverHtml;
    heroContactCard.innerHTML = heroCardHtml;
}

function renderPersonalDetails() {
    document.getElementById("header-brand-name").textContent = portfolioData.personal.name;
    document.getElementById("hero-status").textContent = portfolioData.personal.status;
    document.getElementById("hero-title").textContent = portfolioData.personal.name;
    document.getElementById("hero-subtitle").textContent = portfolioData.personal.role;
    document.getElementById("hero-tagline").textContent = portfolioData.personal.tagline;
}

function renderProjects() {
    const projectsGrid = document.getElementById("projects-grid");
    let html = "";

    portfolioData.projects.forEach((p) => {
        const linkElement = p.isStatic
            ? `<span class="static pe-link">${ p.linkText }</span>`
            : `<a href="${ p.link }" target="_blank" rel="noopener noreferrer" class="pe-link">${ p.linkText }</a>`;

        let decisionsHtml = "";
        p.decisions.forEach((d) => {
            decisionsHtml += `<li>${ d }</li>`;
        });

        let pdfHtml = "";
        if (p.pdfSrc) {
            pdfHtml = `
                        <div class="pe-pdf-preview-wrapper">
                            <button type="button" class="pdf-preview-btn" onclick="togglePdfPreview('${ p.id }', this)">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                <span>Preview Document</span>
                            </button>
                            <div class="pe-pdf-container" id="pdf-container-${ p.id }" style="display: none;">
                                <div class="pdf-header-bar">
                                    <span class="pdf-title">${ p.pdfTitle || "Attached Document" }</span>
                                    <button type="button" class="pdf-close-btn" onclick="togglePdfPreview('${ p.id }')" aria-label="Close document">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                    </button>
                                </div>
                                <iframe data-src="${ p.pdfSrc }" title="${ p.pdfTitle || "PDF Preview" }" loading="lazy"></iframe>
                            </div>
                        </div>`;
        }

        let techStackHtml = "";
        p.techStack.forEach((t) => {
            techStackHtml += `<span>${ t }</span>`;
        });

        html += `
                    <article class="pe-item" id="${ p.id }">
                        <div class="pe-top">
                            <div class="pe-heading-group">
                                <span class="pe-index">${ p.index }</span>
                                <h3 class="pe-title">${ p.title }</h3>
                            </div>
                            ${ linkElement }
                        </div>
                        <div class="pe-meta-grid">
                            <div class="pe-meta-field"><strong>Role: </strong>${ p.role }</div>
                            <div class="pe-meta-field"><strong>Duration: </strong>${ p.duration }</div>
                            <div class="pe-meta-field"><strong>Domain: </strong>${ p.domain }</div>
                        </div>
                        <div class="pe-section-block"><h4 class="pe-subheading">Overview</h4><p class="pe-desc">${ p.overview }</p></div>
                        <div class="pe-section-block"><h4 class="pe-subheading">Problem</h4><p class="pe-desc">${ p.problem }</p></div>
                        <div class="pe-section-block"><h4 class="pe-subheading">Solution & Engineering Approach</h4><p class="pe-desc">${ p.solution }</p></div>
                        <div class="pe-section-block"><h4 class="pe-subheading">Key Engineering Decisions</h4><ul class="pe-bullet-list">${ decisionsHtml }</ul></div>
                        ${ pdfHtml }
                        <div class="pe-tech-stack">${ techStackHtml }</div>
                    </article>`;
    });

    projectsGrid.innerHTML = html;
}

function renderSkills() {
    const skillsGrid = document.getElementById("skills-grid");
    let html = "";

    portfolioData.skills.forEach((s) => {
        if (s.fullWidth) {
            let softSkillsHtml = "";
            s.softSkills.forEach((ss) => {
                softSkillsHtml += `<li>${ ss }</li>`;
            });
            html += `<div class="skill-category full-width"><h3>${ s.category }</h3><ul class="soft-skills-list">${ softSkillsHtml }</ul></div>`;
        } else {
            html += `<div class="skill-category"><h3>${ s.category }</h3><p class="skill-tags">${ s.tags }</p></div>`;
        }
    });

    skillsGrid.innerHTML = html;
}

function renderEducation() {
    const educationStack = document.getElementById("education-stack");
    let html = "";

    portfolioData.education.forEach((e) => {
        if (e.isCert) {
            html += `<div class="education-card cert-card"><div class="edu-top"><h3 class="edu-degree">${ e.degree }</h3></div><p class="edu-institution cert-title-row"><a href="${ e.certLink }" target="_blank" rel="noopener noreferrer" class="cert-link">${ e.institution }</a></p></div>`;
        } else {
            html += `<div class="education-card"><div class="edu-top"><h3 class="edu-degree">${ e.degree }</h3><span class="edu-years">${ e.years }</span></div><p class="edu-institution">${ e.institution }</p><div class="edu-metrics"><div class="metric-badge">GPA: <strong>${ e.gpa }</strong></div><div class="metric-badge">English: <strong>${ e.english }</strong></div></div></div>`;
        }
    });

    educationStack.innerHTML = html;
}
