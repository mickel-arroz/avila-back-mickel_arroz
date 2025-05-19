<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
</head>
<body>
  <h1>Prueba Técnica - API REST de Comercio Electrónico</h1>
  <p>API REST escalable para una plataforma de comercio electrónico ficticia, implementada con Node.js, Express y MongoDB.</p>

  <h2>✨ Características Principales</h2>
  <ul>
    <li>Autenticación JWT segura con roles y controles de acceso</li>
    <li>Gestión completa de productos (CRUD) con atributos como nombre, descripción, precio y stock</li>
    <li>Procesamiento de pedidos con historial por usuario y estado de pedido</li>
    <li>Paginación optimizada para grandes volúmenes de datos</li>
    <li>Documentación interactiva con Swagger UI</li>
  </ul>

  <h2>🧩 Tecnologías Utilizadas</h2>
  <ul>
    <li><strong>Backend:</strong> Node.js + Express</li>
    <li><strong>Base de Datos:</strong> MongoDB (Mongoose ODM)</li>
    <li><strong>Autenticación:</strong> JWT + Bcrypt.js</li>
    <li><strong>Documentación:</strong> Swagger</li>
    <li><strong>Validación:</strong> Zod</li>
    <li><strong>Herramientas:</strong> TypeScript, Nodemon, Dotenv</li>
  </ul>

  <h2>🚀 Inicio Rápido</h2>
  <pre><code>git clone https://github.com/mickel-arroz/avila-back-mickel_arroz.git 
cd practice-backend-avila
npm install</code></pre>

  <h3>🔧 Configuración</h3>
  <p>Crea un archivo <code>.env</code> con:</p>
  <pre><code>PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://user:password@cluster0.mlvkern.mongodb.net/nombre_base_datos?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development</code></pre>

<h3>📌 Notas Importantes:</h3>
<ul>
  <li>El URI proporcionado es para MongoDB Atlas (Cloud). Reemplaza <code>user</code>, <code>password</code> y <code>nombre_base_datos</code> con tus credenciales reales.</li>
  <li>¡Nunca subas tu archivo <code>.env</code> a repositorios públicos! Asegúrate de incluirlo en tu <code>.gitignore</code>.</li>
  <li>Para crear el JWT, puedes usar en la terminal de comandos:
<pre><code>node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"</code></pre>
</li>
</ul>

  <h3>▶️ Ejecución</h3>
  <pre><code>npm run dev  # Modo desarrollo
npm run build && npm start  # Producción</code></pre>

  <h2>📚 Documentación API</h2>
  <p>Accede a la documentación interactiva en:</p>
  <pre><code>http://localhost:3000/api/docs</code></pre>
  <p>Incluye ejemplos de solicitud/respuesta, requerimientos de autenticación y validaciones.</p>

  <h2>📦 Dependencias</h2>
  <h3>Producción</h3>
  <ul>
    <li>Express, Mongoose, JWT, Bcrypt.js, Zod, Swagger</li>
  </ul>
  <h3>Desarrollo</h3>
  <ul>
    <li>Typescript, Nodemon, @types/* para tipado</li>
  </ul>

  <h2>⚙️ Scripts Disponibles</h2>
  <ul>
    <li><code>npm run dev</code> - Inicia el servidor con Nodemon</li>
    <li><code>npm run build</code> - Compila TypeScript a dist/</li>
    <li><code>npm start</code> - Ejecuta la versión compilada</li>
  </ul>

  <h2>🔍 Elecciones de Diseño</h2>
  <ul>
    <li><strong>MongoDB:</strong> Escalabilidad horizontal y flexibilidad para datos semi-estructurados</li>
    <li><strong>JWT:</strong> Autenticación stateless ideal para APIs REST</li>
    <li><strong>Swagger:</strong> Documentación automática y mantenible</li>
    <li><strong>Zod:</strong> Validación de datos en tiempo de ejecución con tipado TypeScript</li>
  </ul>

  <h2>🔐 Manejo de Errores</h2>
  <p>Respuestas estructuradas con:</p>
  <pre><code>{
  "error": {
    "code": 400,
    "message": "Descripción del error",
    "details": "Información adicional"
  }
}</code></pre>
  <p>Escenarios manejados: autenticación fallida, stock insuficiente, validación de entrada.</p>

  <h2>📄 Licencia</h2>
  <p>ISC License</p>
  <p>Para más información: <a href="https://github.com/mickel-arroz/avila-back-mickel_arroz">Repositorio en GitHub</a></p>
</body>
</html>
