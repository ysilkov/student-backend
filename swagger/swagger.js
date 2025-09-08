const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Management API',
      version: '1.0.0',
      description: 'API для управління обліком факультативних занять студентів',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Локальний сервер'
      }
    ],
    components: {
      schemas: {
        Student: {
          type: 'object',
          required: ['firstName', 'lastName'],
          properties: {
            id: {
              type: 'string',
              description: 'ID студента (автоматично генерується)'
            },
            firstName: {
              type: 'string',
              description: 'Ім\'я студента'
            },
            lastName: {
              type: 'string',
              description: 'Прізвище студента'
            },
            middleName: {
              type: 'string',
              description: 'По батькові студента'
            },
            address: {
              type: 'string',
              description: 'Адреса проживання'
            },
            phone: {
              type: 'string',
              description: 'Номер телефону'
            }
          },
          example: {
            firstName: 'Іван',
            lastName: 'Петренко',
            middleName: 'Олександрович',
            address: 'Київ, вул. Шевченка, 15',
            phone: '0987654321'
          }
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [{
      bearerAuth: []
    }]
  },
  apis: ['./routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);

module.exports = swaggerDocs;