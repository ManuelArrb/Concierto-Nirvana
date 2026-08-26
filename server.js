const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'registros.json');

app.use(express.static('public'));
app.use(express.json());

function leerRegistros() {
  const contenido = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(contenido);
}

function guardarRegistros(registros) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(registros, null, 2));
}

app.post('/api/registro', (req, res) => {
  const { nombre, correo } = req.body;

  if (!nombre || !correo) {
    return res.status(400).json({ error: 'Nombre y correo son obligatorios' });
  }

  const registros = leerRegistros();
  const nuevoRegistro = {
    id: Date.now().toString(),
    nombre,
    correo,
    usado: false
  };

  registros.push(nuevoRegistro);
  guardarRegistros(registros);

  res.status(201).json(nuevoRegistro);
});

app.get('/api/registro/:id', (req, res) => {
  const registros = leerRegistros();
  const registro = registros.find(r => r.id === req.params.id);

  if (!registro) {
    return res.status(404).json({ error: 'Registro no encontrado' });
  }

  res.json(registro);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});