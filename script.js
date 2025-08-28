// Dados dos produtos
const products = [
    {
        id: 1,
        name: "Defumador de Ervas",
        category: "defumadores",
        price: 18.90,
        description: "Defumador natural de ervas para purificação e limpeza energética",
        benefits: ["Purificação", "Limpeza energética", "Proteção"],
        image: "defumador_1.png",
        stock: 50
    },
    {
        id: 2,
        name: "Palo Santo Mágico",
        category: "palo-santo",
        price: 25.50,
        description: "Palo Santo sagrado para rituais de limpeza e proteção espiritual",
        benefits: ["Limpeza espiritual", "Proteção", "Meditação"],
        image: "palo_santo_1.jpg",
        stock: 35
    },
    {
        id: 3,
        name: "Sinergias",
        category: "sinergias",
        price: 32.00,
        description: "Sinergias especiais para harmonizar mente, corpo e espírito",
        benefits: ["Harmonia", "Equilíbrio", "Bem-estar"],
        image: "sinergia_1.png",
        stock: 30
    }
];

// Estado da aplicação
let cart = [];
let currentCategory = 'all';

// Elementos DOM
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartCount = document.getElementById('cartCount');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const productsGrid = document.getElementById('productsGrid');
const tabBtns = document.querySelectorAll('.tab-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const productModal = document.getElementById('productModal');
const closeModal = document.getElementById('closeModal');
const modalBody = document.getElementById('modalBody');
const contactForm = document.getElementById('contactForm');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    setupEventListeners();
    loadCartFromStorage();
    updateCartDisplay();
});

// Configuração dos event listeners
function setupEventListeners() {
    // Carrinho
    cartBtn.addEventListener('click', toggleCart);
    closeCart.addEventListener('click', toggleCart);
    
    // Navegação mobile
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Filtros de categoria
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            filterProducts(category);
            
            // Atualizar botões ativos
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Modal
    closeModal.addEventListener('click', closeProductModal);
    window.addEventListener('click', (e) => {
        if (e.target === productModal) {
            closeProductModal();
        }
    });
    
    // Formulário de contato
    contactForm.addEventListener('submit', handleContactSubmit);
    
    // Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Carregar produtos
function loadProducts() {
    const filteredProducts = currentCategory === 'all' 
        ? products 
        : products.filter(product => product.category === currentCategory);
    
    productsGrid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
    
    // Adicionar event listeners para abrir modal
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', (e) => {
            if (!e.target.classList.contains('add-to-cart')) {
                const productId = parseInt(card.dataset.productId);
                openProductModal(productId);
            }
        });
    });
}

// Filtrar produtos por categoria
function filterProducts(category) {
    currentCategory = category;
    loadProducts();
}

// Abrir modal do produto
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    modalBody.innerHTML = `
        <div class="modal-product">
            <div class="modal-product-image">
                <img src="${product.image}" alt="${product.name}" class="modal-product-img">
            </div>
            <div class="modal-product-info">
                <h2>${product.name}</h2>
                <p class="modal-description">${product.description}</p>
                <div class="modal-benefits">
                    <h4>Benefícios:</h4>
                    <ul>
                        ${product.benefits.map(benefit => `<li>${benefit}</li>`).join('')}
                    </ul>
                </div>
                <div class="modal-price">R$ ${product.price.toFixed(2)}</div>
                <div class="modal-stock">Estoque: ${product.stock} unidades</div>
                <button class="add-to-cart-modal" onclick="addToCart(${product.id}); closeProductModal();">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `;
    
    productModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal do produto
function closeProductModal() {
    productModal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Adicionar ao carrinho
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        } else {
            showNotification('Produto sem estoque suficiente!', 'error');
            return;
        }
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCartToStorage();
    updateCartDisplay();
    showNotification(`${product.name} adicionado ao carrinho!`, 'success');
}

// Remover do carrinho
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCartToStorage();
    updateCartDisplay();
    showNotification('Produto removido do carrinho!', 'info');
}

