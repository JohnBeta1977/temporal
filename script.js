document.addEventListener('DOMContentLoaded', () => {
    
    // --- LÓGICA DEL ACORDEÓN DE PREGUNTAS FRECUENTES (FAQ) ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const answer = item.querySelector('.faq-answer');
            const isActive = question.classList.contains('active');

            // Opcional: Cerrar otros items al abrir uno
            faqItems.forEach(i => {
                i.querySelector('.faq-question').classList.remove('active');
                i.querySelector('.faq-answer').style.maxHeight = null;
            });

            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });

    // --- CÓDIGO EXISTENTE (SIN CAMBIOS SIGNIFICATIVOS) ---

    // --- CONSTANTES Y DATOS ---
    const WHATSAPP_NUMBER = "573205893469";
    const products = [
        { name: "Lámpara de Escritorio LED", price: 75000, image: "https://img.kwcdn.com/product/fancy/4d5ba661-1998-41e0-8aa2-e773c85b9998.jpg?imageView2/2/w/800/q/70/format/webp" },
        { name: "Silla Ergonómica de Oficina", price: 450000, image: "https://img.kwcdn.com/product/open/04ef122179dc41e0aed6b23b2b0d560d-goods.jpeg?imageView2/2/w/800/q/70/format/webp" },
        { name: "Set de Herramientas Premium", price: 120000, image: "https://img.kwcdn.com/product/aisc_image/fancy/opt/0174c609-5444-4e30-a4d3-3a8876ed59c1.jpg?imageView2/2/w/800/q/70/format/webp" },
        { name: "Reloj Inteligente Pro", price: 280000, image: "https://img.kwcdn.com/product/open/2024-08-18/1723952896388-88996a50b21c4e1b87ae278ff56eb0cb-goods.jpeg?imageView2/2/w/800/q/70/format/webp" },
        { name: "Auriculares Inalámbricos Sound", price: 150000, image: "https://img.kwcdn.com/product/Fancyalgo/VirtualModelMatting/192d52a53d6d854dd42d72e82ae3e935.jpg?imageView2/2/w/800/q/70/format/webp" },
        { name: "Mochila Antirrobo para Laptop", price: 95000, image: "https://img.kwcdn.com/product/fancy/4d5ba661-1998-41e0-8aa2-e773c85b9998.jpg?imageView2/2/w/800/q/70/format/webp" }
    ];
    const productGrid = document.querySelector('.product-grid');

    if (productGrid) {
        products.forEach(product => {
            const card = document.createElement('article');
            card.className = 'product-card';
            card.dataset.name = product.name;
            card.dataset.price = product.price;
            card.dataset.image = product.image;

            const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(product.price);
            const whatsappMessage = `¡Hola! Me interesa este producto: *${product.name}* - Precio: *${formattedPrice}*. Quisiera más información.`;
            const whatsappLink = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
            
            card.innerHTML = `
                <div class="product-card-image-container"><img src="${product.image}" alt="${product.name}" loading="lazy"></div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formattedPrice}</p>
                    <a href="${whatsappLink}" class="buy-button" target="_blank" data-action="buy">Comprar</a>
                </div>`;
            productGrid.appendChild(card);
        });
    }

    const splashScreen = document.getElementById('splash-screen');
    if(splashScreen) setTimeout(() => splashScreen.classList.add('hidden'), 3000);

    const header = document.querySelector('.main-header');
    if (header) window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 50));

    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuIcon && mainNav) {
        mobileMenuIcon.addEventListener('click', () => mainNav.classList.toggle('active'));
        mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => mainNav.classList.remove('active')));
    }

    const modal = document.getElementById('product-modal');
    if (modal && productGrid) {
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalPrice = document.getElementById('modal-price');
        const modalBuyBtn = document.getElementById('modal-buy-btn');

        productGrid.addEventListener('click', e => {
            if (e.target.dataset.action === 'buy') return;
            const card = e.target.closest('.product-card');
            if (card) {
                modalImg.src = card.dataset.image;
                modalName.textContent = card.dataset.name;
                const formattedPrice = new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(card.dataset.price);
                modalPrice.textContent = formattedPrice;
                const whatsappMessage = `¡Hola! Me interesa este producto: *${card.dataset.name}* - Precio: *${formattedPrice}*. Quisiera más información.`;
                modalBuyBtn.href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
                modal.classList.add('visible');
            }
        });

        const closeModal = () => modal.classList.remove('visible');
        closeModalBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
    }
    
    // PWA & Share logic
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
    }
    let deferredPrompt;
    const installPrompt = document.getElementById('install-prompt');
    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();
        deferredPrompt = e;
        if(installPrompt) installPrompt.classList.add('visible');
    });
    if(installPrompt) {
        installPrompt.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt = null;
                installPrompt.classList.remove('visible');
            }
        });
    }
    const shareButton = document.querySelector('.footer-share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            if (navigator.share) {
                await navigator.share({ title: document.title, text: '¡Echa un vistazo a esta increíble tienda!', url: window.location.href });
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('¡URL copiada al portapapeles!');
            }
        });
    }
});