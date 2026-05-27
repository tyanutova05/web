let products = [
  { id: "PRD-1001", name: "Sac de Jour Nano", brand: "Saint Laurent", category: "Сумки", price: 2850, condition: "Excellent", size: "OS", badge: "Редкий лот", image: "./assets/Sac%20de%20Jour%20Nano1.webp", gallery: ["./assets/Sac%20de%20Jour%20Nano1.webp", "./assets/Sac%20de%20Jour%20Nano2.webp", "./assets/Sac%20de%20Jour%20Nano3.webp", "./assets/Sac%20de%20Jour%20Nano4.webp"] },
  { id: "PRD-1002", name: "Spazzolato Leather Pump", brand: "Prada", category: "Обувь", price: 850, condition: "Pristine", size: "38", badge: "Новинка", image: "./assets/Prada%20%20Spazzolato%20Leather%20Pump1.webp", gallery: ["./assets/Prada%20%20Spazzolato%20Leather%20Pump1.webp", "./assets/Prada%20%20Spazzolato%20Leather%20Pump2.webp", "./assets/Prada%20%20Spazzolato%20Leather%20Pump3.webp"] },
  { id: "PRD-1003", name: "Small Puzzle Bag", brand: "Loewe", category: "Сумки", price: 1900, condition: "Excellent", size: "OS", badge: "Кураторский выбор", image: "./assets/Loewe%20%20Small%20Puzzle%20Bag1.webp", gallery: ["./assets/Loewe%20%20Small%20Puzzle%20Bag1.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag2.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag3.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag4.webp", "./assets/Loewe%20%20Small%20Puzzle%20Bag5.webp"] },
  { id: "PRD-1004", name: "Oversized Square Acetate", brand: "Gucci", category: "Аксессуары", price: 340, condition: "Very Good", size: "OS", badge: "Архив", image: "./assets/Gucci%20%20Oversized%20Square%20Acetate%201.webp", gallery: ["./assets/Gucci%20%20Oversized%20Square%20Acetate%201.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%202.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%203.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%204.webp", "./assets/Gucci%20%20Oversized%20Square%20Acetate%205.webp"] },
  { id: "PRD-1005", name: "Galleria Saffiano", brand: "Prada", category: "Сумки", price: 2400, condition: "Excellent", size: "OS", badge: "Редкий лот", image: "./assets/Prada%20%20Galleria%20Saffiano1.webp", gallery: ["./assets/Prada%20%20Galleria%20Saffiano1.webp", "./assets/Prada%20%20Galleria%20Saffiano2.webp", "./assets/Prada%20%20Galleria%20Saffiano3.webp", "./assets/Prada%20%20Galleria%20Saffiano4.webp"] },
  { id: "PRD-1006", name: "Triomphe Wallet", brand: "Celine", category: "Аксессуары", price: 790, condition: "Pristine", size: "OS", badge: "Хит", image: "./assets/Celine%20%20Triomphe%20Wallet1.webp", gallery: ["./assets/Celine%20%20Triomphe%20Wallet1.webp", "./assets/Celine%20%20Triomphe%20Wallet2.webp", "./assets/Celine%20%20Triomphe%20Wallet3.webp", "./assets/Celine%20%20Triomphe%20Wallet4.webp", "./assets/Celine%20%20Triomphe%20Wallet5.webp"] }
];

let orders = [
  { id: "EC-89231", client: "Elena Holland", date: "Nov 14, 2024", amount: 2450, status: "Shipped", delivery: "DHL Express / Nov 18, 2024" },
  { id: "EC-87114", client: "Marcus Chen", date: "Oct 22, 2024", amount: 5100, status: "Delivered", delivery: "Delivered / Verified" },
  { id: "EC-86002", client: "Sofia Al-Fayed", date: "Sept 12, 2024", amount: 650, status: "Delivered", delivery: "Delivered / Invoice sent" },
  { id: "EC-99388", client: "Julian Rossi", date: "Oct 23, 2024", amount: 12800, status: "Processing", delivery: "Packing in atelier" }
];

