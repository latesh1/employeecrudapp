
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Employee = require("./models/Employee");

const app = express();

app.use(cors());
app.use(express.json());

// Get all employees
app.get("/employees", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Add employee
app.post("/employees", async (req, res) => {
  const employee = await Employee.create(req.body);
  res.json(employee);
});

// Update employee
app.put("/employees/:id", async (req, res) => {
  const employee = await Employee.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(employee);
});

// Delete employee
app.delete("/employees/:id", async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: "Employee deleted" });
});

mongoose.connect(process.env.MONGO_URI).then(() => {
  console.log("MongoDB connected");

  app.listen(process.env.PORT || 5000, () => {
    console.log("Server running on port 5000");
  });
});
