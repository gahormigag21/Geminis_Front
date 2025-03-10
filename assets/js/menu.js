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
            mesasDisponibles: item.MesasDisponibles,
            cantidadDePersonasPorMesa: item.CantidadDePersonasPorMesa,
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

const fetchAndAddMenus = async () => {
    try {
        const response = await fetch(`${configURL1.baseUrl}/api/menu/`);
        const data = await response.json();
        const newMenus = data.map(item => ({
            sede: item.Sede.toString(),
            nombre: item.Nombre,
            descripcion: item.Descripcion,
            precio: parseFloat(item.Precio),
            tipo: item.Tipo,
            img: item.ImagenMenu
        }));
        return newMenus;
    } catch (error) {
        console.error('Error fetching menus:', error);
        return [];
    }
};

const getRestaurantData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    } else {
        const existingRestaurants = [
            {
                id: "100",
                name: "Restaurante El Buen Sabor",
                logo: "../assets/images/logoRestaurante1.webp",
                description: "Un lugar perfecto para disfrutar de comida casera.",
                distance: "2.5 km",
                image: "../assets/images/restaurante.jpg",
                direccion: "Calle 123, Ciudad",
                mesasDisponibles: 5,
                cantidadDePersonasPorMesa: 10,
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
                mesasDisponibles: 3,
                cantidadDePersonasPorMesa: 5,
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
                mesasDisponibles: 10,
                cantidadDePersonasPorMesa: 15,
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
                mesasDisponibles: 20,
                cantidadDePersonasPorMesa: 25,
                telefono: "321-654-0987",
                horario: "11:00 AM - 12:00 AM",
                categoria: 10
            }
        ];

        const fetchedRestaurants = await fetchAndAddRestaurants();
        const restaurants = existingRestaurants.concat(fetchedRestaurants);
        const restaurant = restaurants.find(r => r.id === restaurantId);

        const menus = [
            {
                id: "100",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "Margarita", descripcion: "Pizza clásica con queso mozzarella y albahaca", precio: 39000, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Pepperoni", descripcion: "Pizza con rodajas de pepperoni y queso extra", precio: 39000, tipo: 1 }
                ]
            },
            {
                id: "200",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "Classic Burger", descripcion: "Hamburguesa con carne de res, lechuga, tomate y queso cheddar", precio: 25000, tipo: 1 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Veggie Delight", descripcion: "Hamburguesa vegetariana con guacamole y queso suizo", precio: 28000, tipo: 2 }
                ]
            },
            {
                id: "300",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "Taco de Carnitas", descripcion: "Taco con cerdo desmenuzado y salsa verde", precio: 18900, tipo: 1 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Taco de Pollo", descripcion: "Taco con pollo a la parrilla y salsa roja", precio: 20000, tipo: 6 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Taco Vegetariano", descripcion: "Taco con frijoles negros, aguacate y pico de gallo", precio: 18000, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Taco de Pescado", descripcion: "Taco con pescado empanizado y crema de chipotle", precio: 20900, tipo: 3 }
                ]
            },
            {
                id: "400",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "California Roll", descripcion: "Rollo de sushi con aguacate, cangrejo y pepino", precio: 32990, tipo: 3 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Salmon Nigiri", descripcion: "Arroz de sushi cubierto con salmón fresco", precio: 29900, tipo: 3 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Veggie Roll", descripcion: "Rollo de sushi con zanahoria, pepino y aguacate", precio: 20000, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Dragon Roll", descripcion: "Rollo de sushi con camarón tempura y aguacate", precio: 28900, tipo: 3 }
                ]
            },
            {
                id: "600",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "Spaghetti Bolognese", descripcion: "Espagueti con salsa de carne y tomate", precio: 49900, tipo: 1 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Fettuccine Alfredo", descripcion: "Pasta con salsa cremosa de queso y mantequilla", precio: 44900, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Penne Arrabbiata", descripcion: "Pasta con salsa de tomate picante", precio: 41900, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Lasagna", descripcion: "Capas de pasta, carne molida y queso gratinado", precio: 52900, tipo: 1 }
                ]
            },
            {
                id: "500",
                menu: [
                    { img: "../assets/images/img-pizza1.webp", nombre: "Acai Bowl", descripcion: "Tazón con acai, frutas frescas y granola", precio: 35900, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Quinoa Salad", descripcion: "Ensalada de quinoa con aguacate, pepino y limón", precio: 30900, tipo: 2 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Chicken Bowl", descripcion: "Tazón con pollo a la parrilla, arroz integral y vegetales", precio: 39900, tipo: 6 },
                    { img: "../assets/images/img-pizza1.webp", nombre: "Shrimp Bowl", descripcion: "Tazón con camarones, espinaca y aderezo asiático", precio: 44900, tipo: 3 }
                ]
            }
        ];

        const fetchedMenus = await fetchAndAddMenus();
        fetchedMenus.forEach(menuItem => {
            let menu = menus.find(m => m.id === menuItem.sede);
            if (!menu) {
                menu = { id: menuItem.sede, menu: [] };
                menus.push(menu);
            }
            menu.menu.push({
                img: menuItem.img,
                nombre: menuItem.nombre,
                descripcion: menuItem.descripcion,
                precio: menuItem.precio,
                tipo: menuItem.tipo
            });
        });

        if (!restaurant) {
            document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
            return;
        }

        const container = document.getElementById('menu-items');
        container.innerHTML = `
            <div class="restaurante-info">
                <h1>${restaurant.name}</h1>
                <img class="restaurant-logo" src="${restaurant.logo}" alt="logotipo de ${restaurant.name}">
            </div>
            <div class="menu">
                ${menus.find(m => m.id === restaurantId).menu.map(item => `
                    <div class="card">
                        <div class="menu-item">
                            <img class="item-img" src="${item.img}" alt="imagen de ${item.nombre}">
                            <h2 class="menu-name">${item.nombre}</h2>
                            <p class="menu-description">${item.descripcion}</p>
                            <p class="menu-price">$${item.precio}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
};

// Llamar a la función para cargar los datos del restaurante
getRestaurantData();
