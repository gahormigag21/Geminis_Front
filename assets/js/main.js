// Cargar componentes comunes
const loadComponent = async (id, file, userName = null) => {
    const element = document.getElementById(id);
    if (element) {
        try {
            const response = await fetch(`../components/${file}`);
            if (!response.ok) throw new Error(`No se pudo cargar el archivo ${file}`);
            const html = await response.text();
            element.innerHTML = html;
            const userToken = localStorage.getItem("userToken");
            // Si el archivo es nav.html y tenemos un userName, actualizar el enlace
            if (id === 'nav' && userName) {
                const enlace = document.getElementById("userName");
                if (enlace) {
                    enlace.textContent = userName;
                    enlace.href = "./profile.html";
                }
            }
             
            if (!userToken && id === 'footer') {
                const footerElement = document.querySelector(".footer-container");
                if (footerElement ) {
                    const elementsToHide = footerElement.querySelectorAll(".hide-on-login");
                    elementsToHide.forEach((e) => {
                        e.style.display = "none";
                    });
                }

            }
            if (!userToken) {
                if (id === 'nav') {
                    console.log("No hay sesión activa");
                    const user = document.querySelector(".dropdown");
                    const home = document.querySelector(".inicio");
                    user.style.display = "none";
                    home.innerText = "Iniciar sesión";
                    home.href = "./login.html";
                    
                }
            }

        } catch (error) {
            console.error(`Error cargando el componente ${file}:`, error);
        }
    }
};

// Usuario y documento
const userName = localStorage.getItem('nombre');
const userDocument = localStorage.getItem('documento');
// console.log(userName, userDocument);

// Cargar Nav y Footer
document.addEventListener("DOMContentLoaded", () => {
    loadComponent('nav', 'nav.html', userName);
    loadComponent('footer', 'footer.html');

});


