// ============================================
// To-Do List Application
// ============================================

// Get elements from HTML
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");

const totalTasks = document.getElementById("totalTasks");
const completedTasks = document.getElementById("completedTasks");
const remainingTasks = document.getElementById("remainingTasks");

const completeAllBtn = document.getElementById("completeAllBtn");
const clearCompletedBtn = document.getElementById("clearCompletedBtn");


// ============================================
// Store Tasks
// ============================================

// Try to load saved tasks from localStorage.
// If there are no saved tasks, use an empty array.
let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


// ============================================
// Save Tasks to localStorage
// ============================================

function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


// ============================================
// Display Tasks
// ============================================

function renderTasks() {

    // Remove the old task list before displaying it again
    taskList.innerHTML = "";

    // Show/hide empty message
    if (tasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    // Create HTML for every task
    tasks.forEach(function(task) {

        // Create list item
        const li = document.createElement("li");

        li.classList.add("task-item");

        // Add completed class if task is completed
        if (task.completed) {
            li.classList.add("completed");
        }


        // ====================================
        // Complete Button
        // ====================================

        const completeButton = document.createElement("button");

        completeButton.classList.add("complete-btn");

        completeButton.type = "button";

        completeButton.textContent = "✓";

        completeButton.setAttribute(
            "aria-label",
            task.completed
                ? "Mark task as incomplete"
                : "Mark task as complete"
        );


        // When complete button is clicked
        completeButton.addEventListener("click", function() {

            toggleTask(task.id);

        });


        // ====================================
        // Task Text
        // ====================================

        const taskText = document.createElement("span");

        taskText.classList.add("task-text");

        taskText.textContent = task.text;


        // ====================================
        // Delete Button
        // ====================================

        const deleteButton = document.createElement("button");

        deleteButton.classList.add("delete-btn");

        deleteButton.type = "button";

        deleteButton.textContent = "Delete";

        deleteButton.setAttribute(
            "aria-label",
            "Delete task"
        );


        // When delete button is clicked
        deleteButton.addEventListener("click", function(event) {

            // Stop the click from affecting the task itself
            event.stopPropagation();

            deleteTask(task.id);

        });


        // ====================================
        // Add Elements to Task
        // ====================================

        li.appendChild(completeButton);
        li.appendChild(taskText);
        li.appendChild(deleteButton);


        // ====================================
        // Right-Click Task Toggle
        // ====================================

        li.addEventListener("contextmenu", function(event) {

            // Prevent the browser's default right-click menu
            event.preventDefault();

            // Toggle completed state
            toggleTask(task.id);

        });


        // Add task to the task list
        taskList.appendChild(li);

    });


    // Update statistics
    updateStatistics();
}


// ============================================
// Add New Task
// ============================================

function addTask() {

    // trim() removes unnecessary spaces
    const text = taskInput.value.trim();


    // Prevent empty tasks
    if (text === "") {
        taskInput.focus();
        return;
    }


    // Create a new task object
    const newTask = {
        id: Date.now(),
        text: text,
        completed: false
    };


    // Add task to array
    tasks.push(newTask);


    // Save updated tasks
    saveTasks();


    // Display updated task list
    renderTasks();


    // Clear input field
    taskInput.value = "";

    // Put cursor back in input
    taskInput.focus();
}


// ============================================
// Toggle Task Completed State
// ============================================

function toggleTask(taskId) {

    // Find the task with matching ID
    const task = tasks.find(function(task) {
        return task.id === taskId;
    });


    // If task exists, reverse its completed state
    if (task) {

        task.completed = !task.completed;

        // Save updated state
        saveTasks();

        // Refresh task list
        renderTasks();
    }
}


// ============================================
// Delete Individual Task
// ============================================

function deleteTask(taskId) {

    // Keep every task except the selected one
    tasks = tasks.filter(function(task) {
        return task.id !== taskId;
    });


    // Save changes
    saveTasks();

    // Refresh list
    renderTasks();
}


// ============================================
// Complete All Tasks
// ============================================

function completeAllTasks() {

    tasks.forEach(function(task) {

        task.completed = true;

    });


    // Save changes
    saveTasks();

    // Refresh list
    renderTasks();
}


// ============================================
// Clear Completed Tasks
// ============================================

function clearCompletedTasks() {

    // Keep only incomplete tasks
    tasks = tasks.filter(function(task) {

        return !task.completed;

    });


    // Save changes
    saveTasks();

    // Refresh list
    renderTasks();
}


// ============================================
// Update Task Statistics
// ============================================

function updateStatistics() {

    // Total number of tasks
    const total = tasks.length;


    // Count completed tasks
    const completed = tasks.filter(function(task) {

        return task.completed;

    }).length;


    // Remaining = total - completed
    const remaining = total - completed;


    // Display statistics
    totalTasks.textContent = total;
    completedTasks.textContent = completed;
    remainingTasks.textContent = remaining;
}


// ============================================
// Button Events
// ============================================

// Add button
addTaskBtn.addEventListener("click", addTask);


// ============================================
// Enter Key
// ============================================

// Pressing Enter inside input adds the task
taskInput.addEventListener("keydown", function(event) {

    if (event.key === "Enter") {

        addTask();

    }

});


// ============================================
// Complete All Button
// ============================================

completeAllBtn.addEventListener(
    "click",
    completeAllTasks
);


// ============================================
// Clear Completed Button
// ============================================

clearCompletedBtn.addEventListener(
    "click",
    clearCompletedTasks
);


// ============================================
// Load Saved Tasks When Page Opens
// ============================================

// This displays tasks that were saved previously.
renderTasks();