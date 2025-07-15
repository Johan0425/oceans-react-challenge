/**
 * Generates the Swagger specification for the Oceans API using swagger-jsdoc.
 *
 * @constant
 * @type {swaggerJsdoc.Options}
 * @property {object} definition - The OpenAPI specification definition.
 * @property {string} definition.openapi - The OpenAPI version being used (3.0.0).
 * @property {object} definition.info - Metadata about the API.
 * @property {string} definition.info.title - The title of the API.
 * @property {string} definition.info.version - The version of the API.
 * @property {string} definition.info.description - A brief description of the API.
 * @property {Array<object>} definition.servers - List of server configurations.
 * @property {string} definition.servers[].url - The base URL of the server.
 * @property {string} definition.servers[].description - A description of the server.
 * @property {object} definition.components - Components used in the API.
 * @property {object} definition.components.securitySchemes - Security schemes for the API.
 * @property {object} definition.components.securitySchemes.bearerAuth - Bearer authentication scheme.
 * @property {string} definition.components.securitySchemes.bearerAuth.type - The type of security scheme (http).
 * @property {string} definition.components.securitySchemes.bearerAuth.scheme - The scheme name (bearer).
 * @property {string} definition.components.securitySchemes.bearerAuth.bearerFormat - The format of the bearer token (JWT).
 * @property {Array<object>} definition.security - Security requirements for the API.
 * @property {Array<string>} definition.security[].bearerAuth - Specifies the bearerAuth security scheme.
 * @property {Array<string>} apis - Glob pattern to locate API route files for documentation.
 *
 * @constant
 * @type {object}
 * @default
 * @exports swaggerSpec
 */

import swaggerJsdoc from 'swagger-jsdoc';


const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Oceans API', // Cambia esto según tu proyecto
      version: '1.0.0',
      description: 'Documentación de la API para Oceans React Challenge',
    },
    servers: [
      {
        url: 'http://localhost:3001', // Cambia esto según tu configuración
        description: 'Servidor local',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts'], // Cambia esto según la ubicación de tus archivos de rutas
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;