const fetchAndAddRestaurants = async () => {
    try {
        const response = await fetch(`${configURL1.baseUrl}/api/sedes/all`);
        const data = await response.json();
        const newRestaurants = data.map(item => ({
            id: item.Rowid.toString(),
            name: item.EmpresaNombre,
            logo: item.UbicacionLogo,
            description: item.EmpresaDescripcion,
            distance: `${Math.floor(Math.random() * 10) + 1} km`, // Random distance
            image: item.Imagenes,
            direccion: item.Direccion,
            mesasTotales: item.MesasTotales,
            mesasDisponibles: item.MesasDisponibles,
            reservasMaximas: item.ReservasMaximas,
            telefono: item.Telefono,
            horario: item.Horario,
            categoria: parseInt(item.EmpresaCategoria)
        }));
        return newRestaurants;
    } catch (error) {
        console.error('Error fetching restaurants:', error);
        return [];
    }
};

const loadRestaurants = async () => {
    const carousel = document.getElementById('restaurant-carousel');
    const existingRestaurants = [
        {
            id: "100",
            name: "Restaurante El Buen Sabor",
            logo: "../assets/images/logoRestaurante1.webp",
            description: "Un lugar perfecto para disfrutar de comida casera.",
            distance: "2.5 km",
            image: "../assets/images/restaurante.jpg",
            direccion: "Calle 123, Ciudad",
            mesasTotales: 20,
            mesasDisponibles: 5,
            reservasMaximas: 10,
            telefono: "123-456-7890",
            horario: "9:00 AM - 10:00 PM",
            categoria: 3
        },
        {
            id: "200",
            name: "Comida Rápida Express",
            logo: "../assets/images/logoRestaurante2.webp",
            description: "Comida rápida para disfrutar en familia.",
            distance: "5.0 km",
            image: "../assets/images/restaurante2.jpg",
            direccion: "Avenida 456, Ciudad",
            mesasTotales: 15,
            mesasDisponibles: 3,
            reservasMaximas: 5,
            telefono: "098-765-4321",
            horario: "10:00 AM - 11:00 PM",
            categoria: 1
        },
        {
            id: "300",
            name: "Comida tradicional",
            logo: "../assets/images/logoRestaurante3.webp",
            description: "Comida tradicional de la región.",
            distance: "3.2 km",
            image: "../assets/images/restaurante3.jpg",
            direccion: "Calle 789, Ciudad",
            mesasTotales: 25,
            mesasDisponibles: 10,
            reservasMaximas: 15,
            telefono: "456-789-0123",
            horario: "8:00 AM - 9:00 PM",
            categoria: 12
        },
        {
            id: "400",
            name: "Comida oriental",
            logo: "../assets/images/logoRestaurante4.webp",
            description: "Sabores auténticos del este asiático.",
            distance: "1.1 km",
            image: "../assets/images/restaurante4.jpg",
            direccion: "Avenida 101, Ciudad",
            mesasTotales: 30,
            mesasDisponibles: 20,
            reservasMaximas: 25,
            telefono: "321-654-0987",
            horario: "11:00 AM - 12:00 AM",
            categoria: 10
        }
    ];
    const fetchedRestaurants = await fetchAndAddRestaurants();
    const restaurants = existingRestaurants.concat(fetchedRestaurants);

    restaurants.forEach((restaurant) => {
        const item = document.createElement('div');
        item.classList.add('carousel-item');
        item.innerHTML = `
            <div class="restaurant-logo">
                <img src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
            </div>
            <img class="restaurant-img" src="${restaurant.image}" alt="${restaurant.name}">
            <div class="restaurant-info">
                <h3>${restaurant.name}</h3>
                <div class="restaurant-description">
                    <p>${restaurant.description}</p>
                </div>
                <p>Dirección: ${restaurant.direccion}</p>
                <a href="restaurant.html?id=${restaurant.id}" class="primary-btn">Ver Restaurante</a>
            </div>
        `;

        carousel.appendChild(item);
    });

    initOwlCarousel(); // Initialize the carousel after loading restaurants
};

document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const unitPrice = urlParams.get('id');
    const status = urlParams.get('status');
    const title = urlParams.get('title');

    if (unitPrice && status && title) {
        showPaymentStatusModal(status, title);
    }

    await loadRestaurants();
});

