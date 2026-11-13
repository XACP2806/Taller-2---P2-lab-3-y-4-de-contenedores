import express from 'express';

const PORT = process.env.PORT ?? 4000;
const CURSOS_URL = process.env.CURSOS_URL ?? 'http://localhost:3000';
const ESTUDIANTES_URL = process.env.ESTUDIANTES_URL
  ?? 'http://localhost:5000';

const app = express();

app.get('/', (_req, res) => {
  res.json({ servicio: 'reportes', estado: 'ok' });
});

async function consultar(url, servicio) {
  try {
    const respuesta = await fetch(url, {
      signal: AbortSignal.timeout(5000)
    });

    if (!respuesta.ok) {
      throw new Error(`HTTP ${respuesta.status}`);
    }

    const datos = await respuesta.json();

    if (!Array.isArray(datos)) {
      throw new Error('Respuesta inesperada');
    }

    return datos;
  } catch {
    throw new Error(`El servicio de ${servicio} no responde`);
  }
}

app.get('/resumen', async (_req, res) => {
  try {
    const [cursos, estudiantes] = await Promise.all([
      consultar(`${CURSOS_URL}/cursos`, 'cursos'),
      consultar(`${ESTUDIANTES_URL}/estudiantes`, 'estudiantes')
    ]);

    const totalCreditos = cursos.reduce(
      (suma, curso) => suma + curso.creditos,
      0
    );

    res.json({
      totalCursos: cursos.length,
      totalCreditos,
      totalEstudiantes: estudiantes.length,
      generado: new Date().toISOString()
    });
  } catch (error) {
    res.status(503).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Servicio reportes escuchando en el puerto ${PORT}`);
});