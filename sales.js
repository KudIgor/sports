let sales = [];

async function loadSales() {
  try {
    const res = await fetch("data/sales.json");
    sales = await res.json();
    renderSales();
  } catch (err) {
    console.error("Помилка завантаження акцій", err);
  }
}

function renderSales() {
  const container = document.getElementById("sales-list");
  if (!container) return;

  container.innerHTML = "";

  sales.forEach(sale => {
    const card = document.createElement("div");
    card.className = "sale-card";

    card.innerHTML = `
      <img src="${sale.image}" alt="${sale.title}">
      <div class="sale-content">
        <span class="sale-badge">${sale.discount}</span>
        <h3>${sale.title}</h3>
        <p>${sale.description}</p>
      </div>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", loadSales);