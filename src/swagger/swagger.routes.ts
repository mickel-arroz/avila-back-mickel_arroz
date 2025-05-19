/**
 * @swagger
 * components:
 *   securitySchemes:
 *     apiAuth:
 *       type: apiKey
 *       in: header
 *       name: token
 *
 *   schemas:
 *     RegisterRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: newuser@example.com
 *         password:
 *           type: string
 *           minLength: 6
 *           example: SecurePass123
 *
 *     LoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: existinguser@example.com
 *         password:
 *           type: string
 *           example: Secret456
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         token:
 *           type: string
 *           description: JWT para autenticación en cabecera
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: existinguser@example.com
 *             role:
 *               type: string
 *               example: user
 *
 *     User:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         role:
 *           type: string
 *           example: user
 *
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         errorType:
 *           type: string
 *           example: VALIDATION_ERROR
 *         message:
 *           type: string
 *           example: Detalle del error
 *         details:
 *           type: object
 *
 *     AuthResponseWithCookie:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *               format: email
 *               example: existinguser@example.com
 *             role:
 *               type: string
 *               example: user
 *       description: El token JWT se envía en la cookie HTTP-only bajo la clave `token`
 *
 *     Product:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           example: 66435dddfc13ae6a5d000001
 *         name:
 *           type: string
 *           example: Smartphone Pro
 *         description:
 *           type: string
 *           example: Teléfono inteligente de última generación
 *         price:
 *           type: number
 *           example: 599.99
 *         stock:
 *           type: integer
 *           example: 25
 *
 *     CreateProductRequest:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - price
 *         - stock
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphone Pro
 *         description:
 *           type: string
 *           example: Teléfono inteligente de última generación
 *         price:
 *           type: number
 *           example: 599.99
 *         stock:
 *           type: integer
 *           example: 25
 *
 *     UpdateProductRequest:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: Smartphone Pro Max
 *         description:
 *           type: string
 *           example: Nueva generación con mejoras
 *         price:
 *           type: number
 *           example: 699.99
 *         stock:
 *           type: integer
 *           example: 30
 *
 *     ProductListResponse:
 *       type: array
 *       items:
 *         $ref: '#/components/schemas/Product'
 *
 *     Order:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         user:
 *           type: string
 *         items:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               product:
 *                 type: string
 *               quantity:
 *                 type: integer
 *         status:
 *           type: string
 *           enum: [pendiente, procesado, enviado, entregado, cancelado]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
