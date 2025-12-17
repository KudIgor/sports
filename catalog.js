// ==============================
// КАТАЛОГ – ЗАВАНТАЖЕННЯ ТОВАРІВ
// ==============================

let allProducts = [];

// Завантаження товарів з JSON
async function loadProducts() {
  try {
    const response = await fetch("data/products.json");
    allProducts = await response.json();
    displayProducts(allProducts);
  } catch (error) {
    console.error("Помилка завантаження товарів:", error);
  }
}

// Відображення товарів
function displayProducts(products) {
  const container = document.getElementById("product-list");
  if (!container) return;

  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";

    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p class="price">${product.price} грн</p>
      <button class="add-to-cart" onclick="addToCart(${product.id})">
        У кошик
      </button>
    `;

    container.appendChild(card);
  });
}

// ==============================
// ФІЛЬТРИ
// ==============================

function applyFilters() {
  const search = document.getElementById("search-input").value.toLowerCase();
  const category = document.getElementById("category-filter").value;
  const price = document.getElementById("price-filter").value;

  let filtered = allProducts.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search);
    const matchCategory = category === "all" || p.category === category;

    let matchPrice = true;
    if (price !== "all") {
      const [min, max] = price.split("-");
      const minPrice = parseInt(min);
      const maxPrice = max === "1200+" ? Infinity : parseInt(max);
      matchPrice = p.price >= minPrice && p.price <= maxPrice;
    }

    return matchSearch && matchCategory && matchPrice;
  });

  displayProducts(filtered);
}

// Слухачі
document.addEventListener("DOMContentLoaded", () => {
  loadProducts();

  document.getElementById("search-input")
    ?.addEventListener("input", applyFilters);

  document.getElementById("category-filter")
    ?.addEventListener("change", applyFilters);

  document.getElementById("price-filter")
    ?.addEventListener("change", applyFilters);
});
