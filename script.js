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
      if (status && !document.getElementById("order-summary")) status.textContent = `Selected: ${opt.value}`;
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

  const summary = document.getElementById("order-summary");

  if (summary && form && productSelect) {
    const summaryProduct = document.getElementById("summary-product");
    const summaryUnit = document.getElementById("summary-unit");
    const summaryQty = document.getElementById("summary-qty");
    const summaryDelivery = document.getElementById("summary-delivery");
    const summaryTotal = document.getElementById("summary-total");
    const quantityInput = form.querySelector('input[name="quantity"]');
    const deliveryInputs = form.querySelectorAll('input[name="delivery"]');

    const prices = {
      "Pro Carbon Hockey Stick": 4999,
      "Elite Carbon Hockey Stick": 8999,
      "Junior Hockey Stick": 2800,
      "Match Hockey Balls (Pack of 6)": 1800,
      "Match Hockey Balls (Pack of 12)": 3300,
      "Player Protective Gear": 3200,
      "Goalkeeper Kit Set": 12500,
      "Goalkeeper Helmet & Gloves": 6750,
      "Hockey Turf Shoes": 5400,
      "Indoor Court Hockey Shoes": 6200,
      "Training Hockey Jersey": 1950,
      "Team Training Bibs (Set of 10)": 4200,
      "Hockey Kit Bag": 2750,
      "Pro Wheeled Kit Bag": 5900,
      "Pro Training Cones Set": 1200,
      "Agility Ladder & Marker Set": 2400,
      "Premium Stick Grip & Tape Kit": 950,
    };

    const money = (value) => `Rs. ${value.toLocaleString("en-US")}`;

    const updateOrderSummary = () => {
      const name = productSelect.value;
      const unit = prices[name] || 0;
      const parsedQty = quantityInput ? Number.parseInt(quantityInput.value, 10) : 1;
      const qty = Math.max(1, Number.isNaN(parsedQty) ? 1 : parsedQty);
      const selectedDelivery = form.querySelector('input[name="delivery"]:checked');
      const isExpress = selectedDelivery && selectedDelivery.value === "express";
      const subtotal = unit * qty;

      let deliveryFee = 0;
      if (unit) {
        deliveryFee = isExpress ? 600 : subtotal >= 10000 ? 0 : 250;
      }

      summaryProduct.textContent = name || "Nothing selected yet";
      summaryUnit.textContent = unit ? money(unit) : "—";
      summaryQty.textContent = qty;
      summaryDelivery.textContent = unit ? (deliveryFee === 0 ? "Free" : money(deliveryFee)) : "—";
      summaryTotal.textContent = unit ? money(subtotal + deliveryFee) : "Rs. 0";
    };

    productSelect.addEventListener("change", updateOrderSummary);
    if (quantityInput) {
      quantityInput.addEventListener("input", updateOrderSummary);
      quantityInput.addEventListener("change", updateOrderSummary);
    }
    deliveryInputs.forEach((input) => input.addEventListener("change", updateOrderSummary));
    form.addEventListener("reset", updateOrderSummary);
    updateOrderSummary();
  }
});
