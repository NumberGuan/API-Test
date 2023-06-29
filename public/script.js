function checkAvailability(inputField) {
  const errorMessage = document.getElementById('error-message');
  const value = inputField.value;
  const validChars = /^[A-Za-z0-9]+$/;
  const availableBorderColor = 'green';
  const unavailableBorderColor = 'red';

  fetch('usuarios.json')
    .then(response => response.json())
    .then(existingUsers => {
      if (inputField.name === 'usuario') {
        if (existingUsers.some(user => user.usuario === value)) {
          inputField.style.borderColor = unavailableBorderColor;
          errorMessage.textContent = 'Nombre de usuario no disponible.';
          errorMessage.classList.add('error-text');
        } else if (value.length > 30 || !validChars.test(value) || value.includes('ñ')) {
          inputField.style.borderColor = unavailableBorderColor;
          errorMessage.textContent = value.length > 30 ? 'Limite de caracteres.' : 'Caracter inválido. Solo se permiten letras y números.';
          errorMessage.classList.add('error-text');
        } else {
          inputField.style.borderColor = availableBorderColor;
          errorMessage.textContent = '';
          errorMessage.classList.remove('error-text');
        }
      } else if (inputField.name === 'correo') {
        if (existingUsers.some(user => user.correo === value)) {
          inputField.style.borderColor = unavailableBorderColor;
          errorMessage.textContent = 'Correo electrónico no disponible.';
          errorMessage.classList.add('error-text');
        } else {
          inputField.style.borderColor = availableBorderColor;
          errorMessage.textContent = '';
          errorMessage.classList.remove('error-text');
        }
      }
    })
    .catch(error => {
      console.error('Error al cargar los usuarios:', error);
    });
}
