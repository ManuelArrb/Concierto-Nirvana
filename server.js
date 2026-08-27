const express = require('express');
const fs = require('fs');
const path = require('path');
const QRCode = require('qrcode');

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

// Generar el QR de un registro
app.get('/api/registro/:id/qr', async (req, res) => {
  const registros = leerRegistros();
  const registro = registros.find(r => r.id === req.params.id);

  if (!registro) {
    return res.status(404).send('Registro no encontrado');
  }

  const urlValidacion = `${req.protocol}://${req.get('host')}/validar/${registro.id}`;

  try {
    const qrImage = await QRCode.toBuffer(urlValidacion);
    res.type('png');
    res.send(qrImage);
  } catch (error) {
    res.status(500).send('No se pudo generar el QR');
  }
});

// Validar un ticket al escanear el QR
app.get('/validar/:id', (req, res) => {
  const registros = leerRegistros();
  const registro = registros.find(r => r.id === req.params.id);

  if (!registro) {
    return res.send('<h1>❌ Ticket no válido</h1>');
  }

  if (registro.usado) {
    return res.send(`<h1>⚠️ Este ticket ya fue usado</h1><p>${registro.nombre}</p>`);
  }

  registro.usado = true;
  guardarRegistros(registros);

  res.send(`<h1>✅ Ticket válido</h1><p>Bienvenido, ${registro.nombre}</p>`);
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});