window.addEventListener("DOMContentLoaded", startTodos);

function startTodos() {
  addEventListeners();
  togglePopup();
  renderTodos();
  addTodo();
  generateUniqueId();
  updateTodo();
  deleteTodo();
  showTodoArrayLength();
}

let todos = [];

/**
 * This function lisen to "click" element for the buttons
 */
function addEventListeners() {
  const todoButton = document.getElementById("todoButton");
  todoButton.addEventListener("click", togglePopup);

  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", addTodo);
}

/**
 * This function show/hide the popup-window to create a todo
 */
function togglePopup() {
  const todoPopup = document.getElementById("todoPopup");
  const warning = document.getElementById("warning");
  const feedback = document.getElementById("feedback");

  todoPopup.classList.toggle("show-popup");
  warning.textContent = "";
  feedback.textContent = "";
}

/**
 * This function create a todo, if you don't fill in the input a warning text popup.
 * The todo saves in localStorage.
 */
function addTodo() {
  const todoInput = document.getElementById("todoInput");
  const dueDateInput = document.getElementById("dueDate");

  const todoText = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (todoText === "" || dueDate === "") {
    warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
    return;
  }
  const todo = {
    id: generateUniqueId(),
    text: todoText,
    date: dueDate,
  };

  todos.push(todo);

  saveToLocalStorage();
  renderTodos();
  showTodoArrayLength();

  todoInput.value = "";
  dueDateInput.value = "";
  warning.textContent = "";
  feedback.textContent = "";
}

/**
 * This function create a unique id för the todo.
 */
function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/** This function render a todo, it look in the todolist array and create a list, and two button: Save and Delete.*/
function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");

    const updateButton = document.createElement("button");
    updateButton.textContent = "Uppdatera";
    updateButton.onclick = () => renderInput(todo.id);
    updateButton.setAttribute("data-cy", "edit-todo-button");

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort";
    deleteButton.onclick = () => deleteTodo(todo.id);
    deleteButton.setAttribute("data-cy", "delete-todo-button");

    todoItem.innerHTML = `
      ${todo.text}${todo.date}
    `;

    todoList.appendChild(todoItem);
    todoList.appendChild(updateButton);
    todoList.appendChild(deleteButton);
  });
}

/**
 * This function render input element for text and date, if you need to update a todo.
 */
function renderInput() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");

    const saveButton = document.createElement("button");
    saveButton.textContent = "Spara";
    saveButton.onclick = () => updateTodo(todo.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort";
    deleteButton.onclick = () => deleteTodo(todo.id);

    todoItem.innerHTML = `
      ${todo.text}${todo.date}
      <input type="text" id="updateText_${todo.id}" placeholder="Uppdatera don todo..">
       <input type="date" id="updateDate_${todo.id}">
    `;

    todoList.appendChild(todoItem);
    todoList.appendChild(saveButton);
    todoList.appendChild(deleteButton);
  });
}

/**
 * This function look in the todo-array after a todo with a special id you need to change.
 * could it find a new update it save it in localstorage. And the todo updates in the todo-array.
 */
function updateTodo(id) {
  const todoToUpdate = todos.find((todo) => todo.id === id);

  if (todoToUpdate) {
    const updateTextElement = document.getElementById(`updateText_${id}`);
    const updateDateElement = document.getElementById(`updateDate_${id}`);

    const updatedText = updateTextElement.value.trim();
    const updatedDate = updateDateElement.value;

    if (updatedText !== "") {
      todoToUpdate.text = updatedText;
    }

    if (updatedDate !== "") {
      todoToUpdate.date = updatedDate;
    }
    saveToLocalStorage();
    renderTodos();
    showTodoArrayLength();
  }
}

/**
 * This function delete a todo. Looks after a todo with id and if it match
 * this todo deleted from the todo-array and in localstorage and render out the
 * new todo-array.
 */
function deleteTodo(id) {
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    //Ta bort todo från todos-listan
    todos.splice(todoIndex, 1);

    //mUppdatera kalendern
    renderCalenderDays();

    // Spara ändringarna i localStorage
    saveToLocalStorage();

    // Uppdatera todo-listan och visa antalet todos
    renderTodos();
    showTodoArrayLength();
  }
}

/**
 * Thid function save our todo-array to localstorage under the name "todos"
 */
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/** This function look in localstorage if there are saved todos. */
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  todos = storedTodos ? JSON.parse(storedTodos) : [];
}

function showTodoArrayLength() {
  const showTodoLength = document.getElementById("todoCount");
  const numberOfTodosArray = todos.length;
  showTodoLength.textContent = numberOfTodosArray;
  console.log(`Antal todos: ${numberOfTodosArray}`);
}
