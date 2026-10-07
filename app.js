(() => {
  const serviceData = {
    cloud: {
      label: "CLOUD COMPUTING",
      title: "AWS Cloud Training",
      description:
        "Build a scalable, secure, and future-ready infrastructure that supports where your business is going.",
      items: [
        "AWS Solutions Architect Associate",
        "Cloud infrastructure fundamentals",
        "Scalable cloud architecture",
        "Hands-on learning and practice",
      ],
      action: "Explore cloud courses",
      page: "courses.html",
      art: "Learn cloud computing",
      logos: ["AWS", "CLOUD", "ARCHITECTURE", "LABS"],
    },
    cybersecurity: {
      label: "CYBERSECURITY",
      title: "Cybersecurity Courses",
      description:
        "Reduce risk with practical security assessment, implementation, and monitoring shaped around your environment.",
      items: [
        "Certified Ethical Hacker (CEH)",
        "Penetration testing",
        "Linux security",
        "Firewall and network security",
      ],
      action: "Explore cybersecurity courses",
      page: "courses.html",
      art: "Practice cybersecurity",
      logos: ["CEH", "PENTEST", "LINUX", "FIREWALL"],
    },
    automation: {
      label: "AI & MACHINE LEARNING",
      title: "AI & Agentic AI Training",
      description:
        "Make delivery more reliable and free your team from repetitive work with thoughtfully designed automation.",
      items: [
        "AI and machine learning foundations",
        "LangChain and LangGraph",
        "Hugging Face workflows",
        "Build practical AI agents",
      ],
      action: "Explore AI courses",
      page: "courses.html",
      art: "Build with AI",
      logos: ["AI / ML", "LANGCHAIN", "LANGGRAPH", "HUGGING FACE"],
    },
    advisory: {
      label: "NETWORKING & DATA CENTER",
      title: "Networking & Data Center Courses",
      description:
        "Get independent guidance and responsive support to keep technology aligned with your business priorities.",
      items: [
        "CCNA and CCNP paths",
        "Enterprise networking",
        "Network security",
        "Data center technologies",
      ],
      action: "Explore networking courses",
      page: "courses.html",
      art: "Build network expertise",
      logos: ["CCNA", "CCNP", "SECURITY", "DATA CENTER"],
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
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('[type="submit"]');
    submit.disabled = true;
    status.textContent = "Sending your enquiry…";
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, interest: values.challenge || "Course enquiry" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your enquiry.");
      status.textContent = result.message;
      form.reset();
    } catch (error) {
      status.textContent = `${error.message} Please call +91 88676 92074 or email taj@aroushtech.in.`;
    } finally {
      submit.disabled = false;
    }
  });
})();