function showPaymentStatusModal(status, title) {
    const modal = document.getElementById('paymentStatusModal');
    const modalTitle = document.getElementById('payment-status-title');
    const modalMessage = document.getElementById('payment-status-message');

    if (status === 'success') {
        modalTitle.innerText = 'Gracias por su compra';
        modalMessage.innerText = `Gracias por comprar el plan ${title}, su cuenta se ha actualizado con nuevas funciones.`;
    } else if (status === 'pending') {
        modalTitle.innerText = 'Pago pendiente';
        modalMessage.innerText = `El pago está pendiente. Su cuenta será actualizada una vez se confirme el pago.`;
    } else if (status === 'failure') {
        modalTitle.innerText = 'Error en el pago';
        modalMessage.innerText = `Hubo un error con el pago. Puede reintentar o probar más tarde.`;
    }

    modal.style.display = 'flex';
}

function closePaymentStatusModal() {
    const modal = document.getElementById('paymentStatusModal');
    modal.style.display = 'none';
}

document.addEventListener("DOMContentLoaded", () => {
    function initOwlCarousel() {
        $(".carousel-container").owlCarousel("destroy"); // Destruir si ya está inicializado
        $(".carousel-container").owlCarousel({
            nav: true,
            dots: false,
            loop: true,
            margin: 30,
            stagePadding: 2,
            center: false,
            autoplay: false,
            navText: ["<i class=\"fa-solid fa-chevron-left\"></i>", "<i class=\"fa-solid fa-chevron-right\"></i>"],
            autoWidth: true,
            responsive: {
                0: {
                    items: 1,
                    nav: false,
                    dots: true,
                    center: true
                },
                768: {
                    items: 2.6,
                    nav: true
                },
                992: {
                    items: 3
                },
                1200: {
                    items: 3.6
                },
                1400: {
                    items: 4
                }
            }
            // ,
            // onInitialized: function () {
            //     limitOwlDots(5); // Límite de dots visibles
            // },
            // onResized: function () {
            //     limitOwlDots(5);
            //      // Asegurar que el límite se mantenga al redimensionar

            // }
        });
    }

    // function limitOwlDots(maxDots) {
    //     let dots = $(".carousel-container .owl-dots .owl-dot");
    //     if (dots.length > maxDots) {
    //         dots.hide().slice(0, maxDots).show(); // Oculta todos y solo muestra los primeros `maxDots`
    //     }
    // }

    window.initOwlCarousel = initOwlCarousel; // Make initOwlCarousel globally accessible

    // initOwlCarousel(); // Inicializar el carrusel al cargar la página

    // window.addEventListener('resize', function () {
    //     initOwlCarousel(); // Reinicializar al cambiar el tamaño de la ventana
    // });
});


function togglePricingPlans() {
    const isChecked = document.getElementById('color_mode').checked;
    const personalContainer = document.querySelector('.pricing-card-container-personal');
    const empresaContainer = document.querySelector('.pricing-card-container-empresa');

    if (isChecked) {
        personalContainer.style.display = 'none';
        empresaContainer.style.display = 'flex';
    } else {
        personalContainer.style.display = 'flex';
        empresaContainer.style.display = 'none';
    }
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('color_mode').addEventListener('change', togglePricingPlans);
    togglePricingPlans(); // Initialize the correct state on page load
});

document.getElementById('terms-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('termsModal').style.display = 'flex';
});

document.getElementById('closeTermsBtn').addEventListener('click', () => {
    document.getElementById('termsModal').style.display = 'none';
});

document.getElementById('terms').addEventListener('change', (event) => {
    document.getElementById('purchase-button').disabled = !event.target.checked;
});

