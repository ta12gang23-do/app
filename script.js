document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const form = document.getElementById("order-form");
  const status = document.getElementById("form-status");

  const appConfig = {
    supabaseUrl: window.SUPABASE_URL || "",
    supabaseKey: window.SUPABASE_KEY || "",
  };
  window.app = {
    config: appConfig,
    supabaseReady: Boolean(appConfig.supabaseUrl && appConfig.supabaseKey),
  };

  const params = new URLSearchParams(window.location.search);
  const preset = params.get("product");
  if (preset && productSelect) {
    const opt = Array.from(productSelect.options).find((o) => o.value === preset || o.text === preset);
    if (opt) {
      productSelect.value = opt.value;
      if (status) status.textContent = `Selected: ${opt.value}`;
    }
  }

  document.querySelectorAll("[data-product]").forEach((el) => {
    el.addEventListener("click", () => {
      const product = el.getAttribute("data-product");
      if (productSelect && product) {
        productSelect.value = product;
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
        status.textContent = `Selected: ${product}`;
      }
    });
  });

  const filterChips = document.querySelectorAll("[data-filter]");
  const productCards = Array.from(document.querySelectorAll("[data-category]"));
  const productCount = document.getElementById("product-count");

  if (filterChips.length && productCards.length) {
    filterChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        filterChips.forEach((c) => c.classList.remove("is-active"));
        chip.classList.add("is-active");

        const filter = chip.getAttribute("data-filter");
        let visible = 0;

        productCards.forEach((card) => {
          const show = filter === "all" || card.getAttribute("data-category") === filter;
          card.classList.toggle("is-hidden", !show);
          if (show) visible += 1;
        });

        if (productCount) {
          productCount.textContent = `${visible} product${visible === 1 ? "" : "s"}`;
        }
      });
    });
  }

  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const product = (data.get("product") || "").toString().trim();
    const qty = (data.get("quantity") || "1").toString().trim();
    status.textContent = `Thank you, ${name || "customer"}! Your order request for ${qty} x ${product} has been received. We will contact you soon.`;
    form.reset();
  });
});
