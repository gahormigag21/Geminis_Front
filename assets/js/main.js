// Cargar componentes comunes
const loadComponent = async (id, file) => {
    const element = document.getElementById(id);
    if (element) {
        try {
            const response = await fetch(`../components/${file}`);
            if (!response.ok) throw new Error(`No se pudo cargar el archivo ${file}`);
            const html = await response.text();
            element.innerHTML = html;
            let userToken = localStorage.getItem("token");
            // Si el archivo es nav.html y tenemos un userName, actualizar el enlace
            if (id === 'nav' && userName) {
                try {
                    const authResponse = await fetch('http://localhost:3000/', {
                        headers: {
                            'Authorization': `Bearer ${userToken}`
                        }
                    });
                    if (authResponse.status === 401) {
                        alert("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
                        logout();
                        return;
                    }
                    if (!authResponse.ok) throw new Error('Error en la autenticación');
                } catch (authError) {
                    console.error('Error en la autenticación:', authError);
                    alert("La sesión ha expirado. Por favor, inicie sesión nuevamente.");
                    logout();
                    return;
                }
                document.querySelector(".login").style.display = "none";
                const enlace = document.getElementById("userName");
                if (enlace) {
                    enlace.textContent = userName;
                    enlace.href = "./profile.html";
                }
                // Mostrar "Mi restaurante" si userEmpresa no es null
                console.log("Empresa:", userEmpresa);
                if (userEmpresa !== 'null') {
                    const miRestauranteLink = document.getElementById("miRestaurante");
                    if (miRestauranteLink) {
                        miRestauranteLink.style.display = 'block';
                    }
                    const sedesLink = document.getElementById("misSedes");
                    if (sedesLink) {
                        sedesLink.style.display = 'block';
                    }
                } else {
                    const miRestauranteLink = document.getElementById("miRestaurante");
                    const sedesLink = document.getElementById("misSedes");
                    miRestauranteLink.style.display = 'none';
                    sedesLink.style.display = 'none';
                }
                // Agregar listener al enlace "Cerrar Sesión"
                const cerrarSesionLink = document.getElementById("CerrarSes");
                if (cerrarSesionLink) {
                    cerrarSesionLink.addEventListener("click", (event) => {
                        event.preventDefault(); // Evitar la navegación predeterminada
                        logout();
                    });
                }
            }

            if (!userToken && id === 'footer') {
                const footerElement = document.querySelector(".footer-container");
                if (footerElement) {
                    const elementsToHide = footerElement.querySelectorAll(".hide-on-login");
                    elementsToHide.forEach((e) => {
                        e.style.display = "none";
                    });
                }
            }
            if (!userToken) {
                if (id === 'nav') {


                    // Activar al final

                    // console.log("No hay sesión activa");
                    // console.log(window.location.pathname);
                    // const user = document.querySelector(".dropdown");
                    // const domi = document.querySelector(".domicilios");
                    // const reserva = document.querySelector(".reservas");
                    // const home = document.querySelector(".login");
                    // user.style.display = "none";
                    // domi.style.display = "none";
                    // reserva.style.display = "none";
                    // home.style.display = "block";
                    // const hola = home.getAttribute("href")
                    // console.log(hola);
                }
            }

        } catch (error) {
            console.error(`Error cargando el componente ${file}:`, error);
        }
    }
};
// Función para cerrar sesión
const logout = () => {
    // Borrar variables de localStorage
    localStorage.removeItem('nombre');
    localStorage.removeItem('documento');
    localStorage.removeItem("token");
    localStorage.removeItem("empresa");
    

    // Borrar variables con info de la persona
    userName = '';
    userDocument = 0;
    userToken = null;
    userEmpresa = null;

    // Redirigir a login.html
    window.location.href = "home.html";
    console.log("sesion cerrada");
};

// Usuario y documento
let userName = localStorage.getItem('nombre');
let userDocument = localStorage.getItem('documento');
let userEmpresa = localStorage.getItem('empresa');
// console.log(userName, userDocument);
// Función para marcar el elemento activo en el nav
const setActiveNavItem = () => {
    const navItems = document.querySelectorAll('nav a');
    const dropItems = document.querySelectorAll('.dropdown-content a');
    const currentPath = window.location.pathname;
    navItems.forEach(item => {
        if (currentPath.includes(item.getAttribute('href'))) {
            if (item.querySelector('img')) {
                item.classList.add('no-hover')
                return;
            }
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
};
// Desactivar el boxShadow para el nav sticky
const handleNavShadow = () => {
    const navElement = document.getElementById('nav');
    if (navElement && navElement.classList.contains('nav-sticky')) {
        const nav = document.querySelector('nav');
        nav.style.boxShadow = 'none';
    }
};
// Cargar Nav y Footer
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('nav', 'nav.html').then(() => {
        setActiveNavItem();
        handleNavShadow();

    });
    loadComponent('footer', 'footer.html');
    // animacion mision y vision
    const about = window.location.pathname;
    if (about.includes('about.html')) {
        toggleSection('mision');
    }
});

// Function to toggle mission and vision sections
function toggleSection(section) {
    const mision = document.querySelector('.mision');
    const vision = document.querySelector('.vision');

    if (section === 'mision') {
        vision.classList.add('hidden'); // Oculta visión
        mision.classList.remove('hidden'); // Muestra misión
    } else if (section === 'vision') {
        mision.classList.add('hidden'); // Oculta misión
        vision.classList.remove('hidden'); // Muestra visión
    }
}

