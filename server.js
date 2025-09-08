const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const authRoutes = require("./routes/auth");
const studentRouter = require("./routes/students");
const subjectRouter = require("./routes/subjects");
const academicPlanRouter = require("./routes/academicPlans");
const authMiddleware = require("./middleware/auth");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./swagger/swagger");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use("/api/auth", authRoutes);
app.use("/api/students", authMiddleware, studentRouter);
app.use("/api/subjects", authMiddleware, subjectRouter);
app.use("/api/academic-plans", authMiddleware, academicPlanRouter);

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB successfully! 🎉");
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
