const express = require('express');
const fs = require('fs');
const bcrypt = require('bcrypt');
const app = express();
const path = require('path');

const usuariosFilePath = 'usuarios.json';

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function getCurrentTime() {
  const date = new Date();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/registro', (req, res) => {
  const { usuario, correo, contraseña } = req.body;
  const fechaCreacion = new Date().toLocaleDateString();
  const horaCreacion = getCurrentTime();

  const validChars = /^[A-Za-z0-9]+$/;
  if (usuario.length > 30 || !validChars.test(usuario) || usuario.includes('ñ')) {
    res.status(400).send('Nombre de usuario inválido');
    return;
  }

  const saltRounds = 10;
  bcrypt.hash(contraseña, saltRounds, (err, hash) => {
    if (err) {
      res.status(500).send('Error en el servidor');
    } else {
      const nuevoUsuario = { usuario, fechaCreacion, horaCreacion, correo, contraseña: hash, permisos: 'none' };

      fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
        if (err) {
          fs.writeFileSync(usuariosFilePath, JSON.stringify([nuevoUsuario], null, 2));
          res.status(200).send('Registro exitoso');
          console.log('Nuevo usuario:', usuario, fechaCreacion, horaCreacion);
        } else {
          const usuarios = JSON.parse(data);
          const correoExistente = usuarios.find(u => u.correo === correo);
          const usuarioExistente = usuarios.find(u => u.usuario === usuario);

          if (correoExistente) {
            res.status(400).send('El correo ya está registrado');
          } else if (usuarioExistente) {
            res.status(400).send('El nombre de usuario ya existe');
          } else {
            usuarios.push(nuevoUsuario);
            fs.writeFileSync(usuariosFilePath, JSON.stringify(usuarios, null, 2));
            res.status(200).send('Registro exitoso');
            console.log('Nuevo usuario:', usuario, fechaCreacion, horaCreacion);
          }
        }
      });
    }
  });
});

app.post('/inicio-sesion', (req, res) => {
  const { usuario, contraseña } = req.body;

  fs.readFile(usuariosFilePath, 'utf8', (err, data) => {
    if (err) {
      res.status(500).send('Error en el servidor');
    } else {
      const usuarios = JSON.parse(data);
      const usuarioEncontrado = usuarios.find(u => u.usuario === usuario);

      if (usuarioEncontrado) {
        bcrypt.compare(contraseña, usuarioEncontrado.contraseña, (err, result) => {
          if (result) {
            const horaInicioSesion = getCurrentTime();
            console.log(`Usuario ${usuario} inició sesión a las ${horaInicioSesion}`);
            res.status(200).send('Inicio de sesión exitoso');
          } else {
            res.status(401).send('Credenciales inválidas');
          }
        });
      } else {
        res.status(401).send('Credenciales inválidas');
      }
    }
  });
});

app.listen(3000, () => {
  console.log('Servidor en funcionamiento en el puerto 3000');
});
