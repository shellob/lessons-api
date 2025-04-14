import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc'

export function setupSwagger(app: Express): void {
  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Lessons API',
        version: '1.0.0',
        description: 'API documentation for Lessons API',
      },
    },
    apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
  };

  const specs = swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}
