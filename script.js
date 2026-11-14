document.addEventListener("DOMContentLoaded", () => {
  const productSelect = document.getElementById("product-select");
  const form = document.getElementById("order-form");
  const status = document.getElementById("form-status");

  const appConfig = {
    supabaseUrl: (window.SUPABASE_URL || "").replace(/\/+$/, ""),
    supabaseKey: window.SUPABASE_KEY || "",
  };
  window.app = {
    config: appConfig,
    supabaseReady: Boolean(appConfig.supabaseUrl && appConfig.supabaseKey),
  };

  const WHATSAPP_NUMBER = "923001234567";
  const STORE_EMAIL = "hello@hockeyprostore.com";
  const FREE_DELIVERY_MIN = 10000;
  const DELIVERY_FEES = { standard: 250, express: 600 };
  const DELIVERY_LABELS = { standard: "Standard (3–5 working days)", express: "Express (1–2 working days)" };
  const PAYMENT_LABELS = { cod: "Cash on delivery", bank: "Bank transfer" };

  const PRICES = {
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

  const escapeHtml = (value) =>
    String(value == null ? "" : value).replace(/[&<>"']/g, (ch) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[ch]));

  const readOrder = () => {
    if (!form) return null;

    const data = new FormData(form);
    const value = (key) => (data.get(key) || "").toString().trim();

    const product = value("product");
    const parsedQty = Number.parseInt(value("quantity"), 10);
    const quantity = Math.max(1, Number.isNaN(parsedQty) ? 1 : parsedQty);
    const unit = PRICES[product] || 0;
    const delivery = value("delivery") === "express" ? "express" : "standard";
    const payment = value("payment") === "bank" ? "bank" : "cod";
    const subtotal = unit * quantity;
    const deliveryFee = unit ? (delivery === "express" ? DELIVERY_FEES.express : subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEES.standard) : 0;

    return {
      name: value("name"),
      phone: value("phone"),
      email: value("email"),
      city: value("city"),
      product,
      quantity,
      size: value("size"),
      address: value("address"),
      notes: value("notes"),
      delivery,
      payment,
      unit,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  };

  const makeReference = () => {
    const d = new Date();
    const stamp = [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("");
    const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `HP-${stamp}-${suffix}`;
  };

  const buildOrderMessage = (order) => {
    const lines = [
      `Hi HockeyPro Store! I would like to place this order.`,
      ``,
      `Order reference: ${order.reference}`,
      `Name: ${order.name}`,
      `Phone / WhatsApp: ${order.phone}`,
      order.email ? `Email: ${order.email}` : null,
      `City: ${order.city}`,
      `Delivery address: ${order.address}`,
      ``,
      `Product: ${order.product}`,
      order.size ? `Size / preference: ${order.size}` : null,
      `Quantity: ${order.quantity}`,
      `Unit price: ${money(order.unit)}`,
      `Delivery: ${DELIVERY_LABELS[order.delivery]} — ${order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}`,
      `Payment: ${PAYMENT_LABELS[order.payment]}`,
      `Total: ${money(order.total)}`,
      order.notes ? `` : null,
      order.notes ? `Notes: ${order.notes}` : null,
    ].filter((line) => line !== null);

    return lines.join("\n");
  };

  const saveOrder = async (order) => {
    if (!window.app.supabaseReady) return false;

    const payload = {
      reference: order.reference,
      name: order.name,
      phone: order.phone,
      email: order.email || null,
      city: order.city,
      address: order.address,
      product: order.product,
      quantity: order.quantity,
      size: order.size || null,
      notes: order.notes || null,
      delivery_method: order.delivery,
      delivery_fee: order.deliveryFee,
      payment_method: order.payment,
      unit_price: order.unit,
      total: order.total,
      status: "new",
    };

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);

    try {
      const response = await fetch(`${appConfig.supabaseUrl}/rest/v1/orders`, {
        method: "POST",
        headers: {
          apikey: appConfig.supabaseKey,
          Authorization: `Bearer ${appConfig.supabaseKey}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });
      return response.ok;
    } catch (error) {
      return false;
    } finally {
      clearTimeout(timer);
    }
  };

  const showOrderSuccess = (order, saved) => {
    if (!form) return;

    const message = buildOrderMessage(order);
    const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    const mailLink = `mailto:${STORE_EMAIL}?subject=${encodeURIComponent(`Order ${order.reference}`)}&body=${encodeURIComponent(message)}`;
    const firstName = order.name.split(/\s+/)[0] || "there";

    const detailRows = [
      ["Order reference", order.reference, true],
      ["Product", order.product],
      ["Quantity", String(order.quantity)],
      ["Delivery", `${DELIVERY_LABELS[order.delivery]} — ${order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)}`],
      ["Payment", PAYMENT_LABELS[order.payment]],
      ["Total", money(order.total), false, true],
    ]
      .map(([label, val, isRef, isTotal]) => `
        <div class="success-row${isTotal ? " success-row-total" : ""}">
          <dt>${escapeHtml(label)}</dt>
          <dd${isRef ? ' class="success-ref"' : ""}>${escapeHtml(val)}</dd>
        </div>`)
      .join("");

    const html = `
      <div class="order-success" role="status" aria-live="polite">
        <span class="success-icon" aria-hidden="true">✓</span>
        <p class="eyebrow">Order Request Ready</p>
        <h2>Thanks, ${escapeHtml(firstName)}!</h2>
        <p class="success-lead">
          ${saved
            ? "We have received your order request and will contact you shortly to confirm availability, delivery, and payment."
            : "One last step — send your order details to our team on WhatsApp so we can confirm everything with you."}
        </p>
        <dl class="success-details">${detailRows}</dl>
        <div class="success-actions">
          <a class="btn" href="${whatsappLink}" target="_blank" rel="noopener">Send Order on WhatsApp</a>
          <a class="btn btn-outline" href="${mailLink}">Email Instead</a>
        </div>
        <p class="summary-note">Keep your reference <strong>${escapeHtml(order.reference)}</strong> handy when you contact us.</p>
        <button type="button" class="success-reset" id="new-order">Place another order</button>
      </div>`;

    form.hidden = true;
    form.insertAdjacentHTML("afterend", html);
    const panel = form.nextElementSibling;

    if (!saved) {
      window.open(whatsappLink, "_blank", "noopener");
    }

    panel.scrollIntoView({ behavior: "smooth", block: "start" });

    document.getElementById("new-order").addEventListener("click", () => {
      panel.remove();
      form.hidden = false;
      form.reset();
      updateOrderSummary();
      form.querySelector('input[name="name"]')?.focus();
      form.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const setSubmitting = (isSubmitting) => {
    const submitBtn = document.getElementById("order-submit");
    if (!submitBtn) return;
    submitBtn.disabled = isSubmitting;
    submitBtn.textContent = isSubmitting ? "Sending…" : "Submit Order Request";
  };

  document.querySelectorAll("[data-product]").forEach((el) => {
    el.addEventListener("click", () => {
      const product = el.getAttribute("data-product");
      if (!product) return;

      if (productSelect) {
        productSelect.value = product;
        document.getElementById("order")?.scrollIntoView({ behavior: "smooth" });
        if (status) status.textContent = `Selected: ${product}`;
      } else {
        window.location.href = `order.html?product=${encodeURIComponent(product)}#order`;
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

  const summary = document.getElementById("order-summary");
  let updateOrderSummary = () => {};

  if (summary && form && productSelect) {
    const summaryProduct = document.getElementById("summary-product");
    const summaryUnit = document.getElementById("summary-unit");
    const summaryQty = document.getElementById("summary-qty");
    const summaryDelivery = document.getElementById("summary-delivery");
    const summaryTotal = document.getElementById("summary-total");
    const quantityInput = form.querySelector('input[name="quantity"]');
    const deliveryInputs = form.querySelectorAll('input[name="delivery"]');

    updateOrderSummary = () => {
      const order = readOrder();
      if (!order) return;

      summaryProduct.textContent = order.product || "Nothing selected yet";
      summaryUnit.textContent = order.unit ? money(order.unit) : "—";
      summaryQty.textContent = order.quantity;
      summaryDelivery.textContent = order.unit ? (order.deliveryFee === 0 ? "Free" : money(order.deliveryFee)) : "—";
      summaryTotal.textContent = order.unit ? money(order.total) : "Rs. 0";
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

  const params = new URLSearchParams(window.location.search);
  const preset = params.get("product");
  if (preset && productSelect) {
    const opt = Array.from(productSelect.options).find((o) => o.value === preset || o.text === preset);
    if (opt) {
      productSelect.value = opt.value;
      updateOrderSummary();
    }
  }

  if (form) {
    const phoneInput = form.querySelector('input[name="phone"]');
    phoneInput?.addEventListener("input", () => phoneInput.setCustomValidity(""));

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (phoneInput) {
        const digits = (phoneInput.value.match(/\d/g) || []).length;
        if (digits < 7) {
          phoneInput.setCustomValidity("Please enter a valid phone number with at least 7 digits.");
          phoneInput.reportValidity();
          return;
        }
        phoneInput.setCustomValidity("");
      }

      const order = readOrder();
      if (!order || !order.product) {
        if (status) status.textContent = "Please choose a product before submitting your order.";
        productSelect?.focus();
        return;
      }
      if (!order.unit) {
        if (status) status.textContent = "That product is not available right now. Please pick another item or message us.";
        return;
      }

      order.reference = makeReference();

      setSubmitting(true);
      if (status) status.textContent = "Sending your order request…";

      const saved = await saveOrder(order);

      setSubmitting(false);
      if (status) status.textContent = "";

      showOrderSuccess(order, saved);
    });
  }
});
