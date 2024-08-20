// Initial References
const newTaskInput = document.querySelector("#new-task input");
const tasksDiv = document.querySelector("#tasks");
let updateNote = "";
let count;

// Function on window load
window.onload = () => {
    updateNote = "";
    count = Object.keys(localStorage).length;
    displayTasks();
};

// Function to Display The Tasks
const displayTasks = () => {
    tasksDiv.innerHTML = "";

    let tasks = Object.keys(localStorage).sort();

    if (tasks.length > 0) {
        tasksDiv.style.display = "block";
    } else {
        tasksDiv.style.display = "none";
    }

    for (let key of tasks) {
        let taskInnerDiv = document.createElement("div");
        taskInnerDiv.classList.add("task");
        taskInnerDiv.setAttribute("id", key);

        let value;
        try {
            value = JSON.parse(localStorage.getItem(key));
        } catch (e) {
            console.error(`Error parsing JSON for key ${key}:`, e);
            continue; // Skip this task if JSON parsing fails
        }

        let completeButton = document.createElement("button");
        completeButton.classList.add("complete");
        completeButton.innerHTML = `<i class="fa-solid fa-check"></i>`;
        
        let taskText = document.createElement("span");
        taskText.innerText = key.split("_")[1];

        let editButton = document.createElement("button");
        editButton.classList.add("edit");
        editButton.innerHTML = `<i class="fa-solid fa-pen-to-square"></i>`;
        
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("delete");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash"></i>`;
        
        if (value) {
            taskInnerDiv.classList.add("completed");
        }

        taskInnerDiv.appendChild(completeButton);
        taskInnerDiv.appendChild(taskText);
        taskInnerDiv.appendChild(editButton);
        taskInnerDiv.appendChild(deleteButton);
        tasksDiv.appendChild(taskInnerDiv);

        completeButton.addEventListener("click", (e) => markTaskCompleted(e, key));
        editButton.addEventListener("click", (e) => editTask(e, key));
        deleteButton.addEventListener("click", (e) => deleteTask(e, key));
    }
};

// Function to mark a task as completed
const markTaskCompleted = (e, key) => {
    e.stopPropagation();
    let taskElement = document.getElementById(key);
    let taskName = key.split("_")[1];
    updateStorage(key.split("_")[0], taskName, true);
    taskElement.classList.add("completed");
};

// Function to edit a task
const editTask = (e, key) => {
    e.stopPropagation();
    disableButtons(true);
    let taskElement = document.getElementById(key);
    newTaskInput.value = key.split("_")[1];
    updateNote = key;
    taskElement.remove();
};

// Function to delete a task
const deleteTask = (e, key) => {
    e.stopPropagation();
    localStorage.removeItem(key);
    displayTasks();
};

// Disable all edit buttons while editing a task
const disableButtons = (bool) => {
    document.querySelectorAll(".edit").forEach(button => button.disabled = bool);
};

// Add tasks to local storage
const updateStorage = (index, taskValue, completed) => {
    localStorage.setItem(`${index}_${taskValue}`, JSON.stringify(completed));
    displayTasks();
};

// Add New Task
document.querySelector("#push").addEventListener("click", () => {
    disableButtons(false);

    if (newTaskInput.value.trim().length === 0) {
        alert("Please Enter A Task");
    } else {
        if (updateNote === "") {
            // Add a new task
            updateStorage(count, newTaskInput.value, false);
            count++;
        } else {
            // Update the existing task
            let existingCount = updateNote.split("_")[0];
            removeTask(updateNote);
            updateStorage(existingCount, newTaskInput.value, false);
            updateNote = "";
        }

        // Clear the input field immediately after adding or updating the task
        newTaskInput.value = "";

        // Display updated tasks
        displayTasks();
    }
});
