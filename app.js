(() => {
  const serviceData = {
    cloud: {
      label: "CLOUD & INFRASTRUCTURE",
      title: "Cloud & Infrastructure Solutions",
      description:
        "Build a scalable, secure, and future-ready infrastructure that supports where your business is going.",
      items: [
        "AWS & Azure migration",
        "Network design & implementation",
        "Data center modernization",
        "Hybrid cloud solutions",
      ],
      action: "Talk about cloud services",
      page: "cloud.html",
      art: "Cloud architecture",
      logos: ["AWS", "Azure", "Google Cloud", "Cisco"],
    },
    cybersecurity: {
      label: "CYBERSECURITY",
      title: "Cybersecurity Solutions",
      description:
        "Reduce risk with practical security assessment, implementation, and monitoring shaped around your environment.",
      items: [
        "Security audits & VAPT",
        "Endpoint and network security",
        "ISO 27001 & SOC 2 readiness",
        "Incident response planning",
      ],
      action: "Request a security review",
      page: "cybersecurity.html",
      art: "Secure your business",
      logos: ["VAPT", "ISO 27001", "SOC 2", "Endpoint"],
    },
    automation: {
      label: "AUTOMATION & DEVELOPMENT",
      title: "Automation & Development",
      description:
        "Make delivery more reliable and free your team from repetitive work with thoughtfully designed automation.",
      items: [
        "DevOps implementation",
        "CI/CD pipeline setup",
        "AI and ML integration",
        "Custom software & APIs",
      ],
      action: "Discuss your project",
      page: "automation.html",
      art: "Automate with confidence",
      logos: ["DevOps", "Terraform", "AI / ML", "CI / CD"],
    },
    advisory: {
      label: "ADVISORY & SUPPORT",
      title: "IT Advisory & Support",
      description:
        "Get independent guidance and responsive support to keep technology aligned with your business priorities.",
      items: [
        "IT strategy consulting",
        "Managed IT services",
        "Monitoring & support",
        "Technology roadmaps",
      ],
      action: "Plan your next step",
      page: "advisory.html",
      art: "Expertise when you need it",
      logos: ["Strategy", "Support", "Monitoring", "Roadmaps"],
    },
  };

  const panel = document.querySelector("#service-feature");
  const tabs = [...document.querySelectorAll(".service-tab")];
  const serviceSvg = `<svg viewBox="0 0 220 170" aria-hidden="true"><path d="M53 81c-17 0-29-12-29-27 0-14 11-26 26-27C57 10 73 0 91 0c19 0 35 13 39 31 19-2 35 12 35 30s-14 32-32 32H53" fill="#092b4c" stroke="#45c8ff" stroke-width="3"/><path d="M73 80V56h20v24m12 0V43h21v37m12 0V58h20v22M63 81h84" fill="none" stroke="#42c8ff" stroke-width="3"/><path d="M39 115l52-25 53 25-53 26z" fill="#14456c" stroke="#238bd0"/><path d="M39 115v33l52 20v-27z" fill="#0a2845" stroke="#238bd0"/><path d="M144 115v33l-53 20v-27z" fill="#06182d" stroke="#238bd0"/><circle cx="53" cy="128" r="3" fill="#34c9ff"/><circle cx="129" cy="128" r="3" fill="#34c9ff"/></svg>`;

  function renderService(key) {
    const item = serviceData[key] || serviceData.cloud;
    tabs.forEach((tab) => {
      const selected = tab.dataset.tab === key;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
      tab.tabIndex = selected ? 0 : -1;
    });
    panel.innerHTML = `<div class="service-art">${serviceSvg}<span class="service-art-label">${item.art.toUpperCase()}</span></div>
      <div class="service-copy"><span class="section-kicker">${item.label}</span><h3>${item.title}</h3><p>${item.description}</p><ul class="check-list">${item.items.map((text) => `<li>${text}</li>`).join("")}</ul><a class="text-link" href="${item.page}">${item.action} <span>→</span></a></div>
      <div class="tech-panel"><span>CAPABILITIES & PLATFORMS</span><div class="tech-logos">${item.logos.map((text, index) => `<b class="logo-${index}">${text}</b>`).join("")}</div></div>`;
    panel.setAttribute("aria-label", item.title);
  }
  renderService("cloud");

  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => renderService(tab.dataset.tab));
    tab.addEventListener("keydown", (event) => {
      if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key))
        return;
      event.preventDefault();
      const next =
        event.key === "Home"
          ? 0
          : event.key === "End"
            ? tabs.length - 1
            : (index + (event.key === "ArrowRight" ? 1 : tabs.length - 1)) %
              tabs.length;
      tabs[next].focus();
      renderService(tabs[next].dataset.tab);
    });
  });

  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
      "aria-label",
      open ? "Close navigation" : "Open navigation",
    );
    nav.classList.toggle("open", open);
  });
  nav.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      nav.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    }),
  );
  document
    .querySelector(".dropdown-trigger")
    .addEventListener("click", (event) => {
      const wrapper = event.currentTarget.closest(".nav-dropdown");
      const open = wrapper.classList.toggle("open");
      event.currentTarget.setAttribute("aria-expanded", String(open));
    });

  const themeButton = document.querySelector(".theme-toggle");
  const applyTheme = (theme) => {
    document.body.classList.toggle("light-theme", theme === "light");
    themeButton.querySelector(".theme-icon").textContent =
      theme === "light" ? "☀" : "☾";
    themeButton.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode",
    );
  };
  let savedTheme;
  try {
    savedTheme = localStorage.getItem("aroush-theme");
  } catch (_) {
    savedTheme = null;
  }
  applyTheme(savedTheme || "dark");
  themeButton.addEventListener("click", () => {
    const theme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";
    applyTheme(theme);
    try {
      localStorage.setItem("aroush-theme", theme);
    } catch (_) {
      /* Private browsing can block storage. */
    }
  });

  document
    .querySelector(".announcement-close")
    .addEventListener("click", () => {
      document.querySelector("#announcement").remove();
      try {
        sessionStorage.setItem("aroush-announcement-dismissed", "1");
      } catch (_) {
        /* Ignore unavailable storage. */
      }
    });
  try {
    if (sessionStorage.getItem("aroush-announcement-dismissed"))
      document.querySelector("#announcement").remove();
  } catch (_) {
    /* Ignore unavailable storage. */
  }

  document.querySelectorAll(".filter-button").forEach((button) =>
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".filter-button")
        .forEach((item) => item.classList.toggle("active", item === button));
      const category = button.dataset.filter;
      document.querySelectorAll(".case-card").forEach((card) => {
        card.hidden = category !== "all" && card.dataset.category !== category;
      });
    }),
  );

  const form = document.querySelector("#contact-form");
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const subject = `Website enquiry: ${data.get("challenge")}`;
    const body = [
      `Name: ${data.get("name")}`,
      `Email: ${data.get("email")}`,
      `Company: ${data.get("company") || "Not provided"}`,
      `Phone: ${data.get("phone") || "Not provided"}`,
      `Area of interest: ${data.get("challenge")}`,
      "",
      `Message: ${data.get("message") || "Not provided"}`,
    ].join("\n");
    const href = `mailto:taj@aroushtech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    document.querySelector(".form-status").textContent =
      "Your email app is opening with this enquiry. Please send the message there to complete submission.";
    window.location.href = href;
  });
})();
