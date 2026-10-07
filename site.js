// Small shared interactions used by the separate content pages.
const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-nav");

if (menuButton && navigation) {
  menuButton.addEventListener("click", () => {
    const isOpen = menuButton.getAttribute("aria-expanded") !== "true";
    menuButton.setAttribute("aria-expanded", String(isOpen));
    menuButton.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation",
    );
    navigation.classList.toggle("open", isOpen);
  });

  navigation.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navigation.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const themeButton = document.querySelector(".theme-toggle");
if (themeButton) {
  const setTheme = (theme) => {
    document.body.classList.toggle("light-theme", theme === "light");
    themeButton.querySelector(".theme-icon").textContent =
      theme === "light" ? "☀" : "☾";
    themeButton.setAttribute(
      "aria-label",
      theme === "light" ? "Switch to dark mode" : "Switch to light mode",
    );
  };

  let savedTheme = "dark";
  try {
    savedTheme = localStorage.getItem("aroush-theme") || "dark";
  } catch (error) {
    // The page still works if browser storage is unavailable.
  }

  setTheme(savedTheme);
  themeButton.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("light-theme")
      ? "dark"
      : "light";
    setTheme(nextTheme);
    try {
      localStorage.setItem("aroush-theme", nextTheme);
    } catch (error) {
      // Theme switching still works for this page view.
    }
  });
}

// Prefill the service selector when a visitor arrives from a service page.
const enquiryType = new URLSearchParams(window.location.search).get("interest");
if (enquiryType) {
  const challengeSelect = document.querySelector('[name="challenge"]');
  if (challengeSelect) challengeSelect.value = enquiryType;
}

document.querySelectorAll("[data-enquiry-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const values = new FormData(form);
    const subject = `Website enquiry: ${values.get("challenge")}`;
    const body = [
      `Name: ${values.get("name")}`,
      `Email: ${values.get("email")}`,
      `Company: ${values.get("company") || "Not provided"}`,
      `Phone: ${values.get("phone") || "Not provided"}`,
      `Area of interest: ${values.get("challenge")}`,
      "",
      `Message: ${values.get("message") || "Not provided"}`,
    ].join("\n");

    const status = form.querySelector(".form-status");
    status.textContent =
      "Your email app is opening with this request. Send the message there to complete submission.";
    window.location.href = `mailto:taj@aroushtech.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });
});

document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const email = new FormData(form).get("email");
    form.querySelector(".form-status").textContent =
      "Your email app is opening. Send the message there to complete your subscription request.";
    window.location.href = `mailto:taj@aroushtech.in?subject=${encodeURIComponent("Newsletter subscription request")}&body=${encodeURIComponent(`Please add ${email} to the Aroush updates list.`)}`;
  });
});
