// ==========================
// ГЛОБАЛЬНИЙ КОШИК
// ==========================
let cart = [];

// ==========================
// КНОПКИ ДО КОШИКА
// ==========================
const cartBtn = document.getElementById('cart-btn');
const cartModal = document.getElementById('cart-modal');
const closeCart = document.getElementById('close-cart');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');

const checkoutBtn = document.getElementById('checkout-btn');
const checkoutModal = document.getElementById('checkout-modal');
const closeCheckout = document.getElementById('close-checkout');
const confirmOrder = document.getElementById('confirm-order');

function updateCartCount() {
  const count = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartCount = document.getElementById('cart-count');
  if(cartCount) cartCount.innerText = count;
}

function renderCart(containerId = 'cart-items', totalId = 'cart-total') {
  const container = document.getElementById(containerId);
  const totalContainer = document.getElementById(totalId);
  if (!container || !totalContainer) return;

  container.innerHTML = '';
  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerHTML = `
      <p>${item.name} - ${item.price} грн x ${item.quantity}</p>
      <button onclick="removeFromCart(${index})">Видалити</button>
    `;
    container.appendChild(div);
  });
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  totalContainer.innerText = total;
}

function addToCart(name, price) {
  const existing = cart.find(i => i.name === name);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }
  updateCartCount();
  renderCart();
  showToast(`${name} додано у кошик!`);
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCartCount();
  renderCart();
}

// ==========================
// ВІДКРИТТЯ/ЗАКРИТТЯ МОДАЛЬНИХ ВІКОН
// ==========================
if (cartBtn && cartModal && closeCart) {
  cartBtn.addEventListener('click', () => cartModal.classList.add('show'));
  closeCart.addEventListener('click', () => cartModal.classList.remove('show'));
}

if (checkoutBtn && checkoutModal && closeCheckout && confirmOrder) {
  checkoutBtn.addEventListener('click', () => {
    cartModal.classList.remove('show');
    checkoutModal.classList.add('show');
  });

  closeCheckout.addEventListener('click', () => checkoutModal.classList.remove('show'));

  confirmOrder.addEventListener('click', () => {
    const name = document.getElementById('order-name').value;
    const phone = document.getElementById('order-phone').value;
    const email = document.getElementById('order-email').value;
    const address = document.getElementById('order-address').value;

    if (!name || !phone || !email || !address) {
      alert('Будь ласка, заповніть всі поля');
      return;
    }

    showToast('Ваше замовлення прийнято!');
    cart = [];
    updateCartCount();
    renderCart();
    checkoutModal.classList.remove('show');

    // Очистка полів
    document.getElementById('order-name').value = '';
    document.getElementById('order-phone').value = '';
    document.getElementById('order-email').value = '';
    document.getElementById('order-address').value = '';
  });
}

// ==========================
// TOAST ПОВІДОМЛЕННЯ
// ==========================
function showToast(message) {
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 100);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ==========================
// ФІЛЬТРИ ТА ПОШУК
// ==========================
const searchInput = document.getElementById('search-input');
const categoryFilter = document.getElementById('category-filter');
const priceFilter = document.getElementById('price-filter');
const catalogList = document.getElementById('catalog-list');

function filterProducts() {
  const searchText = searchInput ? searchInput.value.toLowerCase() : '';
  const category = categoryFilter ? categoryFilter.value : 'all';
  const price = priceFilter ? priceFilter.value : 'all';

  if (!catalogList) return;

  Array.from(catalogList.children).forEach(card => {
    const name = card.querySelector('h3').innerText.toLowerCase();
    const cat = card.dataset.category;
    const priceValue = parseInt(card.dataset.price, 10);

    let visible = true;

    if (searchText && !name.includes(searchText)) visible = false;
    if (category !== 'all' && cat !== category) visible = false;

    if (price !== 'all') {
      const [min, max] = price.split('-');
      if (max) {
        if (!(priceValue >= parseInt(min) && priceValue <= parseInt(max))) visible = false;
      } else if (price.endsWith('+')) {
        if (priceValue < parseInt(min)) visible = false;
      }
    }

    card.style.display = visible ? 'flex' : 'none';
  });
}

if (searchInput) searchInput.addEventListener('input', filterProducts);
if (categoryFilter) categoryFilter.addEventListener('change', filterProducts);
if (priceFilter) priceFilter.addEventListener('change', filterProducts);

// ==========================
// FAQ
// ==========================
document.querySelectorAll('.faq-item').forEach(item => {
  item.addEventListener('click', () => {
    item.classList.toggle('open');
  });
});

// ==========================
// CHECKOUT НА СТОРІНЦІ
// ==========================
function renderCartOnCheckout() {
  const cartItemsContainer = document.getElementById('cart-items');
  const cartTotal = document.getElementById('cart-total');
  if (!cartItemsContainer || !cartTotal) return;

  cartItemsContainer.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.classList.add('cart-item');
    div.innerText = `${item.name} - ${item.price} грн x ${item.quantity}`;
    cartItemsContainer.appendChild(div);
  });
  const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cartTotal.innerText = total;
}

// Виклик для checkout.html
document.addEventListener('DOMContentLoaded', () => {
  renderCartOnCheckout();
});
