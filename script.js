function createElement(tag, className, textContent, attributes = {}) {
  const element = document.createElement(tag);
  if (className) element.className = className;
  if (typeof textContent === 'string') element.textContent = textContent;
  if (attributes && typeof attributes === 'object') {
    Object.entries(attributes).forEach(([key, value]) => {
      if (key === 'href') element.setAttribute('href', value);
      else if (key === 'target') element.setAttribute('target', value);
      else if (key === 'onclick') element.setAttribute('onclick', value);
      else element[key] = value;
    });
  }
  return element;
}

function renderNav(links, brandName) {
  const brand = document.querySelector('.topbar .brand');
  const navLinks = document.getElementById('navLinks');
  if (brand) brand.textContent = brandName;

  navLinks.innerHTML = '';
  links.forEach((link, index) => {
    const anchor = createElement('a', '', link.label, { href: link.href });
    if (index === 0) anchor.classList.add('active');
    navLinks.appendChild(anchor);
  });
}

function renderHero(hero) {
  const header = document.getElementById('home');
  header.innerHTML = `
    <div class="hero-content">
      <div class="hero-copy">
        <p class="eyebrow">${hero.eyebrow}</p>
        <h1>${hero.name}</h1>
        <p class="hero-text">${hero.description}</p>
        <div class="hero-actions">
          <a class="btn btn-primary" href="${hero.resume}" target="_blank">${hero.resumeLabel}</a>
          <a class="btn btn-secondary" href="${hero.actionHref}">${hero.actionLabel}</a>
        </div>
        <div class="hero-social"></div>
      </div>
      <div class="hero-image">
        <img src="abhinav.jpeg" alt="${hero.name}" />
      </div>
    </div>
  `;

  const socialContainer = header.querySelector('.hero-social');
  hero.social.forEach(item => {
    const anchor = createElement('a', '', item.label, { href: item.href, target: '_blank' });
    socialContainer.appendChild(anchor);
  });
}

function renderSection(sectionId, data) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  section.innerHTML = '';

  const header = createElement('div', 'section-header');
  header.appendChild(createElement('span', '', data.title));
  header.appendChild(createElement('h2', '', data.subtitle));
  section.appendChild(header);

  if (sectionId === 'about') {
    section.appendChild(createElement('p', '', data.text));
    return;
  }

  if (sectionId === 'skills') {
    const grid = createElement('div', 'skills-grid');
    data.items.forEach(skill => grid.appendChild(createElement('div', 'skill-card', skill)));
    section.appendChild(grid);
    return;
  }

  if (sectionId === 'projects') {
    const grid = createElement('div', 'project-grid');
    data.items.forEach(project => {
      const card = createElement('article', 'project-card');
      card.appendChild(createElement('h3', '', project.title));
      card.appendChild(createElement('p', '', project.description));
      if (project.href) {
        const link = createElement('a', 'project-link', 'View Project', { href: project.href, target: '_blank' });
        card.appendChild(link);
      }
      grid.appendChild(card);
    });
    section.appendChild(grid);
    return;
  }

  if (sectionId === 'certificates') {
    const grid = createElement('div', 'certificate-grid');
    data.items.forEach(item => {
      const card = createElement('div', 'certificate-card');
      card.setAttribute('onclick', `window.open('${item.link}')`);
      card.appendChild(createElement('h3', '', item.title));
      card.appendChild(createElement('p', '', item.description));
      grid.appendChild(card);
    });
    section.appendChild(grid);
    return;
  }

  if (sectionId === 'contact') {
    const grid = createElement('div', 'contact-grid');
    data.items.forEach(item => {
      const box = createElement('div');
      box.appendChild(createElement('p', '', item.label));
      box.appendChild(createElement('a', '', item.value, { href: item.href, target: '_blank' }));
      grid.appendChild(box);
    });
    section.appendChild(grid);
    return;
  }
}

function setActiveLink() {
  const scrollPosition = window.scrollY + 140;
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.topbar .nav-links a');

  sections.forEach(section => {
    const link = document.querySelector(`.topbar .nav-links a[href="#${section.id}"]`);
    if (!link) return;
    if (scrollPosition >= section.offsetTop && scrollPosition < section.offsetTop + section.offsetHeight) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  const firstLink = navLinks[0];
  const header = document.getElementById('home');
  if (window.scrollY < header.offsetHeight * 0.2 && firstLink) {
    navLinks.forEach(item => item.classList.remove('active'));
    firstLink.classList.add('active');
  }
}

function attachNavEvents() {
  const navLinks = document.querySelectorAll('.topbar .nav-links a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.forEach(item => item.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

function initPortfolio() {
  const data = window.portfolioData || portfolioData;
  if (!data) return;
  document.title = data.siteTitle;
  renderNav(data.navLinks, data.brandName);
  renderHero(data.hero);
  renderSection('about', data.about);
  renderSection('skills', data.skills);
  renderSection('projects', data.projects);
  renderSection('certificates', data.certificates);
  renderSection('contact', data.contact);
  const footer = document.getElementById('footer');
  if (footer) footer.innerHTML = `<p>© 2026 ${data.brandName} | All Rights Reserved</p>`;
  attachNavEvents();
  window.addEventListener('scroll', setActiveLink);
  setActiveLink();
}

document.addEventListener('DOMContentLoaded', initPortfolio);