// Ver Detalles del Plan
function openModal(planType) {
    const modal = document.getElementById("pricingModal");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const purchaseButton = document.getElementById("purchase-button");
    const termsContainer = document.getElementById("terms-container");

    if (planType === "basic" || planType === "personal-basic") {
        purchaseButton.style.display = "none";
        termsContainer.style.display = "none";
    } else {
        const userToken = localStorage.getItem("token");
        if (userToken) {
            purchaseButton.style.display = "block";
        } else {
            purchaseButton.innerHTML = '<a href="./login.html">Inicia sesión para comprar</a>';
            purchaseButton.style.display = "block";
        }
        termsContainer.style.display = "block";
    }

    if (planType === "basic") {
        modalTitle.innerText = "Plan Básico";
        modalDescription.innerHTML = `
            <table>
                <tr><td>Acceso a reservas y domicilios <span style="color: green;">✔</span></td></tr>
                <tr><td>Posibilidad de agregar una sede <span style="color: green;">✔</span></td></tr>
                <tr><td>Agregar una imagen por sede <span style="color: green;">✔</span></td></tr>
                <tr><td>Agregar hasta 12 platos al menú <span style="color: green;">✔</span></td></tr>
                <tr><td>No incluye soporte adicional <span style="color: red;">✖</span></td></tr>
                <tr><td>No incluye más de una sede <span style="color: red;">✖</span></td></tr>
            </table>
        `;
    } else if (planType === "intermediate") {
        modalTitle.innerText = "Plan Intermedio";
        modalDescription.innerHTML = `
            <table>
                <tr><td>Incluye todo lo del Plan Básico <span style="color: green;">✔</span></td></tr>
                <tr><td>Posibilidad de agregar hasta dos sedes <span style="color: green;">✔</span></td></tr>
                <tr><td>Agregar hasta 15 platos al menú <span style="color: green;">✔</span></td></tr>
                <tr><td>Soporte adicional <span style="color: green;">✔</span></td></tr>
            </table>
        `;
    } else if (planType === "advanced") {
        modalTitle.innerText = "Plan Avanzado";
        modalDescription.innerHTML = `
            <table>
                <tr><td>Incluye todo lo del Plan Intermedio <span style="color: green;">✔</span></td></tr>
                <tr><td>Posibilidad de agregar más de dos sedes <span style="color: green;">✔</span></td></tr>
                <tr><td>Agregar más de una imagen por sede <span style="color: green;">✔</span></td></tr>
                <tr><td>Sección de destacados <span style="color: green;">✔</span></td></tr>
                <tr><td>Agregar platos ilimitados al menú <span style="color: green;">✔</span></td></tr>
                <tr><td>Soporte premium <span style="color: green;">✔</span></td></tr>
            </table>
        `;
    } else if (planType === "personal-basic") {
        modalTitle.innerText = "Plan Básico Personal";
        modalDescription.innerHTML = `
            <table>
                <tr><td>Acceso a reservas <span style="color: green;">✔</span></td></tr>
                <tr><td>Acceso a domicilios <span style="color: green;">✔</span></td></tr>
                <tr><td>Solo 10 domicilios por més <span style="color: red;">✖</span></td></tr>
                <tr><td>Solo 8 reservas por més <span style="color: red;">✖</span></td></tr>
                <tr><td>No incluye restaurantes personalizados <span style="color: red;">✖</span></td></tr>
            </table>
        `;
    } else if (planType === "personal-premium") {
        modalTitle.innerText = "Plan Premium Personal";
        modalDescription.innerHTML = `
            <table>
                <tr><td>Posibilidad de realizar más de 8 reservas por mes <span style="color: green;">✔</span></td></tr>
                <tr><td>Más de 15 domicilios por mes <span style="color: green;">✔</span></td></tr>
                <tr><td>Ofrecer restaurantes personalizados de acuerdo a los gustos <span style="color: green;">✔</span></td></tr>
            </table>
        `;
    }

    modal.style.display = "flex";
    purchaseButton.setAttribute("data-plan-type", planType);
}

function getPlanPrice(planType) {
    switch (planType) {
        case "personal-premium":
            return 10000;
        case "intermediate":
            return 20000;
        case "advanced":
            return 40000;
        default:
            return 0;
    }
}

function purchasePlan() {
    const planType = document.getElementById("purchase-button").getAttribute("data-plan-type");
    const amount = getPlanPrice(planType);
    const email = localStorage.getItem("email");

    fetch(`${configURL1.baseUrl}/api/pagos/crear-preferencia`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title: planType,
            quantity: 1,
            unit_price: amount,
            email: email
        })
    })
        .then(response => response.json())
        .then(data => {
            window.location.href = data.init_point; // Redirect to Mercado Pago link
        })
        .catch(error => console.error('Error creating preference:', error));
}

function closeModal() {
    const modal = document.getElementById("pricingModal");
    modal.style.display = "none";
}


function toggleFaqAnswer(element) {
    const answer = element.nextElementSibling;
    const icon = element.querySelector('i');
    if (answer.style.display === 'block') {
        answer.style.display = 'none';
        icon.classList.remove('fa-chevron-up');
        icon.classList.add('fa-chevron-down');
    } else {
        answer.style.display = 'block';
        icon.classList.remove('fa-chevron-down');
        icon.classList.add('fa-chevron-up');
    }
}
