const apiUrl = "http://localhost:3000/tickets";
const taskList = document.getElementById("taskList");
const taskForm = document.getElementById("taskForm");
const showFormBtn = document.getElementById("showFormBtn");

// Fetch task tickets from JSON-server
async function fetchTasks() {
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const tasks = await response.json();
    displayTasks(tasks);
  } catch (error) {
    console.error("Fetch error:", error);
    displayError("Failed to fetch tasks. Please try again.");
  }
}

// Display task tickets in the table
function displayTasks(tasks) {
  taskList.innerHTML = "";
  tasks.forEach((task) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.title}</td>
      <td>${task.description}</td>
      <td>${task.status}</td>
      <td>${new Date(task.dueDate).toLocaleString()}</td>
      <td>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </td>
    `;
    taskList.appendChild(row);
  });
}

// Show form to add new task
showFormBtn.addEventListener("click", () => {
  taskForm.classList.toggle("hidden");
});

// Event listener for form submission (Add or Edit task)
taskForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const status = document.getElementById("status").value;
  const dueDate = document.getElementById("dueDate").value;

  const formData = { title, description, status, dueDate };

  try {
    let response;
    const taskId = document.getElementById("taskId").value;
    if (taskId) {
      // Edit existing task
      response = await fetch(`${apiUrl}/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    } else {
      // Add new task
      response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
    }

    if (!response.ok) {
      throw new Error("Task could not be saved");
    }

    // Clear form and fetch updated tasks
    taskForm.reset();
    taskForm.classList.add("hidden");
    fetchTasks();
  } catch (error) {
    console.error("Save error:", error);
    displayError("Failed to save task. Please try again.");
  }
});

// Function to edit task details
async function editTask(id) {
  try {
    const response = await fetch(`${apiUrl}/${id}`);
    if (!response.ok) {
      throw new Error("Task not found");
    }
    const task = await response.json();

    // Populate form with task details for editing
    document.getElementById("taskId").value = task.id;
    document.getElementById("title").value = task.title;
    document.getElementById("description").value = task.description;
    document.getElementById("status").value = task.status;
    document.getElementById("dueDate").value = task.dueDate;

    taskForm.classList.remove("hidden");
  } catch (error) {
    console.error("Edit error:", error);
    displayError("Failed to fetch task details for editing. Please try again.");
  }
}

// Function to delete task
async function deleteTask(id) {
  if (confirm("Are you sure you want to delete this task?")) {
    try {
      const response = await fetch(`${apiUrl}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Task could not be deleted");
      }
      fetchTasks();
    } catch (error) {
      console.error("Delete error:", error);
      displayError("Failed to delete task. Please try again.");
    }
  }
}

// Display error message
function displayError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.textContent = message;
  errorDiv.classList.add("error");
  taskList.appendChild(errorDiv);
  setTimeout(() => {
    errorDiv.remove();
  }, 3000);
}

// Initial fetch of tasks
fetchTasks();
