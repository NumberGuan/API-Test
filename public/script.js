function checkAvailability(inputField) {
  const errorMessage = document.getElementById('error-message');
  const existingUsers = ["user1", "user2", "user3"];

  const value = inputField.value;
  const validChars = /^[A-Za-z0-9]+$/;

  if (inputField.name === 'usuario' && existingUsers.includes(value)) {
    inputField.classList.add('error');
    errorMessage.textContent = `El ${inputField.name} ya está en uso`;
  } else if (inputField.name === 'usuario' && (value.length > 30 || !validChars.test(value) || value.includes('ñ'))) {
    inputField.classList.add('error');
    errorMessage.textContent = 'Caracter inválido. Solo se permiten letras y números.';
  } else {
    inputField.classList.remove('error');
    errorMessage.textContent = '';
  }
}