const state = {
  currentView: "home",
  activeProduct: products[0].id,
  activeGalleryIndex: 0,
  cart: [{ productId: "PRD-1001", qty: 1 }, { productId: "PRD-1003", qty: 1 }],
  adminTab: "dashboard",
  lastClientView: "home",
  catalogPreset: "all"
};

const DROP_TARGET = new Date("2026-06-15T12:00:00+03:00");

const viewIds = ["home", "catalog", "brands", "contacts", "about", "product", "cart", "checkout", "orders", "profile", "admin"];
const appConfig = window.APP_CONFIG || {};

function money(value) {
  const amount = Math.round(Number(value) || 0);
  return `${new Intl.NumberFormat("ru-RU").format(amount)}₽`;
}

function applyTheme(view) {
  document.body.classList.remove("view-home", "view-light", "view-admin");
  if (view === "home") document.body.classList.add("view-home");
  else if (view === "admin") document.body.classList.add("view-admin");
  else document.body.classList.add("view-light");
}

function setView(view) {
  state.currentView = view;
  if (view !== "admin") state.lastClientView = view;
  viewIds.forEach((id) => document.getElementById(`${id}View`).classList.toggle("active", id === view));
  document.querySelectorAll(".view").forEach((el) => el.classList.remove("view-leave"));
  document.querySelectorAll(".nav-link").forEach((el) => {
    const linkView = el.dataset.view;
    const preset = el.dataset.catalogPreset;
    let active = linkView === view;
    if (view === "catalog") {
      active = preset ? state.catalogPreset === preset : state.catalogPreset === "all" && linkView === "catalog";
    }
    if (view === "product" && linkView === "catalog") active = true;
    el.classList.toggle("active", active);
  });
  setModeSwitch(view === "admin" ? "admin" : "client");
  applyTheme(view);
  document.querySelector(".header-app-grid")?.classList.remove("mobile-open");
  document.getElementById("primaryNavHome")?.classList.remove("open");
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (view === "catalog") renderCatalog();
  if (view === "brands") renderBrands();
  if (view === "product") renderProductDetail();
  if (view === "cart") renderCart();
  if (view === "checkout") renderCheckout();
  if (view === "orders") renderOrders();
  if (view === "admin") renderAdmin();
}

function transitionTo(view) {
  const current = document.querySelector(".view.active");
  if (!current) return setView(view);
  if (state.currentView === view) return;
  current.classList.add("view-leave");
  window.setTimeout(() => {
    current.classList.remove("view-leave");
    setView(view);
  }, 220);
}

function renderProductCard(product, compact = false) {
  return `
    <article class="product-card">
      <button class="image-button js-open-product" data-product="${product.id}" aria-label="Открыть товар ${product.name}">
        <div class="product-thumb-wrap">
          <img class="product-thumb" src="${product.image}" alt="${product.name}" loading="lazy">
        </div>
      </button>
      <h3>
        <button class="title-button js-open-product" data-product="${product.id}">${product.name}</button>
      </h3>
      <p class="price">${money(product.price)}</p>
      ${compact ? "" : `
        <span class="pill">${product.badge}</span>
        <div class="hero-actions">
          <button class="btn btn-primary js-add-to-cart" data-product="${product.id}">В корзину</button>
        </div>
      `}
    </article>
  `;
}

function bindProductActions(root = document) {
  root.querySelectorAll(".js-open-product").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeProduct = btn.dataset.product;
      state.activeGalleryIndex = 0;
      setView("product");
    });
  });
  root.querySelectorAll(".js-add-to-cart").forEach((btn) => {
    btn.addEventListener("click", () => addToCart(btn.dataset.product));
  });
}

function addToCart(productId) {
  const existing = state.cart.find((item) => item.productId === productId);
  if (existing) existing.qty += 1;
  else state.cart.push({ productId, qty: 1 });
  updateCartCount();
  animateCartFeedback();
}

