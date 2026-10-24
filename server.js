require('dotenv').config();
const express = require('express');
const path = require('path');
const contenido = require('./data/contenido.json');

const materialesRouter = require('./routes/materiales');
const contenidoRouter = require('./routes/contenido');
const rutasRouter = require('./routes/rutas');
const aliadosRouter = require('./routes/aliados');
const serviciosRouter = require('./routes/servicios');
const actividadesRouter = require('./routes/actividades');

const app = express();
const PORT = process.env.PORT || 4000;

// Archivos estáticos (HTML, CSS, JS del cliente, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// API con los datos del sitio
app.use('/api/materiales', materialesRouter);
app.use('/api/contenido', contenidoRouter);
app.use('/api/rutas', rutasRouter);
app.use('/api/aliados', aliadosRouter);
app.use('/api/servicios', serviciosRouter);
app.use('/api/actividades', actividadesRouter);

// Configuración de WhatsApp para que el frontend arme el link wa.me
app.get('/api/whatsapp-config', (req, res) => {
  const numeroConfigurado = process.env.WHATSAPP_NUMERO;
  const numero = numeroConfigurado
    ? numeroConfigurado.replace(/\D/g, '')
    : `57${contenido.telefono.replace(/\D/g, '')}`;

  res.json({
    numero,
    mensaje: process.env.WHATSAPP_MENSAJE || 'Hola, tengo una consulta'
  });
});

app.listen(PORT, () => {
  console.log(`Zona 10 corriendo en http://localhost:${PORT}`);
});