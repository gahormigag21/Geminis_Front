const fetchRestaurantById = async (id) => {
    try {
        const response = await fetch(`${configURL1.baseUrl}/api/sedes/all/sedeid/${id}`);
        const item = await response.json();
        return {
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
        };
    } catch (error) {
        console.error('Error fetching restaurant:', error);
        return null;
    }
};

const getRestaurantData = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const restaurantId = urlParams.get('id');

    if (!restaurantId) {
        // Manejar el caso donde no se proporciona un ID
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

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

    let restaurant = existingRestaurants.find(r => r.id === restaurantId);

    if (!restaurant) {
        restaurant = await fetchRestaurantById(restaurantId);
    }

    if (!restaurant) {
        document.body.innerHTML = "<h1>Restaurante no encontrado</h1>";
        return;
    }

    // Mostrar los datos del restaurante
    document.getElementById('restaurante').textContent = restaurant.name;
    document.getElementById('direccion').textContent = restaurant.direccion;

    // Set the max attribute for numpersonas input
    const numPersonasInput = document.getElementById('numpersonas');
    numPersonasInput.max = restaurant.cantidadDePersonasPorMesa;

    // Set default and constraints for fecha input
    const fechaInput = document.getElementById('fecha');
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 7);
    fechaInput.value = today.toISOString().split('T')[0];
    fechaInput.min = today.toISOString().split('T')[0];
    fechaInput.max = maxDate.toISOString().split('T')[0];

    // Set default and constraints for horadereserva input
    const horadereservaInput = document.getElementById('horadereserva');
    const currentHour = new Date();
    currentHour.setMinutes(currentHour.getMinutes() + 30); // Set to 30 minutes ahead

    const updateHoraReservaConstraints = () => {
        const selectedDate = new Date(fechaInput.value);
        const dayOfWeek = selectedDate.toLocaleDateString('es-ES', { weekday: 'long' });
        const restaurantSchedule = JSON.parse(restaurant.horario).find(day => day.day.toLowerCase() === dayOfWeek.toLowerCase());

        if (selectedDate.toDateString() === new Date().toDateString()) {
            // If reservation is for today, set min to 30 minutes ahead
            horadereservaInput.value = currentHour.toTimeString().split(' ')[0].substring(0, 5);
            horadereservaInput.min = currentHour.toTimeString().split(' ')[0].substring(0, 5);
        } else if (restaurantSchedule) {
            // If reservation is for a future date, set min to the restaurant's opening time
            horadereservaInput.min = restaurantSchedule.startTime;
        }

        if (restaurantSchedule) {
            const closingTime = new Date(`1970-01-01T${restaurantSchedule.endTime}:00`);
            closingTime.setMinutes(closingTime.getMinutes() - 30);
            horadereservaInput.max = closingTime.toTimeString().split(' ')[0].substring(0, 5);
        }
    };

    // Update constraints when the date changes
    fechaInput.addEventListener('change', updateHoraReservaConstraints);

    // Initial call to set constraints based on the current date
    updateHoraReservaConstraints();
};

const populateUserData = async () => {
    const userDocument = localStorage.getItem('documento');
    if (!userDocument) {
        console.error('No user document found in localStorage');
        return;
    }

    try {
        const response = await fetch(`${configURL1.baseUrl}/api/users/${userDocument}`);
        const userData = await response.json();

        document.getElementById('cedula').textContent = userData.Documento;
        document.getElementById('nombres').textContent = userData.Nombres;
        document.getElementById('apellido').textContent = userData.Apellido;
        document.getElementById('telefono').value = userData.Telefono;
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
};

document.getElementById('create-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const restaurantId = new URLSearchParams(window.location.search).get('id');
    const restaurant = await fetchRestaurantById(restaurantId);

    if (restaurant.mesasDisponibles <= 0) {
        alert('En este momento no hay mesas disponibles, por favor intente más tarde.');
        return;
    }

    const userDocument = localStorage.getItem('documento');
    const ocasion = document.getElementById('ocasion').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('horadereserva').value;
    const personas = document.getElementById('numpersonas').value;
    const telefono = document.getElementById('telefono').value;

    const selectedDateTime = new Date(`${fecha}T${hora}`);
    const currentDateTime = new Date();

    if (selectedDateTime < currentDateTime) {
        alert('No es posible crear reservas en el pasado. Por favor, seleccione una fecha y hora válidas.');
        return;
    }

    const reservationData = {
        Usuario: userDocument,
        Sede: restaurantId,
        Ocasion: ocasion,
        Fecha: fecha,
        Hora: hora,
        Personas: personas,
        Telefono: telefono
    };

    try {
        const response = await fetch(`${configURL1.baseUrl}/api/reservas`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reservationData)
        });

        if (response.ok) {
            const result = await response.json();
            alert(`Reserva creada exitosamente. Número de confirmación: ${result.NumeroDeConfirmacion}. Si desea otra mesa, puede crear otra reservación.`);


            // Redirect to reservasCliente.html
            window.location.href = 'reservasCliente.html';
        } else {
            alert('Error al crear la reserva. Por favor, intente nuevamente.');
        }
    } catch (error) {
        console.error('Error creating reservation:', error);
        alert('Error al crear la reserva. Por favor, intente nuevamente.');
    }
});

document.getElementById('terms-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('termsModal').style.display = 'flex';
});

document.getElementById('closeTermsBtn').addEventListener('click', () => {
    document.getElementById('termsModal').style.display = 'none';
});

document.getElementById('terms').addEventListener('change', (event) => {
    document.querySelector('button[type="submit"]').disabled = !event.target.checked;
});

// Llamar a las funciones para cargar los datos del restaurante y del usuario
getRestaurantData();
populateUserData();