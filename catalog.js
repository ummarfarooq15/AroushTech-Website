(() => {
  const grid = document.querySelector("#course-grid");
  if (!grid) return;
  const search = document.querySelector("#course-search");
  const sort = document.querySelector("#course-sort");
  const count = document.querySelector("#course-count");
  const empty = document.querySelector("#course-empty");
  const filters = [...document.querySelectorAll(".filter-chip")];
  const money = (value) => `₹${Number(value).toLocaleString("en-IN")}`;
  const escapeHTML = (value) => String(value ?? "").replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  let courses = [];
  let category = "All";

  function render() {
    const term = search.value.trim().toLowerCase();
    const rows = courses.filter((course) => (category === "All" || course.category === category) && `${course.name} ${course.category} ${course.description}`.toLowerCase().includes(term));
    if (sort.value === "price-low") rows.sort((a, b) => a.offerPrice - b.offerPrice);
    if (sort.value === "price-high") rows.sort((a, b) => b.offerPrice - a.offerPrice);
    if (sort.value === "name") rows.sort((a, b) => a.name.localeCompare(b.name));
    count.textContent = `${rows.length} ${rows.length === 1 ? "course" : "courses"} ${term || category !== "All" ? "found" : "available"}`;
    empty.hidden = rows.length > 0;
    grid.innerHTML = rows.map((course, index) => `<article class="course-card" style="--card-order:${index}"><div class="course-card-top"><span class="course-category">${escapeHTML(course.category)}</span><span class="course-card-number">${String(index + 1).padStart(2, "0")}</span></div><h3>${escapeHTML(course.name)}</h3><p>${escapeHTML(course.description)}</p><div class="course-price"><del>${money(course.listedPrice)}</del><strong>${money(course.offerPrice)}</strong><small>published offer price</small></div><a class="course-card-link" href="contact.html?interest=Course%20enquiry&amp;course=${encodeURIComponent(course.name)}">Ask about this course <span>↗</span></a></article>`).join("");
  }
  filters.forEach((button) => button.addEventListener("click", () => {
    category = button.dataset.category;
    filters.forEach((item) => item.classList.toggle("active", item === button));
    render();
  }));
  search.addEventListener("input", render);
  sort.addEventListener("change", render);
  document.querySelectorAll("[data-footer-category]").forEach((link) => link.addEventListener("click", () => {
    category = link.dataset.footerCategory;
    const button = filters.find((item) => item.dataset.category === category);
    filters.forEach((item) => item.classList.toggle("active", item === button));
    render();
  }));
  fetch("/api/courses").then((response) => {
    if (!response.ok) throw new Error("Catalog is unavailable.");
    return response.json();
  }).then((data) => {
    courses = data;
    render();
  }).catch(() => {
    count.textContent = "The course catalog is temporarily unavailable. Please contact us for current programs.";
    grid.innerHTML = "";
  });
})();
