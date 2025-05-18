import { connectDB } from './database/mongo.connection';
import app from './app';

const PORT = process.env.PORT || 3000;

// Conectar a MongoDB antes de iniciar el servidor
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
});