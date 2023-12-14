window.addEventListener("DOMContentLoaded", startTodos);

let todos = [];
let editingTodoId = null; // Variabel för att hålla reda på id:et för den todo som för närvarande är under redigering
let selectedDate = null; // Variabel för att hålla reda på det datum som användaren har valt i kalendern

/**
 * Funktion som initierar applikationen genom att lägga till händelselyssnare, öppna popup-fönstret, rendera todos, generera unika id:n, visa antalet todos och uppdaterar
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
 * This function listen to "click" element for the buttons
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
 * Create a todo or update a todo. if you don´t fill in the input correct a warning text popup
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

/**
 * Retrieves notes from local storage, clears the existing content of the notes list,
 * and populates the UI with note items.
 * @returns {void}
 */
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

/**
 * Renders the todo items in the UI based on the todos array and the selected date.
 * @returns {void}
 */
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
    updateButton.onclick = () => editTodo(todo.id);

    const deleteButton = document.createElement("button");
    deleteButton.setAttribute("data-cy", "delete-todo-button");
    deleteButton.textContent = "Ta bort";
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
 * Updates the UI with filtered todos based on the specified todo ID,
 * saves changes to local storage, and triggers additional UI updates.
 * @function updateTodo
 * @param {string} id - The ID of the todo to be updated.
 * @returns {void}
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

/**
 * Sets the editingTodoId to the specified todo ID and toggles the todo popup.
 * @function editTodo
 * @param {string} id - The ID of the todo to be edited.
 * @returns {void}
 */
function editTodo(id) {
  editingTodoId = id;
  togglePopup();
}

/**
 * Deletes a todo based on its ID, updates local storage, and triggers UI updates.
 * @function deleteTodo
 * @param {string} id - The ID of the todo to be deleted.
 * @returns {void}
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
 * This function generates a unique identifier by appending an underscore (_) followed by a random string
 * derived from the `Math.random()` function and converting it to base 36.
 * @function
 * @returns {string} A unique identifier.
 */
function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

/**
 * This function clears the input field with the id "todoInput" and the input field with the id "dueDate"
 * in a todo form. It is commonly used to reset the form after submitting or canceling an edit operation.
 * Additionally, it sets the value of the global variable `editingTodoId` to `null`.
 * @returns {void}
 * @global
 * @type {string|null} editingTodoId - The global variable that stores the ID of the todo being edited.
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
 * This function retrieves stored todos from the local storage using the key "todos".
 * If there are stored todos, it parses the JSON data and updates the global 'todos' array.
 * If no todos are found in the local storage, the 'todos' array is set to an empty array.
 * @returns {void}
 * @global
 * @type {Array} todos - The global array that stores todo items.
 */
function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  todos = storedTodos ? JSON.parse(storedTodos) : [];
}

/**
 * This function retrieves the DOM element with the id "todoCount" to display the
 * current number of todos in the 'todos' array. It sets the text content of the
 * element to the length of the 'todos' array and logs the count to the console.
 * @returns {void}
 * @type {Array} todos - The global array that stores todo items.
 * // and the count will be logged to the console.
 */
function showTodoArrayLength() {
  const showTodoLength = document.getElementById("todoCount");
  const numberOfTodosArray = todos.length;
  showTodoLength.textContent = numberOfTodosArray;
  console.log(`Antal todos: ${numberOfTodosArray}`);
}

/**
 * This function retrieves the current 'notes' array from local storage, or initializes
 * an empty array if no 'notes' are found. It then adds the provided 'todo' to the array,
 * updates the 'notes' array in local storage, and persists the changes.
 * @param {string} todo - The todo item to be added to the 'notes'.
 * @type {Array} notes - The global array that stores notes or todo items.
 */
function addToNotes(todo) {
  const notes = localStorage.getItem("notes")
    ? JSON.parse(localStorage.getItem("notes"))
    : [];
  notes.push(todo);
  localStorage.setItem("notes", JSON.stringify(notes));
}