// Atualizar quantidade
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;
    
    const newQuantity = item.quantity + change;
    const product = products.find(p => p.id === productId);
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
    } else if (newQuantity <= product.stock) {
        item.quantity = newQuantity;
        saveCartToStorage();
        updateCartDisplay();
    } else {
        showNotification('Quantidade não disponível em estoque!', 'error');
    }
}

// Atualizar exibição do carrinho
function updateCartDisplay() {
    // Atualizar contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualizar itens do carrinho
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-image">
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.id})">Remover</button>
        </div>
    `).join('');
    
    // Atualizar total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.textContent = `R$ ${total.toFixed(2)}`;
}

// Alternar carrinho
function toggleCart() {
    cartSidebar.classList.toggle('open');
}

// Alternar menu mobile
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
}

// Salvar carrinho no localStorage
function saveCartToStorage() {
    localStorage.setItem('incensosCart', JSON.stringify(cart));
}

// Carregar carrinho do localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('incensosCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

// Finalizar compra
function checkout() {
    if (cart.length === 0) {
        showNotification('Seu carrinho está vazio!', 'warning');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Simular processo de checkout
    showNotification('Redirecionando para o pagamento...', 'info');
    
    setTimeout(() => {
        alert(`Total da compra: R$ ${total.toFixed(2)}\n\nEsta é uma demonstração. Em um site real, você seria redirecionado para um gateway de pagamento.`);
        
        // Limpar carrinho após "compra"
        cart = [];
        saveCartToStorage();
        updateCartDisplay();
        toggleCart();
    }, 2000);
}

// Enviar formulário de contato
function handleContactSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    // Simular envio
    showNotification('Mensagem enviada com sucesso!', 'success');
    e.target.reset();
}

// Sistema de notificações
function showNotification(message, type = 'info') {
    // Remover notificação existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Criar nova notificação
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Adicionar estilos
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : type === 'warning' ? '#ff9800' : '#2196F3'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remover após 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 5000);
}

// Adicionar estilos CSS para notificações
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-content button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    
    .modal-product {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        align-items: start;
    }
    
    .modal-product-image {
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(45deg, #f0f0f0, #e0e0e0);
        border-radius: 15px;
        padding: 2rem;
    }
    
    .modal-product-info h2 {
        color: #333;
        margin-bottom: 1rem;
    }
    
    .modal-description {
        color: #666;
        margin-bottom: 1.5rem;
        line-height: 1.6;
    }
    
    .modal-benefits {
        margin-bottom: 1.5rem;
    }
    
    .modal-benefits h4 {
        color: #333;
        margin-bottom: 0.5rem;
    }
    
    .modal-benefits ul {
        list-style: none;
        padding: 0;
    }
    
    .modal-benefits li {
        color: #666;
        padding: 0.25rem 0;
        position: relative;
        padding-left: 1.5rem;
    }
    
    .modal-benefits li::before {
        content: '✓';
        position: absolute;
        left: 0;
        color: #8B4513;
        font-weight: bold;
    }
    
    .modal-price {
        font-size: 1.5rem;
        font-weight: 700;
        color: #8B4513;
        margin-bottom: 0.5rem;
    }
    
    .modal-stock {
        color: #666;
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
    }
    
    .add-to-cart-modal {
        width: 100%;
        background: #8B4513;
        color: white;
        border: none;
        padding: 1rem;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .add-to-cart-modal:hover {
        background: #A0522D;
    }
    
    @media (max-width: 768px) {
        .modal-product {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(notificationStyles);

// Event listeners para checkout
checkoutBtn.addEventListener('click', checkout);

// Fechar carrinho ao clicar fora
document.addEventListener('click', (e) => {
    if (!cartSidebar.contains(e.target) && !cartBtn.contains(e.target)) {
        cartSidebar.classList.remove('open');
    }
});

// Fechar menu mobile ao clicar em um link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Animações de scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animação
document.querySelectorAll('.product-card, .benefit, .contact-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});
