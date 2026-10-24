const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

// Automatically catch errors in async route handlers
require('express-async-errors');

const app = express();

app
  .use(cors())
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
  .use('/', require('./routes'));

// Catch-all for 404 routes
app.use((req, res, next) => {
  const error = new Error('Route Not Found');
  error.status = 404;
  next(error);
});

// Mount the generic error handler at the end of the chain
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to the database!');
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