function updateCartCount() {
  const total = state.cart.reduce((sum, item) => sum + item.qty, 0);
  const value = String(total);
  document.getElementById("cartCount").textContent = value;
  const homeBadge = document.getElementById("cartCountHome");
  if (homeBadge) homeBadge.textContent = value;
}

function animateCartFeedback() {
  const badge = document.getElementById("cartCount");
  const homeBadge = document.getElementById("cartCountHome");
  const cartButton = document.getElementById("cartButton");
  const cartButtonHome = document.getElementById("cartButtonHome");
  const cartToast = document.getElementById("cartToast");
  [badge, homeBadge].forEach((el) => {
    if (!el) return;
    el.classList.remove("bump");
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add("bump");
  });
  [cartButton, cartButtonHome].forEach((btn) => {
    if (!btn) return;
    btn.classList.remove("cart-pulse");
    btn.classList.add("cart-pulse");
  });
  if (cartToast) {
    cartToast.classList.remove("show");
    // eslint-disable-next-line no-unused-expressions
    cartToast.offsetWidth;
    cartToast.classList.add("show");
  }
}

function setModeSwitch(mode) {
  const isAdmin = mode === "admin";
  const clientBtn = document.getElementById("clientModeBtn");
  const adminBtn = document.getElementById("adminModeBtn");
  clientBtn.classList.toggle("active", !isAdmin);
  adminBtn.classList.toggle("active", isAdmin);
  clientBtn.setAttribute("aria-selected", String(!isAdmin));
  adminBtn.setAttribute("aria-selected", String(isAdmin));
}

function renderHome() {
  // Home layout is static (Stitch split hero); no featured grid on landing.
}

function renderCatalog() {
  const brand = document.getElementById("brandFilter").value;
  const condition = document.getElementById("conditionFilter").value;
  const sort = document.getElementById("sortFilter").value;
  let filtered = products.filter((p) => {
    const brandOk = brand === "all" || p.brand === brand;
    const conditionOk = condition === "all" || p.condition === condition;
    const categoryOk = state.catalogPreset === "all"
      || (state.catalogPreset === "bags" && getCategory(p) === "Сумки")
      || (state.catalogPreset === "accessories" && getCategory(p) === "Аксессуары");
    return brandOk && conditionOk && categoryOk;
  });
  if (sort === "priceAsc") filtered = filtered.sort((a, b) => a.price - b.price);
  if (sort === "priceDesc") filtered = filtered.sort((a, b) => b.price - a.price);
  const grid = document.getElementById("catalogGrid");
  grid.innerHTML = filtered.map((p) => renderProductCard(p)).join("");
  bindProductActions(grid);
}

function getCategory(product) {
  if (product.category) return product.category;
  const lowered = `${product.name} ${product.badge}`.toLowerCase();
  if (lowered.includes("wallet")) return "Кошельки";
  if (lowered.includes("pump") || lowered.includes("heel")) return "Обувь";
  if (lowered.includes("acetate") || lowered.includes("glasses")) return "Аксессуары";
  return "Сумки";
}

function renderBrands() {
  const root = document.getElementById("brandsCategories");
  if (!root) return;
  const grouped = products.reduce((acc, product) => {
    const category = getCategory(product);
    if (!acc[category]) acc[category] = [];
    acc[category].push(product);
    return acc;
  }, {});

  root.innerHTML = Object.entries(grouped).map(([category, items]) => `
    <section class="brands-group">
      <h2>${category}</h2>
      <div class="product-grid">
        ${items.map((item) => renderProductCard(item, true)).join("")}
      </div>
    </section>
  `).join("");
  bindProductActions(root);
}

