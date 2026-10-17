const pages = [
  ["Home", "index.html"], ["Services", "services.html"],
  ["Industries", "industries.html"], ["Work", "work.html"],
  ["About", "about.html"], ["Process", "process.html"],
  ["Pricing", "pricing.html"], ["Contact", "contact.html"]
];

const current = document.body.dataset.page || "Home";
const header = document.querySelector("#site-header");
header.innerHTML = `
  <header class="topbar">
    <div class="shell navrow">
      <a class="brand" href="index.html" aria-label="Navrix Technologies home"><img src="assets/navrix-mark.svg" alt=""></a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="navlinks">Menu</button>
      <nav id="navlinks" class="navlinks" aria-label="Main navigation">
        ${pages.map(([name, url]) => `<a href="${url}" ${name === current ? 'aria-current="page"' : ""} class="${name === "Contact" ? "nav-cta" : ""}">${name}</a>`).join("")}
      </nav>
    </div>
  </header>`;

const footer = document.querySelector("#site-footer");
footer.innerHTML = `
  <footer class="footer">
    <div class="shell">
      <div class="footer-grid">
        <div>
          <a class="brand" href="index.html" aria-label="Navrix Technologies home"><img src="assets/navrix-mark.svg" alt=""></a>
          <p>Navrix Technologies connects digital direction, social content, interface design, and engineering to make every part of an online presence feel more considered.</p>
        </div>
        <div><h4>Explore</h4><div class="footer-links">${pages.slice(1, 6).map(([name, url]) => `<a href="${url}">${name}</a>`).join("")}</div></div>
        <div><h4>Plan your next step</h4><div class="footer-links"><a href="pricing.html">Pricing approach</a><a href="work.html">Concept work</a><a href="contact.html">Contact setup</a></div></div>
      </div>
      <div class="footer-bottom"><p>© <span id="year"></span> Navrix Technologies</p><p>Clear thinking. Useful technology.</p></div>
    </div>
  </footer>`;
document.querySelector("#year").textContent = new Date().getFullYear();

