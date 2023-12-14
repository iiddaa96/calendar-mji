window.addEventListener("DOMContentLoaded", startTodos);

let todos = [];
let editingTodoId = null; // Variabel för att hålla reda på id:et för den todo som för närvarande är under redigering
let selectedDate = null; // Variabel för att hålla reda på det datum som användaren har valt i kalendern

/**
 * Funktion som initierar applikationen genom att lägga till händelselyssnare, öppna popup-fönstret, rendera todos, generera unika id:n och visa antalet todos
 */
function startTodos() {
  addEventListeners();
  togglePopup();
  renderTodos();
  generateUniqueId();
  showTodoArrayLength();
  editTodo();
}

/**
 * This function lisen to "click" element for the buttons
 */
function addEventListeners() {
  const todoButton = document.getElementById("todoButton");
  todoButton.addEventListener("click", togglePopup);

  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", addOrUpdateTodo);
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

  if (!todoPopup.classList.contains("show-popup")) {
    resetTodoForm();
  } else if (editingTodoId) {
    const todoToUpdate = todos.find((todo) => todo.id === editingTodoId);
    document.getElementById("todoInput").value = todoToUpdate.text;
    document.getElementById("dueDate").value = todoToUpdate.date;
  }
}

/**
 * Create a todo or update a todo. if you don´t fill in the input correct a warning text popup will come
 * The todo saves in localStorage
 */
function addOrUpdateTodo() {
  const todoInput = document.getElementById("todoInput");
  const dueDateInput = document.getElementById("dueDate");
  const warning = document.getElementById("warning");
  const feedback = document.getElementById("feedback");

  const todoText = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (todoText === "" || dueDate === "") {
    warning.style.color = "red";
    warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
    return;
  }

  if (editingTodoId) {
    const index = todos.findIndex((t) => t.id === editingTodoId);
    if (index !== -1) {
      todos[index].text = todoText;
      todos[index].date = dueDate;
      editingTodoId = null;
    }
  } else {
    const todo = {
      id: generateUniqueId(),
      text: todoText,
      date: dueDate,
    };

    todos.push(todo);
    addToNotes(todo);
  }

  saveToLocalStorage();
  renderTodos();
  togglePopup();
  renderCalenderDays();
  showTodoArrayLength();

  // Återställ varning och feedback till tomma strängar efter att ha lagt till eller uppdaterat todo
  warning.textContent = "";
  feedback.textContent = "";
}

function renderNotes() {
  const notesList = document.getElementById("notesList");
  notesList.innerHTML = "";

  const notes = localStorage.getItem("notes")
    ? JSON.parse(localStorage.getItem("notes"))
    : [];

  notes.forEach((note) => {
    const noteItem = document.createElement("li");
    noteItem.textContent = note.text;
    notesList.appendChild(noteItem);
  });
}

/** This function render a todo, it look in the todo list array and create a list, and two button: Save and Delete. */
function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  let filteredTodos = todos;
  if (selectedDate) {
    filteredTodos = todos.filter((todo) => {
      const todoDate = new Date(todo.date);
      return todoDate.toLocaleDateString() === selectedDate;
    });
  }

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todoListText";

    const updateButton = document.createElement("button");
    updateButton.setAttribute("data-cy", "edit-todo-button");
    updateButton.textContent = "Uppdatera";
    updateButton.className = "updateButton";
    updateButton.onclick = () => editTodo(todo.id);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-cy", "delete-todo-button");
    deleteButton.textContent = "Ta bort";
    deleteButton.className = "deleteButton";
    deleteButton.onclick = () => deleteTodo(todo.id);

    todoItem.innerHTML = `
      ${todo.text} ${todo.date}
    `;

    todoList.appendChild(todoItem);
    todoItem.appendChild(updateButton);
    todoItem.appendChild(deleteButton);
  });
}

/**
 * This function look in the todo-array after a todo with a special id you need to change.
 * could it find a new update it save it in localStorage. And the todo updates in the todo-array.
 */
function updateTodo(id) {
  const selectedTodos = todos.filter((todo) => todo.id === id);
  renderFilteredTodos(selectedTodos);
  const todoDate = new Date(selectedTodos[0].date);
  const formattedDate = todoDate.toLocaleDateString();
  showTodoCountInCalendar(selectedTodos.length);

  saveToLocalStorage();
  renderTodos();
  renderCalenderDays();
  showTodoArrayLength();
}

function editTodo(id) {
  editingTodoId = id;
  togglePopup();
}

/**
 * This function delete a todo. Looks after a todo with id and if it match
 * this todo deleted from the todo-array and in localstorage and render out the
 * new todo-array.
 */
function deleteTodo(id) {
  const todoIndex = todos.findIndex((todo) => todo.id === id);

  if (todoIndex !== -1) {
    todos.splice(todoIndex, 1);
    saveToLocalStorage();
    renderTodos();
    showTodoArrayLength();
    renderCalenderDays();
  }
}

/**
 * This function create a unique id för the todo.
 */
function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * Resets the todo form by clearing input fields and setting editingTodoId to null.
 */
function resetTodoForm() {
  document.getElementById("todoInput").value = "";
  document.getElementById("dueDate").value = "";
  editingTodoId = null;
}

/**
 * Save our todo-array to localstorage under the name "todos"
 */
function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

/**
 * This function look in localStorage if there are saved todos.
 * */
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  todos = storedTodos ? JSON.parse(storedTodos) : [];
}

/**
 * Displays the number of todos in the HTML element with the id "todoCount"
 * and logs the total number of todos to the console.
 */
function showTodoArrayLength() {
  const showTodoLength = document.getElementById("todoCount");
  const numberOfTodosArray = todos.length;
  showTodoLength.textContent = numberOfTodosArray;
  console.log(`Antal todos: ${numberOfTodosArray}`);
}

function addToNotes(todo) {
  const notes = localStorage.getItem("notes")
    ? JSON.parse(localStorage.getItem("notes"))
    : [];
  notes.push(todo);
  localStorage.setItem("notes", JSON.stringify(notes));
}
