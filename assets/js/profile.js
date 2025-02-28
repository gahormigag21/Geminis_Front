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

    // Validar campos
    const nombres = document.getElementById('nombres').value;
    const apellido = document.getElementById('apellido').value;
    const telefono = document.getElementById('telefono').value;
    const direccion = document.getElementById('direccion').value;
    const correo = document.getElementById('correo').value;
    const contrasena = document.getElementById('contrasena').value;

    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(nombres) || nombres.length > 100) {
        alert('Nombres inválidos');
        return;
    }
    if (!/^[A-Za-zñÑáéíóúÁÉÍÓÚ\s]+$/.test(apellido) || apellido.length > 100) {
        alert('Apellido inválido');
        return;
    }
    if (!/^\d{7,15}$/.test(telefono) || telefono.length > 15) {
        alert('Teléfono inválido');
        return;
    }
    if (direccion.length > 100) {
        alert('Dirección inválida');
        return;
    }
    if (!/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/.test(correo) || correo.length > 100) {
        alert('Correo inválido');
        return;
    }
    if (contrasena && contrasena.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return;
    }

    const updatedUser = {
        Documento: document.getElementById('documento').value,
        Nombres: nombres,
        Apellido: apellido,
        Telefono: telefono,
        Direccion: direccion,
        Correo: correo,
        AutenticacionDosFactores: document.getElementById('autenticacionDosFactores').checked,
    };

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