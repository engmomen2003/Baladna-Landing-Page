const backToTopBtn = document.getElementById("backToTop");
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) backToTopBtn.classList.remove("hidden");
  else backToTopBtn.classList.add("hidden");
});
backToTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelectorAll('nav ul li a').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({ behavior: 'smooth' });
  });
});

const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav ul li a");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("bg-[rgb(193,247,32)]", "text-[rgb(1,88,61)]");
    if (link.getAttribute("href") === `#${current}`) link.classList.add("bg-[rgb(193,247,32)]", "text-[rgb(1,88,61)]");
  });
});

// --- وظائف جديدة ---

// سلة المشتريات
const cartBtn = document.getElementById('cart-btn');
const cartCount = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeCartBtn = document.getElementById('close-cart-btn');
const cartItemsContainer = document.getElementById('cart-items');
const cartTotal = document.getElementById('cart-total');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const checkoutBtn = document.getElementById('checkout-btn');
const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');

// نوافذ الكمية والتنبيه
const quantityModal = document.getElementById('quantity-modal');
const quantityModalProductName = document.getElementById('quantity-modal-product-name');
const quantityInput = document.getElementById('quantity-input');
const quantityMinusBtn = document.getElementById('quantity-minus-btn');
const quantityPlusBtn = document.getElementById('quantity-plus-btn');
const addToCartWithQuantityBtn = document.getElementById('add-to-cart-with-quantity-btn');
const closeQuantityBtn = document.getElementById('close-quantity-btn');

const alertModal = document.getElementById('alert-modal');
const alertMessage = document.getElementById('alert-message');
const closeAlertBtn = document.getElementById('close-alert-btn');


let cart = [];
let currentProduct = {};

// دالة لفتح نافذة السلة
cartBtn.addEventListener('click', () => {
  cartModal.classList.add('show');
});

// دالة لإغلاق نافذة السلة
closeCartBtn.addEventListener('click', () => {
  cartModal.classList.remove('show');
});

// إغلاق النافذة عند الضغط خارجها
window.addEventListener('click', (event) => {
  if (event.target === cartModal) {
    cartModal.classList.remove('show');
  }
});

// دالة تحديث السلة
function updateCart() {
  cartItemsContainer.innerHTML = '';
  let total = 0;
  if (cart.length === 0) {
    emptyCartMsg.style.display = 'block';
  } else {
    emptyCartMsg.style.display = 'none';
    cart.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('flex', 'justify-between', 'items-center', 'mb-2', 'p-2', 'bg-gray-100', 'dark:bg-gray-700', 'rounded-lg');
      itemElement.innerHTML = `
        <div class="flex-1">
          <span class="font-semibold">${item.name}</span>
          <span class="text-sm text-gray-600 dark:text-gray-400">(${item.quantity} × ${item.price} ₪)</span>
        </div>
        <span class="font-bold">${item.price * item.quantity} ₪</span>
        <button class="remove-from-cart-btn text-red-500 hover:text-red-700 transition" data-name="${item.name}">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;
      cartItemsContainer.appendChild(itemElement);
      total += item.price * item.quantity;
    });
  }
  cartTotal.textContent = `${total} ₪`;
  cartCount.textContent = cart.length;
  cartCount.classList.toggle('opacity-0', cart.length === 0);
}

// دالة لإضافة منتج إلى السلة
function addToCart(productName, productPrice, quantity = 1) {
  const existingProduct = cart.find(item => item.name === productName);
  if (existingProduct) {
    existingProduct.quantity += quantity;
  } else {
    cart.push({ name: productName, price: productPrice, quantity: quantity });
  }
  updateCart();
}

// إزالة منتج من السلة
cartItemsContainer.addEventListener('click', (event) => {
  if (event.target.classList.contains('remove-from-cart-btn') || event.target.closest('.remove-from-cart-btn')) {
    const btn = event.target.closest('.remove-from-cart-btn');
    const productName = btn.getAttribute('data-name');
    cart = cart.filter(item => item.name !== productName);
    updateCart();
  }
});

// فتح نافذة الكمية عند النقر على "أضف إلى السلة"
addToCartBtns.forEach(button => {
  button.addEventListener('click', (event) => {
    const productCard = event.target.closest('.card-product');
    currentProduct.name = productCard.getAttribute('data-name');
    currentProduct.price = parseFloat(productCard.getAttribute('data-price'));
    
    quantityModalProductName.textContent = `أضف "${currentProduct.name}"`;
    quantityInput.value = 1; // إعادة تعيين الكمية إلى 1 في كل مرة
    quantityModal.classList.add('show');
  });
});

// إضافة المنتج بكمية محددة
addToCartWithQuantityBtn.addEventListener('click', () => {
  const quantity = parseInt(quantityInput.value);
  if (quantity > 0) {
    addToCart(currentProduct.name, currentProduct.price, quantity);
    quantityModal.classList.remove('show');
    showAlert('تم إضافة المنتج إلى السلة بنجاح!');
  }
});

// إغلاق نافذة الكمية
closeQuantityBtn.addEventListener('click', () => {
  quantityModal.classList.remove('show');
});

// تعديل الكمية في النافذة
quantityPlusBtn.addEventListener('click', () => {
  quantityInput.value = parseInt(quantityInput.value) + 1;
});
quantityMinusBtn.addEventListener('click', () => {
  if (parseInt(quantityInput.value) > 1) {
    quantityInput.value = parseInt(quantityInput.value) - 1;
  }
});

// إتمام الشراء (رسالة تنبيه)
checkoutBtn.addEventListener('click', () => {
  if (cart.length > 0) {
    showAlert('شكراً لك! سيتم إتمام طلبك قريباً.');
    cart = [];
    updateCart();
    cartModal.classList.remove('show');
  } else {
    showAlert('سلتك فارغة، أضف بعض المنتجات أولاً.');
  }
});

// دالة إظهار التنبيه
function showAlert(message) {
  alertMessage.textContent = message;
  alertModal.classList.add('show');
}

// إغلاق التنبيه
closeAlertBtn.addEventListener('click', () => {
  alertModal.classList.remove('show');
});

// وضع الاستماع لإغلاق النوافذ عند الضغط خارجها
window.addEventListener('click', (event) => {
    if (event.target === quantityModal) {
        quantityModal.classList.remove('show');
    }
    if (event.target === alertModal) {
        alertModal.classList.remove('show');
    }
});

// تبديل الوضع (الوضع الداكن/الفاتح)
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const themeIcon = document.getElementById('theme-icon');

themeToggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if (document.body.classList.contains('dark')) {
    themeIcon.classList.remove('fa-sun');
    themeIcon.classList.add('fa-moon');
  } else {
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
  }
});