function renderProductDetail() {
  const p = products.find((item) => item.id === state.activeProduct) ?? products[0];
  const relatedProducts = products.filter((item) => item.id !== p.id).slice(0, 3);
  const mainImage = p.gallery[state.activeGalleryIndex] ?? p.gallery[0];
  const root = document.getElementById("productDetail");
  root.innerHTML = `
    <div class="gallery">
      <div class="zoom-frame">
        <img class="gallery-main" id="galleryMainImage" src="${mainImage}" alt="${p.name}">
      </div>
      <div class="mini-grid">${p.gallery.map((src, index) => `
        <button class="thumb-button ${index === state.activeGalleryIndex ? "active" : ""}" data-image-index="${index}" aria-label="Показать фото ${index + 1}">
          <img src="${src}" alt="${p.name} фото ${index + 1}">
        </button>
      `).join("")}</div>
    </div>
    <article class="details">
      <p class="eyebrow">${p.brand}</p>
      <h1 id="productTitle">${p.name.toUpperCase()}</h1>
      <p class="price">${money(p.price)}</p>
      <div class="product-specs">
        <p><strong>Бренд:</strong> ${p.brand}</p>
        <p><strong>Размер:</strong> ${p.size}</p>
        <p><strong>Материал:</strong> кожа</p>
        <p><strong>Состояние:</strong> ${p.condition}</p>
      </div>
      <div class="condition-slider" aria-hidden="true"></div>
      <p class="muted">Каждый лот проходит аутентификацию и проверку состояния перед публикацией в архиве IS_NULL.</p>
      <div class="hero-actions">
        <button class="btn btn-primary js-add-to-cart" data-product="${p.id}">В корзину</button>
        <button class="btn btn-secondary" data-view="catalog">Назад</button>
      </div>
    </article>
    <section class="product-related section">
      <h2 class="page-title" style="font-size:16px;margin:2rem 0 1rem">Похожие товары</h2>
      <div class="product-grid">
        ${relatedProducts.map((item) => renderProductCard(item, true)).join("")}
      </div>
    </section>
  `;
  root.classList.add("product-detail");
  bindProductActions(root);
  root.querySelectorAll(".thumb-button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const imageIndex = Number(btn.dataset.imageIndex);
      state.activeGalleryIndex = imageIndex;
      const nextSrc = p.gallery[imageIndex];
      const main = root.querySelector("#galleryMainImage");
      if (main && nextSrc) main.src = nextSrc;
      root.querySelectorAll(".thumb-button").forEach((item) => item.classList.remove("active"));
      btn.classList.add("active");
    });
  });
  root.querySelectorAll("[data-view]").forEach((el) => el.addEventListener("click", () => setView(el.dataset.view)));
}

function renderCart() {
  const cartItems = document.getElementById("cartItems");
  const items = state.cart
    .map((line) => ({ ...line, product: products.find((p) => p.id === line.productId) }))
    .filter((item) => item.product);

  if (!items.length) {
    cartItems.innerHTML = `<p class="muted">Корзина пуста.</p>`;
    const summary = document.getElementById("checkoutSummary");
    if (summary) summary.innerHTML = "";
    return;
  }

  cartItems.innerHTML = items.map((item) => `
    <div class="cart-row cart-item-row" role="row">
      <img class="cart-thumb-lg" src="${item.product.image}" alt="${item.product.name}">
      <div>
        <div class="cart-title">${item.product.name}</div>
        <div class="cart-sub">${item.product.brand}</div>
      </div>
      <div>${money(item.product.price * item.qty)}</div>
      <div>${item.qty} шт</div>
      <button class="cart-close js-remove" type="button" data-id="${item.product.id}" aria-label="Удалить">×</button>
    </div>
  `).join("");

  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.qty, 0);
  const delivery = 1000;
  const promo = (document.getElementById("promoInput")?.value || "").trim().toUpperCase();
  let discount = 0;
  if (promo === "ISNULL" || promo === "IS_NULL") {
    discount = Math.min(Math.round(subtotal * 0.1), 20000);
  }
  const total = Math.max(0, subtotal + delivery - discount);
  const summary = document.getElementById("checkoutSummary");
  if (summary) {
    summary.innerHTML = `
      <div><dt>Итого:</dt><dd>${money(total)}</dd></div>
      <div><dt>Товаров на:</dt><dd>${money(subtotal)}</dd></div>
      <div><dt>Доставка:</dt><dd>${money(delivery)}</dd></div>
      <div><dt>Скидка:</dt><dd style="color:#a10000">${money(discount)}</dd></div>
    `;
  }

  cartItems.querySelectorAll(".js-remove").forEach((btn) => btn.addEventListener("click", () => {
    state.cart = state.cart.filter((item) => item.productId !== btn.dataset.id);
    updateCartCount();
    renderCart();
  }));
}

