const form = document.getElementById('create-form');
const errorMessage = document.getElementById('error-message');
const tipoSelect = document.getElementById('tipo');
const usuarioFields = document.getElementById('usuario-fields');
const restauranteFields = document.getElementById('restaurante-fields');
const goToLogin = document.getElementById('go-to-login');

const esAdminSelect = document.getElementById('es-admin');
const adminNitContainer = document.getElementById('admin-nit');
const nitRestauranteSelect = document.getElementById('nit-restaurante');

const verificationModal = document.getElementById('verificationModal');
const verificationCodeInput = document.getElementById('verificationCode');
const verifyCodeBtn = document.getElementById('verifyCodeBtn');
const verificationError = document.getElementById('verificationError');

const closeVerificationModal = document.getElementById('closeVerificationModal');

closeVerificationModal.addEventListener('click', () => {
    verificationModal.style.display = 'none';
});

// Mostrar/Ocultar campos según el tipo seleccionado
tipoSelect.addEventListener('change', () => {
    if (tipoSelect.value === 'usuario') {
        usuarioFields.style.display = 'block';
        restauranteFields.style.display = 'none';

        // Activar campos de usuario
        usuarioFields.querySelectorAll('input').forEach(input => input.required = true);
        restauranteFields.querySelectorAll('input, textarea, select').forEach(input => input.required = false);

    } else if (tipoSelect.value === 'restaurante') {
        usuarioFields.style.display = 'none';
        restauranteFields.style.display = 'block';

        // Activar campos de restaurante
        usuarioFields.querySelectorAll('input').forEach(input => input.required = false);
        restauranteFields.querySelectorAll('input, textarea, select').forEach(input => input.required = true);
    }
});

// Convertir ArrayBuffer a base64
function arrayBufferToBase64(buffer) {
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

// Enviar datos al backend
form.addEventListener('submit', async (event) => {
    event.preventDefault();
    errorMessage.textContent = '';

    const formData = new FormData(form);
    const body = {};
    formData.forEach((value, key) => {
        if (key === 'documento' || key === 'nit') {
            body[key] = parseInt(value, 10);
        } else {
            body[key] = value;
        }
    });

    if (formData.get('logo') && tipoSelect.value === 'restaurante') {
        const logoFile = formData.get('logo');
        const logoFormData = new FormData();
        logoFormData.append('image', logoFile);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?&key=b15f59e3b69de9b1198771b85354d22b', {
                method: 'POST',
                body: logoFormData
            });
            const result = await response.json();
            if (result.success) {
                body.UbicacionLogo = result.data.url;
                await sendFormData(body);
            } else {
                alert('Failed to upload logo.');
            }
        } catch (error) {
            console.error('Error uploading logo:', error);
            alert('Error uploading logo.');
        }
    } else {
        await sendVerificationCode(body);
    }
});

async function sendVerificationCode(body) {
    try {
        const response = await fetch(`${configURL1.baseUrl}/api/auth/send-verification-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: body.correo }),
        });

        if (!response.ok) {
            throw new Error('Error al enviar el código de verificación');
        }

        verificationModal.style.display = 'flex';
        verifyCodeBtn.onclick = () => verifyCode(body);
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

async function verifyCode(body) {
    try {
        const code = verificationCodeInput.value;
        const response = await fetch(`${configURL1.baseUrl}/api/auth/verify-code`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo: body.correo, code }),
        });

        if (!response.ok) {
            throw new Error('Código de verificación incorrecto');
        }

        await sendFormData(body);
    } catch (error) {
        verificationError.textContent = error.message;
    }
}

async function sendFormData(body) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/auth/register`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(body),
        });

        if (!response.ok) {
            console.log(response.error);
            throw new Error('Error al crear usuario o restaurante');
        }

        const data = await response.json();
        alert(data.message);
        form.reset();
        window.location.href = 'login.html';
    } catch (error) {
        errorMessage.textContent = error.message;
    }
}

goToLogin.addEventListener('click', () => {
    window.location.href = 'login.html';
});

// Mostrar/Ocultar campos de administrador según la selección
esAdminSelect.addEventListener('change', () => {
    if (esAdminSelect.value === 'si') {
        adminNitContainer.style.display = 'block';
        nitRestauranteSelect.required = true;
    } else {
        adminNitContainer.style.display = 'none';
        nitRestauranteSelect.required = false;
    }
});

// Cargar NITs de restaurantes desde el backend
const cargarNITsRestaurantes = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${configURL1.baseUrl}/api/restaurantes/nits`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
            throw new Error('Error al cargar NITs de restaurantes');
        }

        const nits = await response.json();
        nitRestauranteSelect.innerHTML = '<option value="">Seleccione un NIT</option>';
        nits.forEach(nit => {
            const option = document.createElement('option');
            option.value = nit;
            option.textContent = nit;
            nitRestauranteSelect.appendChild(option);
        });
    } catch (error) {
        console.error(error.message);
    }
};

// Llamar a cargarNITsRestaurantes al cargar la página
window.addEventListener('DOMContentLoaded', cargarNITsRestaurantes);

document.getElementById('terms-link').addEventListener('click', (event) => {
    event.preventDefault();
    document.getElementById('termsModal').style.display = 'flex';
});

document.getElementById('closeTermsBtn').addEventListener('click', () => {
    document.getElementById('termsModal').style.display = 'none';
});

// Validación de contraseña
document.getElementById('contrasena').addEventListener('input', function() {
    const passwordField = document.getElementById('contrasena');
    const passwordStrength = document.getElementById('password-strength');
    if (passwordField.value.length > 0) {
        const strength = getPasswordStrength(passwordField.value);
        passwordStrength.textContent = `Nivel de seguridad: ${strength}`;
        passwordStrength.style.color = getStrengthColor(strength);
    } else {
        passwordStrength.textContent = '';
    }
});

document.getElementById('create-form').addEventListener('submit', function(event) {
    const password = document.getElementById('contrasena').value;
    const strength = getPasswordStrength(password);
    if (strength !== 'Muy Fuerte') {
        event.preventDefault();
        document.getElementById('error-message').textContent = 'La contraseña debe tener letras mayúsculas, minúsculas, números y caracteres especiales.';
    }
});

function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-ZÑÁÉÍÓÚÜ]/.test(password)) strength++;
    if (/[a-zñáéíóúü]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return ['Muy Débil', 'Débil', 'Moderada', 'Fuerte', 'Muy Fuerte','Muy Fuerte'][strength];
}

function getStrengthColor(strength) {
    switch (strength) {
        case 'Muy Débil': return 'red';
        case 'Débil': return 'orange';
        case 'Moderada': return 'orange';
        case 'Fuerte': return 'lightgreen';
        case 'Muy Fuerte': return 'green';
        default: return 'black';
    }
}