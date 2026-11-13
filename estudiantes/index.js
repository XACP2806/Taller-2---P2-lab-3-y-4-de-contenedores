import express from 'express';

const PORT = process.env.PORT ?? 5000;
const app = express();

const estudiantes = [
  { id: 1, nombre: 'Ana' },
  { id: 2, nombre: 'Luis' },
  { id: 3, nombre: 'Maria' }
];

app.get('/', (_req, res) => {
  res.json({ servicio: 'estudiantes', estado: 'ok' });
});

app.get('/estudiantes', (_req, res) => {
  res.json(estudiantes);
});

app.listen(PORT, () => {
  console.log(`Servicio estudiantes escuchando en el puerto ${PORT}`);
});