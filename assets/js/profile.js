const form = document.getElementById('profile-form');
const empresaContainer = document.getElementById('empresa-container');

// Función para cargar los datos del perfil
const loadProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/users/${userDocument}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) throw new Error('Error al cargar los datos del perfil');
        const data = await response.json();

        document.getElementById('documento').value = data.Documento;
        document.getElementById('nombres').value = data.Nombres;
        document.getElementById('apellido').value = data.Apellido;
        document.getElementById('telefono').value = data.Telefono;
        document.getElementById('direccion').value = data.Direccion;
        document.getElementById('contrasena').value = ''; // No cargues contraseñas directamente
        document.getElementById('correo').value = data.Correo;
        document.getElementById('autenticacionDosFactores').checked = data.AutenticacionDosFactores;

        // Mostrar empresa si existe
        if (data.Empresa) {
            document.getElementById('empresa').value = data.Empresa;
            empresaContainer.style.display = 'block';
        }
    } catch (error) {
        console.error(error.message);
    }
};

// Función para guardar cambios
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const updatedUser = {
        Documento: document.getElementById('documento').value,
        Nombres: document.getElementById('nombres').value,
        Apellido: document.getElementById('apellido').value,
        Telefono: document.getElementById('telefono').value,
        Direccion: document.getElementById('direccion').value,
        Correo: document.getElementById('correo').value,
        AutenticacionDosFactores: document.getElementById('autenticacionDosFactores').checked,
    };

    const contrasena = document.getElementById('contrasena').value;
    if (contrasena) {
        updatedUser.Contrasena = contrasena;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/users/${userDocument}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(updatedUser),
        });
        if (!response.ok) throw new Error('Error al actualizar el perfil');
        alert('Perfil actualizado exitosamente');
    } catch (error) {
        console.error(error.message);
        alert('Error al guardar los cambios');
    }
});

// Cargar el perfil al iniciar
loadProfile();