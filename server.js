const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Завантаження змінних середовища
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Імпорт маршрутів
const authRoutes = require('./routes/auth');
const studentRouter = require('./routes/students');
const subjectRouter = require('./routes/subjects');
const academicPlanRouter = require('./routes/academicPlans');
const authMiddleware = require('./middleware/auth'); // Middleware для автентифікації
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger/swagger'); // Імпорт Swagger документації




app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use('/api/auth', authRoutes);
// Захист маршрутів API за допомогою authMiddleware
app.use('/api/students', authMiddleware, studentRouter);
app.use('/api/subjects', authMiddleware, subjectRouter);
app.use('/api/academic-plans', authMiddleware, academicPlanRouter);

// Підключення до MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB successfully! 🎉');
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });