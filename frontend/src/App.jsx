
import { useEffect, useState } from "react";

const API = "http://localhost:5000/employees";

export default function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    department: "",
    salary: "",
  });
  const [editId, setEditId] = useState(null);

  // Fetch employees
  async function getEmployees() {
    const res = await fetch(API);
    setEmployees(await res.json());
  }

  useEffect(() => {
    getEmployees();
  }, []);

  // Handle input changes
  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Add or update employee
  async function handleSubmit(e) {
    e.preventDefault();

    await fetch(editId ? `${API}/${editId}` : API, {
      method: editId ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        salary: Number(form.salary),
      }),
    });

    setForm({ name: "", email: "", department: "", salary: "" });
    setEditId(null);
    getEmployees();
  }

  // Edit employee
  function handleEdit(employee) {
    setForm({
      name: employee.name,
      email: employee.email,
      department: employee.department,
      salary: employee.salary,
    });
    setEditId(employee._id);
  }

  // Delete employee
  async function handleDelete(id) {
    await fetch(`${API}/${id}`, { method: "DELETE" });
    getEmployees();
  }

  return (
    <div style={{ maxWidth: "700px", margin: "30px auto" }}>
      <h1>Employee Management</h1>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          name="department"
          placeholder="Department"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          name="salary"
          type="number"
          placeholder="Salary"
          value={form.salary}
          onChange={handleChange}
          required
        />

        <button type="submit">
          {editId ? "Update" : "Add"} Employee
        </button>

        {editId && (
          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                email: "",
                department: "",
                salary: "",
              });
              setEditId(null);
            }}
          >
            Cancel
          </button>
        )}
      </form>

      <h2>Employee List</h2>

      {employees.map((employee) => (
        <div key={employee._id} style={{ marginBottom: "15px" }}>
          <strong>{employee.name}</strong>
          <p>
            {employee.email} | {employee.department} | ₹{employee.salary}
          </p>

          <button onClick={() => handleEdit(employee)}>Edit</button>
          <button onClick={() => handleDelete(employee._id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
