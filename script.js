document.addEventListener('DOMContentLoaded', () => {
    
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

    // --- FUNCIÓN PARA GENERAR PRODUCTOS ---
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
                <div class="product-card-image-container">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price">${formattedPrice}</p>
                    <a href="${whatsappLink}" class="buy-button" target="_blank" data-action="buy">Comprar</a>
                </div>
            `;
            productGrid.appendChild(card);
        });
    }

    // --- LÓGICA DEL SPLASH SCREEN ---
    const splashScreen = document.getElementById('splash-screen');
    if(splashScreen) {
        setTimeout(() => {
            splashScreen.classList.add('hidden');
        }, 3000);
    }

    // --- LÓGICA DEL HEADER SCROLL ---
    const header = document.querySelector('.main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 50);
        });
    }

    // --- LÓGICA MENÚ MÓVIL ---
    const mobileMenuIcon = document.querySelector('.mobile-menu-icon');
    const mainNav = document.querySelector('.main-nav');
    if (mobileMenuIcon && mainNav) {
        mobileMenuIcon.addEventListener('click', () => {
            mainNav.classList.toggle('active');
        });
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                 mainNav.classList.remove('active');
            });
        });
    }

    // --- LÓGICA DEL MODAL ---
    const modal = document.getElementById('product-modal');
    if (modal && productGrid) {
        const closeModalBtn = document.getElementById('close-modal-btn');
        const modalImg = document.getElementById('modal-img');
        const modalName = document.getElementById('modal-name');
        const modalPrice = document.getElementById('modal-price');
        const modalBuyBtn = document.getElementById('modal-buy-btn');

        productGrid.addEventListener('click', (e) => {
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
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });

        document.querySelector('.fav-btn').addEventListener('click', function() {
            this.textContent = this.textContent === '♡' ? '❤️' : '♡';
            this.style.color = this.textContent === '❤️' ? 'red' : 'white';
        });
    }
    
    // --- SERVICE WORKER REGISTRATION (PWA) ---
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js')
                .then(reg => console.log('Service Worker: Registrado'))
                .catch(err => console.log(`Service Worker: Error de Registro: ${err}`));
        });
    }
    
    // --- LÓGICA PROMPT DE INSTALACIÓN PWA ---
    let deferredPrompt;
    const installPrompt = document.getElementById('install-prompt');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if(installPrompt) installPrompt.classList.add('visible');
    });

    if(installPrompt) {
        installPrompt.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                const { outcome } = await deferredPrompt.userChoice;
                console.log(`Respuesta del usuario: ${outcome}`);
                deferredPrompt = null;
                installPrompt.classList.remove('visible');
            }
        });
    }

    // --- BOTÓN COMPARTIR DEL FOOTER ---
    const shareButton = document.querySelector('.footer-share-button');
    if (shareButton) {
        shareButton.addEventListener('click', async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: document.title,
                        text: '¡Echa un vistazo a esta increíble tienda!',
                        url: window.location.href
                    });
                } catch(err) {
                    console.error('Error al compartir:', err);
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                alert('¡URL copiada al portapapeles!');
            }
        });
    }
});