function renderCheckout() {
  // Reuse the same summary block used in the checkout page.
  renderCart();
}

function renderOrders() {
  const root = document.getElementById("ordersList");
  root.innerHTML = orders.map((o) => `
    <article class="order-card">
      <h3>${o.id} — ${o.client}</h3>
      <p>${o.date} • ${money(o.amount)}</p>
      <p>Статус: <span class="status ${o.status}">${statusLabel(o.status)}</span></p>
      <p class="muted">${o.delivery}</p>
    </article>
  `).join("");
}

function renderAdmin() {
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.classList.toggle("active", tab.dataset.admin === state.adminTab));
  document.querySelectorAll(".admin-panel").forEach((panel) => panel.classList.remove("active"));
  document.getElementById(`admin${state.adminTab[0].toUpperCase()}${state.adminTab.slice(1)}`).classList.add("active");

  document.getElementById("kpiGrid").innerHTML = `
    <article class="card kpi"><p class="muted">Общий доход</p><h3>$428,900</h3><p>+12.4%</p></article>
    <article class="card kpi"><p class="muted">Объем продаж</p><h3>1,842</h3><p>+5.2%</p></article>
    <article class="card kpi"><p class="muted">Конверсия</p><h3>3.82%</h3><p>-0.4%</p></article>
    <article class="card kpi"><p class="muted">Живые аукционы</p><h3>156</h3><p>+12</p></article>
  `;
  document.getElementById("brandLeaders").innerHTML = `
    <li>Louis Vuitton — продано 242</li><li>Chanel — продано 184</li><li>Hermes — продано 92</li><li>Prada — продано 128</li>
  `;
  document.getElementById("productsTableBody").innerHTML = products.map((p) => `
    <tr><td>${p.id}</td><td>${p.name}</td><td>${p.brand}</td><td>${p.size}</td><td>${money(p.price)}</td><td>${p.condition}</td></tr>
  `).join("");

  const statusFilter = document.getElementById("adminStatusFilter").value;
  const rows = orders.filter((o) => statusFilter === "all" || o.status === statusFilter);
  document.getElementById("adminOrdersBody").innerHTML = rows.map((o) => `
    <tr><td>${o.id}</td><td>${o.client}</td><td>${o.date}</td><td>${money(o.amount)}</td><td>${statusLabel(o.status)}</td><td>${o.delivery}</td></tr>
  `).join("");
}

function statusLabel(status) {
  if (status === "Processing") return "В обработке";
  if (status === "Shipped") return "Отправлен";
  if (status === "Delivered") return "Доставлен";
  return status;
}

