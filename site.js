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

document.querySelectorAll(".dropdown-trigger").forEach((button) => {
  button.addEventListener("click", () => {
    const wrapper = button.closest(".nav-dropdown");
    const open = wrapper.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
});

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

const query = new URLSearchParams(window.location.search);
const enquiryType = query.get("interest");
const requestedCourse = query.get("course");
if (enquiryType) {
  const challengeSelect = document.querySelector('[name="challenge"]');
  if (challengeSelect) {
    const option = [...challengeSelect.options].find((item) => item.value === enquiryType || item.text === enquiryType);
    if (option) challengeSelect.value = option.value;
  }
}
if (requestedCourse) {
  const courseField = document.querySelector('[name="course"]');
  if (courseField) courseField.value = requestedCourse;
  const messageField = document.querySelector('[name="message"]');
  if (messageField && !messageField.value) messageField.value = `I would like to know more about ${requestedCourse}.`;
}

document.querySelectorAll("[data-enquiry-form], #contact-form").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const values = Object.fromEntries(new FormData(form).entries());
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    if (status) status.textContent = "Sending your enquiry…";
    try {
      const response = await fetch("/api/enquiries", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, interest: values.interest || values.challenge || "Course enquiry" }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to send your enquiry.");
      if (status) status.textContent = result.message;
      form.reset();
    } catch (error) {
      if (status) status.textContent = `${error.message} Please call +91 88676 92074 or email taj@aroushtech.in.`;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
});

document.querySelectorAll("[data-newsletter-form]").forEach((form) => {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const status = form.querySelector(".form-status");
    const submit = form.querySelector('[type="submit"]');
    if (submit) submit.disabled = true;
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST", headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: new FormData(form).get("email") }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Unable to subscribe.");
      if (status) status.textContent = result.message;
      form.reset();
    } catch (error) {
      if (status) status.textContent = `${error.message} Please email taj@aroushtech.in.`;
    } finally {
      if (submit) submit.disabled = false;
    }
  });
});