const toggle = document.querySelector(".menu-toggle");
const nav = document.querySelector("#navlinks");
function closeMenu() {
  nav.classList.remove("open");
  toggle.setAttribute("aria-expanded", "false");
  toggle.textContent = "Menu";
}
toggle.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  toggle.setAttribute("aria-expanded", String(open));
  toggle.textContent = open ? "Close" : "Menu";
});
nav.addEventListener("click", event => {
  if (event.target.closest("a")) closeMenu();
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape" && nav.classList.contains("open")) {
    closeMenu();
    toggle.focus();
  }
});
document.addEventListener("click", event => {
  if (nav.classList.contains("open") && !event.target.closest(".navrow")) closeMenu();
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealSelectors = [
  "#main section:not(.hero):not(.page-hero) .section-head",
  "#main section:not(.hero):not(.page-hero) .card",
  "#main section:not(.hero):not(.page-hero) .industry-card",
  "#main section:not(.hero):not(.page-hero) .service-row",
  "#main section:not(.hero):not(.page-hero) .process-step",
  "#main section:not(.hero):not(.page-hero) .pricing-step",
  "#main section:not(.hero):not(.page-hero) .value-row",
  "#main section:not(.hero):not(.page-hero) .project",
  "#main section:not(.hero):not(.page-hero) .cta-band",
  "#main section:not(.hero):not(.page-hero) .form-panel",
  "#main section:not(.hero):not(.page-hero) .callout"
].join(",");
document.querySelectorAll(revealSelectors).forEach(item => {
  if (!item.parentElement.closest(".reveal")) item.classList.add("reveal");
});
const revealItems = [...document.querySelectorAll("#main .reveal")];

if (!reducedMotion && window.gsap && window.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
  document.documentElement.classList.add("gsap-ready");
  const intro = [...document.querySelectorAll(".hero-copy .eyebrow, .hero-copy h1, .hero-copy > p, .hero-copy .hero-actions, .hero-copy .hero-proof, .page-hero .breadcrumbs, .page-hero .eyebrow, .page-hero h1, .page-hero p")];
  if (intro.length) gsap.fromTo(intro, { autoAlpha: 0, y: 42, filter: "blur(8px)" }, { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, stagger: 0.095, ease: "power4.out", clearProps: "transform,filter" });
  const visual = document.querySelector(".hero-architecture");
  if (visual) gsap.fromTo(visual, { autoAlpha: 0, scale: 0.87, y: 34, rotateX: 8 }, { autoAlpha: 1, scale: 1, y: 0, rotateX: 0, duration: 1.4, ease: "power3.out", delay: 0.25, clearProps: "transform" });
  revealItems.forEach(item => gsap.fromTo(item,
    { autoAlpha: 0, y: 46, filter: "blur(7px)" },
    { autoAlpha: 1, y: 0, filter: "blur(0px)", duration: 1.05, ease: "power4.out", clearProps: "filter,transform", scrollTrigger: { trigger: item, start: "top 86%", once: true } }
  ));
  document.querySelectorAll("#main section").forEach(section => {
    const visualItems = section.querySelectorAll(".project-scene, .principle-panel, .form-panel, .process-track, .industries-note");
    visualItems.forEach((item, index) => {
      item.classList.add("motion-art");
      gsap.fromTo(item, { y: 24 + index * 4, rotateX: 3 }, { y: -18, rotateX: 0, ease: "none", scrollTrigger: { trigger: section, start: "top bottom", end: "bottom top", scrub: 0.65 } });
    });
    if (section.classList.contains("hero") || section.classList.contains("page-hero")) {
      gsap.to(section, { backgroundPosition: "50% 14%", ease: "none", scrollTrigger: { trigger: section, start: "top top", end: "bottom top", scrub: 0.7 } });
    }
  });
  document.querySelectorAll(".process-track .process-step").forEach(step => {
    ScrollTrigger.create({ trigger: step, start: "top 66%", end: "bottom 45%", onToggle: self => step.classList.toggle("is-active", self.isActive) });
  });
  const serviceList = document.querySelector(".service-list");
  if (serviceList) gsap.to(serviceList, { "--story-progress": 1, ease: "none", scrollTrigger: { trigger: serviceList, start: "top 70%", end: "bottom 70%", scrub: true } });
  const heroVisual = document.querySelector(".hero-visual");
  if (heroVisual) gsap.to(heroVisual, { y: -70, rotateZ: -1, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.8 } });

  // A pinned, three chapter scrollytelling sequence on the home page.
  const story = document.querySelector(".story-section");
  if (story && window.innerWidth > 900) {
    const chapters = [...story.querySelectorAll(".story-chapter")];
    const panels = [...story.querySelectorAll(".story-panel")];
    const steps = [...story.querySelectorAll(".story-steps span")];
    if (chapters.length === 3 && panels.length === 3) {
      story.classList.add("is-pinned");
      gsap.set(chapters.slice(1), { autoAlpha: 0, y: 28 });
      gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.94, y: 38, rotateY: 5 });
      const storyTimeline = gsap.timeline({
        scrollTrigger: { trigger: story, start: "top top+=78", end: "+=1950", scrub: 0.8, pin: story.querySelector(".story-pin"), anticipatePin: 1 }
      });
      for (let index = 0; index < 2; index += 1) {
        const at = index * 1.05;
        storyTimeline.to(chapters[index], { autoAlpha: 0, y: -25, duration: 0.34 }, at)
          .fromTo(chapters[index + 1], { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.34 }, at + 0.16)
          .to(panels[index], { autoAlpha: 0, scale: 0.96, y: -24, rotateY: -4, duration: 0.38 }, at)
          .fromTo(panels[index + 1], { autoAlpha: 0, scale: 0.94, y: 38, rotateY: 5 }, { autoAlpha: 1, scale: 1, y: 0, rotateY: 0, duration: 0.42 }, at + 0.17);
      }
      storyTimeline.eventCallback("onUpdate", () => {
        const activeStep = Math.min(2, Math.floor(storyTimeline.progress() * 3));
        steps.forEach((step, index) => step.classList.toggle("is-active", index === activeStep));
      });
    }
  }

  // Let portfolio art and editorial headings resolve as each section enters view.
  document.querySelectorAll("#main .project-scene").forEach(scene => {
    gsap.fromTo(scene, { clipPath: "inset(12% 8% 12% 8% round 14px)", scale: 0.94 }, { clipPath: "inset(0% 0% 0% 0% round 12px)", scale: 1, ease: "none", scrollTrigger: { trigger: scene, start: "top 88%", end: "center 55%", scrub: 0.7 } });
  });
  document.querySelectorAll("#main .section-head h2, #main .copy-wide h2, #main .cta-band h2").forEach(heading => {
    gsap.fromTo(heading, { y: 34, clipPath: "inset(0 0 38% 0)" }, { y: 0, clipPath: "inset(0 0 0% 0)", ease: "none", scrollTrigger: { trigger: heading, start: "top 91%", end: "top 58%", scrub: 0.55 } });
  });
} else if (revealItems.length && !reducedMotion && "IntersectionObserver" in window) {
  document.documentElement.classList.add("js-ready");
  const observer = new IntersectionObserver((entries, activeObserver) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -32px 0px" });
  revealItems.forEach(item => observer.observe(item));
}

const progress = document.createElement("div");
progress.className = "top-progress";
progress.setAttribute("aria-hidden", "true");
document.body.prepend(progress);
if (window.gsap && window.ScrollTrigger && !reducedMotion) {
  gsap.to(progress, { scaleX: 1, ease: "none", scrollTrigger: { trigger: document.documentElement, start: "top top", end: "bottom bottom", scrub: 0.25 } });
}

const ticker = document.createElement("div");
ticker.className = "ticker";
ticker.setAttribute("aria-label", "Digital direction, social presence, web experiences, useful products");
ticker.innerHTML = `<div class="ticker-track" aria-hidden="true">${Array.from({ length: 2 }, () => `<span class="ticker-item">Digital direction</span><span class="ticker-item">Social presence</span><span class="ticker-item">Web experiences</span><span class="ticker-item">Useful products</span><span class="ticker-item">Content with purpose</span>`).join("")}</div>`;
const firstSection = document.querySelector("#main > section");
if (firstSection) firstSection.after(ticker);

if (!reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  document.querySelectorAll(".card, .project, .principle-panel, .form-panel, .cta-band").forEach(item => {
    item.addEventListener("pointermove", event => {
      const bounds = item.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width;
      const y = (event.clientY - bounds.top) / bounds.height;
      item.style.setProperty("--pointer-x", `${x * 100}%`);
      item.style.setProperty("--pointer-y", `${y * 100}%`);
      item.style.setProperty("--tilt-x", `${(0.5 - y) * 3}deg`);
      item.style.setProperty("--tilt-y", `${(x - 0.5) * 4}deg`);
    });
    item.addEventListener("pointerleave", () => {
      item.style.setProperty("--tilt-x", "0deg");
      item.style.setProperty("--tilt-y", "0deg");
    });
  });
}

const transition = document.createElement("div");
transition.className = "page-transition";
transition.setAttribute("aria-hidden", "true");
transition.innerHTML = '<img src="assets/navrix-mark.svg" alt="">';
document.body.append(transition);
if (!reducedMotion && window.gsap) {
  document.addEventListener("click", event => {
    const link = event.target.closest('a[href]');
    if (!link || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || link.target || link.hasAttribute("download")) return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin || destination.pathname === window.location.pathname || destination.hash) return;
    event.preventDefault();
    gsap.to(transition, { clipPath: "inset(0% 0 0)", duration: 0.55, ease: "power4.inOut", onComplete: () => { window.location.href = destination.href; } });
  });
}