function formatCountdown(msLeft) {
  const total = Math.max(0, msLeft);
  const days = Math.floor(total / 86400000);
  const hours = Math.floor((total % 86400000) / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(days)}:${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

function updateDropTicker() {
  const text = `${formatCountdown(DROP_TARGET - Date.now())} · NEW DROP COUNTDOWN · 150+ VINTAGE DESIGNER BAGS DROPPING ·`;
  document.querySelectorAll("[data-ticker-slot]").forEach((el) => {
    el.textContent = text;
  });
}

function startDropTicker() {
  updateDropTicker();
  window.setInterval(updateDropTicker, 1000);
}

async function loadRuntimeConfig() {
  try {
    const res = await fetch("/api/config");
    if (!res.ok) return;
    const remote = await res.json();
    if (remote.supabaseUrl) appConfig.supabaseUrl = remote.supabaseUrl;
    if (remote.supabaseAnonKey) appConfig.supabaseAnonKey = remote.supabaseAnonKey;
  } catch (_error) {
    // Static config.js fallback.
  }
}

async function checkDatabaseConnections() {
  const status = { postgres: false, supabase: false, source: "demo" };

  try {
    const health = await fetch("/api/health");
    if (health.ok) {
      const body = await health.json();
      status.postgres = Boolean(body.ok);
    }
  } catch (_error) {
    status.postgres = false;
  }

  if (appConfig.supabaseUrl && appConfig.supabaseAnonKey) {
    try {
      const url = new URL(`${appConfig.supabaseUrl}/rest/v1/products`);
      url.searchParams.set("select", "id");
      url.searchParams.set("limit", "1");
      const res = await fetch(url, {
        headers: {
          apikey: appConfig.supabaseAnonKey,
          Authorization: `Bearer ${appConfig.supabaseAnonKey}`
        }
      });
      status.supabase = res.ok;
    } catch (_error) {
      status.supabase = false;
    }
  }

  if (status.supabase) status.source = "supabase";
  else if (status.postgres) status.source = "postgres";

  window.__DB_STATUS__ = status;
  return status;
}

function init() {
  startDropTicker();
  loadRuntimeConfig()
    .then(() => checkDatabaseConnections())
    .then(() => loadRemoteData())
    .finally(() => {
      hydrateUi();
    });
}

async function loadRemoteData() {
  const loadedFromSupabase = await loadFromSupabase();
  if (loadedFromSupabase) return;

  try {
    const [productsRes, ordersRes] = await Promise.all([
      fetch("/api/products"),
      fetch("/api/orders?userEmail=elena@holand.studio")
    ]);
    if (productsRes.ok) {
      const remoteProducts = await productsRes.json();
      if (Array.isArray(remoteProducts) && remoteProducts.length) products = remoteProducts;
    }
    if (ordersRes.ok) {
      const remoteOrders = await ordersRes.json();
      if (Array.isArray(remoteOrders)) orders = remoteOrders;
    }
  } catch (_error) {
    // Fallback to local demo data when API/DB is unavailable.
  }
}

async function loadFromSupabase() {
  const supabaseUrl = appConfig.supabaseUrl;
  const supabaseAnonKey = appConfig.supabaseAnonKey;
  if (!supabaseUrl || !supabaseAnonKey) return false;

  const headers = {
    apikey: supabaseAnonKey,
    Authorization: `Bearer ${supabaseAnonKey}`
  };

  try {
    const productsUrl = new URL(`${supabaseUrl}/rest/v1/products`);
    productsUrl.searchParams.set("select", "sku,name,category,condition,size_label,price_usd,brands(name),product_images(image_url,sort_order)");
    productsUrl.searchParams.set("is_active", "eq.true");
    productsUrl.searchParams.set("order", "id.asc");
    productsUrl.searchParams.set("product_images.order", "sort_order.asc");

    const ordersUrl = new URL(`${supabaseUrl}/rest/v1/orders`);
    ordersUrl.searchParams.set("select", "order_number,total_usd,status,created_at,users(full_name),delivery_tracking(carrier,current_status)");
    ordersUrl.searchParams.set("order", "created_at.desc");

    const [productsRes, ordersRes] = await Promise.all([
      fetch(productsUrl.toString(), { headers }),
      fetch(ordersUrl.toString(), { headers })
    ]);
    if (!productsRes.ok || !ordersRes.ok) return false;

    const [productsRaw, ordersRaw] = await Promise.all([productsRes.json(), ordersRes.json()]);
    if (Array.isArray(productsRaw) && productsRaw.length) {
      products = productsRaw.map((item) => {
        const gallery = (item.product_images || []).map((img) => img.image_url).filter(Boolean);
        return {
          id: item.sku,
          name: item.name,
          brand: item.brands?.name || "Unknown",
          category: item.category,
          condition: item.condition,
          size: item.size_label,
          price: Number(item.price_usd || 0),
          badge: "Кураторский выбор",
          image: gallery[0] || "",
          gallery
        };
      });
      state.activeProduct = products[0]?.id || state.activeProduct;
    }

    if (Array.isArray(ordersRaw)) {
      orders = ordersRaw.map((item) => ({
        id: item.order_number,
        client: item.users?.full_name || "Клиент",
        date: new Date(item.created_at).toLocaleDateString("ru-RU"),
        amount: Number(item.total_usd || 0),
        status: item.status,
        delivery: item.delivery_tracking
          ? `${item.delivery_tracking.carrier || "Carrier"} / ${item.delivery_tracking.current_status || "In Transit"}`
          : "Без трекинга"
      }));
    }

    return true;
  } catch (_error) {
    return false;
  }
}

function hydrateUi() {
  const brandSelect = document.getElementById("brandFilter");
  brandSelect.innerHTML = `<option value="all">Все бренды</option>`;
  [...new Set(products.map((p) => p.brand))].forEach((brand) => {
    const option = document.createElement("option");
    option.value = brand;
    option.textContent = brand;
    brandSelect.append(option);
  });

  document.querySelectorAll("[data-view]").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.catalogPreset) state.catalogPreset = el.dataset.catalogPreset;
      else if (el.dataset.view === "catalog") state.catalogPreset = "all";
      setView(el.dataset.view);
    });
  });
  const homeHero = document.querySelector(".hero-full");
  if (homeHero) {
    homeHero.addEventListener("click", () => transitionTo("catalog"));
    homeHero.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        transitionTo("catalog");
      }
    });
  }
  document.querySelectorAll(".mode-switch-btn").forEach((el) => {
    el.addEventListener("click", () => {
      if (el.dataset.mode === "admin") setView("admin");
      else setView(state.lastClientView === "admin" ? "home" : state.lastClientView);
    });
  });
  document.getElementById("catalogFilters").addEventListener("input", renderCatalog);
  document.getElementById("checkoutForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const button = document.querySelector("#checkoutForm .checkout-save");
    if (!button) return;
    button.disabled = true;
    button.textContent = "Сохранено";
  });
  document.getElementById("placeOrderBtn")?.addEventListener("click", () => {
    state.cart = [];
    updateCartCount();
    setView("orders");
  });

  document.getElementById("applyPromoBtn")?.addEventListener("click", () => {
    renderCart();
  });
  document.querySelectorAll(".admin-tab").forEach((tab) => tab.addEventListener("click", () => {
    state.adminTab = tab.dataset.admin;
    renderAdmin();
  }));
  document.getElementById("adminStatusFilter").addEventListener("change", renderAdmin);

  document.getElementById("profileForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const button = event.target.querySelector(".account-save");
    if (!button) return;
    button.disabled = true;
    button.textContent = "Сохранено";
  });

  const bindMobileMenu = (buttonId, navId) => {
    const button = document.getElementById(buttonId);
    const nav = document.getElementById(navId);
    if (!button || !nav) return;
    button.addEventListener("click", () => {
      const next = !nav.classList.contains("open");
      nav.classList.toggle("open", next);
      button.setAttribute("aria-expanded", String(next));
    });
  };

  bindMobileMenu("mobileMenuButtonHome", "primaryNavHome");

  const mobileMenuButton = document.getElementById("mobileMenuButton");
  const headerAppGrid = document.querySelector(".header-app-grid");
  if (mobileMenuButton && headerAppGrid) {
    mobileMenuButton.addEventListener("click", () => {
      const next = !headerAppGrid.classList.contains("mobile-open");
      headerAppGrid.classList.toggle("mobile-open", next);
      mobileMenuButton.setAttribute("aria-expanded", String(next));
    });
  }

  applyTheme(state.currentView);
  renderHome();
  renderCatalog();
  renderBrands();
  renderOrders();
  updateCartCount();
}

init();
