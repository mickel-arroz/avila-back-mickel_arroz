<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
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
    <li>Uso de transacciones MongoDB para mantener la coherencia de stock y pedidos</li>
    <li>Validaciones estrictas con Zod y control de errores estructurado</li>
    <li>Documentación interactiva con Swagger UI</li>
    <li>Compresión HTTP para respuestas más rápidas</li>
    <li>Pruebas unitarias con Jest y ts-jest para servicios y lógica crítica</li>
  </ul>

  <h2>🧩 Tecnologías Utilizadas</h2>
  <ul>
    <li><strong>Backend:</strong> Node.js + Express</li>
    <li><strong>Base de Datos:</strong> MongoDB (Mongoose ODM)</li>
    <li><strong>Autenticación:</strong> JWT + Bcrypt.js</li>
    <li><strong>Documentación:</strong> Swagger</li>
    <li><strong>Validación:</strong> Zod</li>
    <li><strong>Optimización:</strong> Compresión HTTP + Paginación</li>
    <li><strong>Pruebas:</strong> Jest + ts-jest (con cobertura de servicios)</li>
    <li><strong>Herramientas:</strong> TypeScript, Nodemon, Dotenv</li>
  </ul>

  <h2>🚀 Inicio Rápido</h2>
  <pre><code>git clone https://github.com/mickel-arroz/avila-back-mickel_arroz.git
cd practice-backend-avila
npm install</code></pre>

  <h3>🔧 Configuración</h3>
  <p>Crea un archivo <code>.env</code> con las siguientes variables:</p>
  <pre><code>PORT=3000
JWT_SECRET=your_jwt_secret
MONGO_URI=mongodb+srv://user:password@cluster0.mlvkern.mongodb.net/nombre_DB?retryWrites=true&w=majority&appName=Cluster0
NODE_ENV=development</code></pre>
  <p><strong>Nota:</strong> Reemplaza <code>user</code>, <code>password</code> y <code>nombre_base_datos</code> por tus credenciales reales.</p>
  <p><em>¡Nunca subas tu archivo <code>.env</code> a repositorios públicos! Inclúyelo en tu <code>.gitignore</code>.</em></p>
  <p>Para generar un secreto JWT seguro puedes usar:</p>
  <pre><code>node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"</code></pre>

  <h3>▶️ Ejecución</h3>
  <pre><code>npm run dev         # Modo desarrollo con Nodemon
npm run build       # Compila a producción
npm start           # Ejecuta la versión compilada
npm test            # Ejecuta pruebas unitarias con Jest</code></pre>

  <h2>📚 Documentación API</h2>
  <p>La documentación interactiva está disponible en:</p>
  <pre><code>http://localhost:3000/api/docs</code></pre>
  <p>Incluye ejemplos de solicitud/respuesta, requerimientos de autenticación y validaciones.</p>

  <h2>📦 Dependencias</h2>
  <h3>Producción</h3>
  <ul>
    <li>express, mongoose, jsonwebtoken, bcryptjs, zod</li>
    <li>swagger-jsdoc, swagger-ui-express</li>
    <li>compression, cookie-parser, cors, dotenv</li>
  </ul>
  <h3>Desarrollo</h3>
  <ul>
    <li>typescript, ts-node, nodemon</li>
    <li>jest, ts-jest, @types/* (tipado para librerías)</li>
  </ul>

  <h2>⚙️ Scripts Disponibles</h2>
  <ul>
    <li><code>npm run dev</code> - Inicia el servidor en modo desarrollo con recarga automática</li>
    <li><code>npm run build</code> - Compila TypeScript a JavaScript</li>
    <li><code>npm start</code> - Ejecuta la versión compilada en producción</li>
    <li><code>npm test</code> - Ejecuta todas las pruebas unitarias</li>
  </ul>

  <h2>🔍 Elecciones de Diseño y Buenas Prácticas</h2>
  <ul>
    <li><strong>MongoDB con Mongoose:</strong> Flexibilidad para datos semi-estructurados, soporta transacciones para garantizar la integridad de stock y pedidos.</li>
    <li><strong>Zod:</strong> Validación estricta de datos de entrada para evitar datos inválidos en la API.</li>
    <li><strong>JWT:</strong> Autenticación stateless con roles y permisos.</li>
    <li><strong>Compresión HTTP:</strong> Middleware <code>compression</code> para mejorar tiempos de respuesta.</li>
    <li><strong>Swagger:</strong> Documentación clara y mantenible directamente desde el código.</li>
    <li><strong>Manejo de errores estructurado:</strong> Respuestas claras y consistentes con código, mensaje y detalles.</li>
    <li><strong>Paginación:</strong> En endpoints de colección para rendimiento óptimo.</li>
    <li><strong>Pruebas unitarias:</strong> Servicios y lógica crítica testeada con Jest y mocks de modelos.</li>
  </ul>

  <h2>🛡️ Coherencia e Integridad de Datos</h2>
  <p>El sistema mantiene la integridad y coherencia de los datos mediante:</p>
  <ul>
    <li>Uso de transacciones para crear pedidos y actualizar stock en una sola operación atómica.</li>
    <li>Validación previa del stock disponible antes de aceptar pedidos.</li>
    <li>Devolución automática de stock si un pedido se cancela.</li>
    <li>Control estricto de estados válidos para pedidos.</li>
    <li>Validación robusta de entradas y manejo centralizado de errores.</li>
  </ul>

  <h2>🔐 Manejo de Errores</h2>
  <p>Los errores se devuelven en un formato estructurado:</p>
  <pre><code>{
  "error": {
    "code": 400,
    "message": "Descripción del error",
    "details": "Información adicional opcional"
  }
}</code></pre>
  <p>Escenarios manejados: usuario o producto no encontrado, stock insuficiente, validaciones de roles, contraseñas débiles, estados inválidos, etc.</p>

  <h2>🧪 Pruebas Unitarias</h2>
  <p>Los servicios y lógica crítica están cubiertos con Jest y ts-jest:</p>
  <ul>
    <li>Se usan mocks de Mongoose para aislar la lógica de base de datos</li>
    <li>Se testea la lógica de negocio, validaciones y manejo de errores</li>
    <li>Las pruebas se ejecutan con <code>npm test</code></li>
  </ul>

  <h2>📄 Licencia</h2>
  <p>ISC License</p>
  <p>Para más información y contribuciones, visita el <a href="https://github.com/mickel-arroz/avila-back-mickel_arroz">repositorio en GitHub</a>.</p>
</body>
</html>