const formStatusButton = document.querySelector("#form-status-preview");
if (formStatusButton) formStatusButton.addEventListener("click", () => {
  document.querySelector("#form-status").textContent = "This preview is not connected to an inbox or backend. Nothing was sent or stored.";
});

const heroVisual = document.querySelector(".hero-visual");
if (heroVisual && !reducedMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
  heroVisual.addEventListener("pointermove", event => {
    const bounds = heroVisual.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    heroVisual.style.setProperty("--tilt-y", `${x * 7}deg`);
    heroVisual.style.setProperty("--tilt-x", `${-y * 5}deg`);
  });
  heroVisual.addEventListener("pointerleave", () => {
    heroVisual.style.setProperty("--tilt-y", "0deg");
    heroVisual.style.setProperty("--tilt-x", "0deg");
  });
}

// End-of-page enquiry prompt. It is a frontend preview only: nothing is transmitted or stored.
if (current.toLowerCase() !== "contact" && "HTMLDialogElement" in window) {
  let alreadyPrompted = false;
  try { alreadyPrompted = sessionStorage.getItem("navrix-enquiry-prompted") === "yes"; } catch (_) {}
  if (!alreadyPrompted) {
    const dialog = document.createElement("dialog");
    dialog.className = "enquiry-dialog";
    dialog.setAttribute("aria-labelledby", "enquiry-title");
    dialog.innerHTML = `
      <div class="enquiry-dialog-head"><div><span class="eyebrow warm">A useful place to begin</span><h2 id="enquiry-title">Tell us what you’re trying to make possible.</h2></div><button class="enquiry-close" type="button" aria-label="Close enquiry form">×</button></div>
      <p class="enquiry-note">This enquiry preview is not connected yet. Nothing you enter is sent or saved.</p>
      <form class="enquiry-popup-form" novalidate>
        <label for="popup-name">Name <span>optional</span><input id="popup-name" name="name" autocomplete="name" placeholder="Your name"></label>
        <label for="popup-email">Email <span>optional</span><input id="popup-email" name="email" type="email" autocomplete="email" placeholder="Your email address"></label>
        <label class="popup-full" for="popup-topic">What are you exploring?<select id="popup-topic" name="topic"><option value="">Choose an area</option><option>Social content and digital handling</option><option>Website or digital presence</option><option>Web application or portal</option><option>Business system or workflow</option><option>Product design or strategy</option><option>Not sure yet</option></select></label>
        <label class="popup-full" for="popup-message">A little about the challenge <span>optional</span><textarea id="popup-message" name="message" rows="3" placeholder="What would you like to improve?"></textarea></label>
        <div class="popup-actions"><button class="button primary" type="submit">Review enquiry <span class="arrow">→</span></button><span id="popup-status" role="status" aria-live="polite"></span></div>
      </form>`;
    document.body.append(dialog);
    const closeButton = dialog.querySelector(".enquiry-close");
    const popupForm = dialog.querySelector(".enquiry-popup-form");
    const status = dialog.querySelector("#popup-status");
    let opener = null;
    const closeDialog = () => {
      dialog.close();
      popupForm.reset();
      status.textContent = "";
      try { sessionStorage.setItem("navrix-enquiry-prompted", "yes"); } catch (_) {}
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true });
    };
    closeButton.addEventListener("click", closeDialog);
    dialog.addEventListener("click", event => { if (event.target === dialog) closeDialog(); });
    dialog.addEventListener("cancel", event => { event.preventDefault(); closeDialog(); });
    popupForm.addEventListener("submit", event => {
      event.preventDefault();
      status.textContent = "Preview only. The enquiry has not been delivered or saved.";
      status.classList.add("is-visible");
    });
    const footerObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting) || dialog.open) return;
      opener = document.activeElement;
      dialog.showModal();
      closeButton.focus();
    }, { threshold: 0.04, rootMargin: "0px 0px 40px 0px" });
    const siteFooter = document.querySelector("#site-footer");
    if (siteFooter) footerObserver.observe(siteFooter);
  }
}
