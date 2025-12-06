// API base URL
const API_BASE_URL = 'http://localhost:3000/api/tasks';

// DOM elements
const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const taskList = document.getElementById('taskList');
const errorContainer = document.getElementById('errorContainer');

// Load tasks when page loads
document.addEventListener('DOMContentLoaded', loadTasks);

// Add task form submission
taskForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = taskInput.value.trim();
    if (!title) return;
    
    try {
        await addTask(title);
        taskInput.value = '';
        clearError();
    } catch (error) {
        showError('Failed to add task: ' + error.message);
    }
});

// Function to load all tasks
async function loadTasks() {
    try {
        showLoading();
        const response = await fetch(API_BASE_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        showError('Failed to load tasks: ' + error.message);
    }
}

// Function to add a new task
async function addTask(title) {
    const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add task');
    }
    
    const newTask = await response.json();
    loadTasks(); // Reload tasks to include the new one
}

// Function to update a task
async function updateTask(id, completed) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed })
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update task');
    }
    
    const updatedTask = await response.json();
    loadTasks(); // Reload tasks to reflect the update
}

// Function to delete a task
async function deleteTask(id) {
    const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE'
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete task');
    }
    
    loadTasks(); // Reload tasks to reflect the deletion
}

// Function to render tasks to the DOM
function renderTasks(tasks) {
    taskList.innerHTML = '';
    
    if (tasks.length === 0) {
        taskList.innerHTML = '<li class="loading">No tasks found. Add a new task to get started!</li>';
        return;
    }
    
    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            updateTask(task.id, checkbox.checked);
        });
        
        const titleSpan = document.createElement('span');
        titleSpan.className = `task-title ${task.completed ? 'completed' : ''}`;
        titleSpan.textContent = task.title;
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(task.id);
            }
        });
        
        li.appendChild(checkbox);
        li.appendChild(titleSpan);
        li.appendChild(deleteBtn);
        
        taskList.appendChild(li);
    });
}

// Show loading message
function showLoading() {
    taskList.innerHTML = '<li class="loading">Loading tasks...</li>';
}

// Show error message
function showError(message) {
    errorContainer.innerHTML = `<div class="error">${message}</div>`;
}

// Clear error message
function clearError() {
    errorContainer.innerHTML = '';
}