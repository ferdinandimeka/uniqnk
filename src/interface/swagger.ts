import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Uniqnk API',
            version: '1.0.0',
            description: 'API documentation for Uniqnk application',
        },
    },
    apis: ['./src/interface/routes/*.ts'], // Path to the API docs
};

const swaggerSpec = swaggerJsDoc(options);
const swaggerUiOptions = {
    explorer: true,
};
/**
 * Sets up Swagger UI for the Express application.
 * @param {Express} app - The Express application instance.
 */
function setupSwagger(app: Express) {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
    app.get('/api-docs.json', (req, res) => {
        res.setHeader('Content-Type', 'application/json');
        res.send(swaggerSpec);
    });
}
export { setupSwagger };