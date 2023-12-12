// window.addEventListener("DOMContentLoaded", startTodos);

// function startTodos() {
//   addEventListeners();
//   togglePopup();
//   renderTodos();
//   addTodo();
//   generateUniqueId();
//   updateTodo();
//   deleteTodo();
//   showTodoArrayLength();
// }

// let todos = [];

// /**
//  * This function lisen to "click" element for the buttons
//  */
// function addEventListeners() {
//   const todoButton = document.getElementById("todoButton");
//   todoButton.addEventListener("click", togglePopup);

//   const createButton = document.getElementById("createButton");
//   createButton.addEventListener("click", addTodo);
// }

// /**
//  * This function show/hide the popup-window to create a todo
//  */
// function togglePopup() {
//   const todoPopup = document.getElementById("todoPopup");
//   const warning = document.getElementById("warning");
//   const feedback = document.getElementById("feedback");

//   todoPopup.classList.toggle("show-popup");
//   warning.textContent = "";
//   feedback.textContent = "";
// }

// /**
//  * This function create a todo, if you don't fill in the input a warning text popup.
//  * The todo saves in localStorage.
//  */
// function addTodo() {
//   const todoInput = document.getElementById("todoInput");
//   const dueDateInput = document.getElementById("dueDate");

//   const todoText = todoInput.value.trim();
//   const dueDate = dueDateInput.value;

//   if (todoText === "" || dueDate === "") {
//     warning.style.color = "red";
//     warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
//     feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
//     return;
//   }
//   const todo = {
//     id: generateUniqueId(),
//     text: todoText,
//     date: dueDate,
//   };

//   todos.push(todo);

//   saveToLocalStorage();
//   renderTodos();
//   renderCalenderDays();
//   showTodoArrayLength();

//   todoInput.value = "";
//   dueDateInput.value = "";
//   warning.textContent = "";
//   feedback.textContent = "";
// }

// /**
//  * This function create a unique id för the todo.
//  */
// function generateUniqueId() {
//   return "_" + Math.random().toString(36).substr(2, 9);
// }

// /** This function render a todo, it look in the todolist array and create a list, and two button: Save and Delete.*/

// function renderTodos() {
//   const todoList = document.getElementById("todoList");
//   const todoContainer = document.createElement("todo-heading");
//   todoList.innerHTML = "";

//   todos.forEach((todo) => {
//     const todoItem = document.createElement("li");
//     todoItem.className = "todoItem";

//     const updateButton = document.createElement("button");
//     updateButton.textContent = "Uppdatera";
//     updateButton.className = "todoUpdate";
//     updateButton.onclick = () => renderInput(todo.id);
//     updateButton.setAttribute("data-cy", "edit-todo-button");

//     const deleteButton = document.createElement("button");
//     deleteButton.setAttribute("data-cy", "delete-todo-button");
//     deleteButton.textContent = "Ta bort";
//     deleteButton.className = "todoDeleted";
//     deleteButton.onclick = () => deleteTodo(todo.id);

//     todoItem.innerHTML = `
//       ${todo.text} ${todo.date}
//     `;
//     todoContainer.append(todoItem);
//     todoList.appendChild(todoItem);
//     todoItem.appendChild(updateButton);
//     todoItem.appendChild(deleteButton);
//   });
// }

// /**
//  * This function render input element for text and date, if you need to update a todo.
//  */
// function renderInput(id) {
//   const todoList = document.getElementById("todoList");
//   todoList.innerHTML = "";

//   const todoToUpdate = todos.find((todo) => todo.id === id);

//   if (todoToUpdate) {
//     const todoItem = document.createElement("li");

//     const saveButton = document.createElement("button");
//     saveButton.textContent = "Spara";
//     saveButton.onclick = () => updateTodo(id);

//     const deleteButton = document.createElement("button");
//     deleteButton.textContent = "Ta bort";
//     deleteButton.onclick = () => deleteTodo(id);

//     const updateTextElement = document.createElement("input");
//     updateTextElement.type = "text";
//     updateTextElement.id = `updateText_${id}`;
//     updateTextElement.placeholder = "Uppdatera din todo..";
//     updateTextElement.value = todoToUpdate.text;

//     const updateDateElement = document.createElement("input");
//     updateDateElement.type = "date";
//     updateDateElement.id = `updateDate_${id}`;
//     updateDateElement.value = todoToUpdate.date;

//     todoItem.appendChild(updateTextElement);
//     todoItem.appendChild(updateDateElement);
//     todoList.appendChild(todoItem);
//     todoList.appendChild(saveButton);
//     todoList.appendChild(deleteButton);
//   }
// }

// // function renderInput() {
// //   const todoList = document.getElementById("todoList");
// //   todoList.innerHTML = "";

// //   todos.forEach((todo) => {
// //     const todoItem = document.createElement("li");

// //     const saveButton = document.createElement("button");
// //     saveButton.textContent = "Spara";
// //     saveButton.onclick = () => updateTodo(todo.id);

// //     const deleteButton = document.createElement("button");
// //     updateButton.setAttribute("data-cy", "delete-todo-button");
// //     deleteButton.textContent = "Ta bort";
// //     deleteButton.onclick = () => deleteTodo(todo.id);

// //     todoItem.innerHTML = `
// //       ${todo.text} ${todo.date}
// //       <input type="text" id="updateText_${todo.id}" placeholder="Uppdatera don todo..">
// //        <input type="date" id="updateDate_${todo.id}">
// //     `;

// //     todoList.appendChild(todoItem);
// //     todoList.appendChild(saveButton);
// //     todoList.appendChild(deleteButton);
// //   });
// // }

// /**
//  * This function look in the todo-array after a todo with a special id you need to change.
//  * could it find a new update it save it in localstorage. And the todo updates in the todo-array.
//  */
// function updateTodo(id) {
//   const todoToUpdate = todos.find((todo) => todo.id === id);

//   if (todoToUpdate) {
//     const updateTextElement = document.getElementById(`updateText_${id}`);
//     const updateDateElement = document.getElementById(`updateDate_${id}`);

//     const updatedText = updateTextElement.value.trim();
//     const updatedDate = updateDateElement.value;

//     if (updatedText !== "") {
//       todoToUpdate.text = updatedText;
//     }

//     if (updatedDate !== "") {
//       todoToUpdate.date = updatedDate;
//     }
//     saveToLocalStorage();
//     renderTodos();
//     renderCalenderDays();
//     showTodoArrayLength();
//   }
// }

// /**
//  * This function delete a todo. Looks after a todo with id and if it match
//  * this todo deleted from the todo-array and in localstorage and render out the
//  * new todo-array.
//  */
// function deleteTodo(id) {
//   const todoIndex = todos.findIndex((todo) => todo.id === id);

//   if (todoIndex !== -1) {
//     //Ta bort todo från todos-listan
//     todos.splice(todoIndex, 1);

//     // Spara ändringarna i localStorage
//     saveToLocalStorage();

//     // Uppdatera todo-listan och visa antalet todos
//     renderTodos();
//     renderCalenderDays();
//     showTodoArrayLength();
//   }
// }

// /**
//  * Thid function save our todo-array to localstorage under the name "todos"
//  */
// function saveToLocalStorage() {
//   localStorage.setItem("todos", JSON.stringify(todos));
// }

// /** This function look in localstorage if there are saved todos. */
// function loadFromLocalStorage() {
//   const storedTodos = localStorage.getItem("todos");
//   todos = storedTodos ? JSON.parse(storedTodos) : [];
// }

// function showTodoArrayLength() {
//   const showTodoLength = document.getElementById("todoCount");
//   const numberOfTodosArray = todos.length;
//   showTodoLength.textContent = numberOfTodosArray;
//   console.log(`Antal todos: ${numberOfTodosArray}`);
// }

// // function renderFilteredTodos(filteredTodos) {
// //   const todoList = document.getElementById("todoList");
// //   todoList.innerHTML = "";

// //   filteredTodos.forEach((todo) => {
// //     const todoItem = document.createElement("li");

// //     const updateButton = document.createElement("button");
// //     updateButton.textContent = "Uppdatera";
// //     updateButton.onclick = () => renderInput(todo.id);
// //     updateButton.setAttribute("data-cy", "edit-todo-button");

// //     const deleteButton = document.createElement("button");
// //     deleteButton.textContent = "Ta bort";
// //     deleteButton.onclick = () => deleteTodo(todo.id);
// //     deleteButton.setAttribute("data-cy", "delete-todo-button");

// //     todoItem.innerHTML = `
// //       ${todo.text} ${todo.date}
// //     `;

// //     todoList.appendChild(todoItem);
// //     todoList.appendChild(updateButton);
// //     todoList.appendChild(deleteButton);
// //   });
// // }

// function updateTodoList(selectedDate) {
//   const selectedTodos = todos.filter((todo) => {
//     const todoDate = new Date(todo.date);
//     return todoDate.toLocaleDateString() === selectedDate;
//   });
//   renderFilteredTodos(selectedTodos);
// }

// function renderFilteredTodos(filteredTodos) {
//   const todoList = document.getElementById("todoList");
//   todoList.innerHTML = "";

//   filteredTodos.forEach((todo) => {
//     const todoItem = document.createElement("li");
//     todoItem.className = "todoListText";
//     const updateButton = document.createElement("button");
//     updateButton.setAttribute("data-cy", "edit-todo-button");
//     updateButton.textContent = "Uppdatera";
//     updateButton.onclick = () => renderInput(todo.id);

//     const deleteButton = document.createElement("button");
//     deleteButton.textContent = "Ta bort";
//     deleteButton.onclick = () => deleteTodo(todo.id);
//     // deleteButton.setAttribute("data-cy", "delete-todo-button");

//     todoItem.innerHTML = `
//       ${todo.text} ${todo.date}
//     `;

//     todoList.appendChild(todoItem);
//     todoList.appendChild(updateButton);
//     todoList.appendChild(deleteButton);
//   });
// }

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
  }

  saveToLocalStorage();
  renderTodos();
  togglePopup();
  renderCalenderDays();

  // Återställ varning och feedback till tomma strängar efter att ha lagt till eller uppdaterat todo
  warning.textContent = "";
  feedback.textContent = "";
}

/** This function render a todo, it look in the todo list array and create a list, and two button: Save and Delete. */
function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach((todo) => {
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
    todoList.appendChild(updateButton);
    todoList.appendChild(deleteButton);
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

function resetTodoForm() {
  document.getElementById("todoInput").value = "";
  document.getElementById("dueDate").value = "";
  editingTodoId = null;
}

function showTodosForDate(date) {
  const todosForDate = todos.filter((todo) => todo.date === date);
  renderTodos(todosForDate);

  selectedDate = date;
  updateTodoList(selectedDate);
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

function showTodoArrayLength() {
  const showTodoLength = document.getElementById("todoCount");
  const numberOfTodosArray = todos.length;
  showTodoLength.textContent = numberOfTodosArray;
  console.log(`Antal todos: ${numberOfTodosArray}`);
}

function setupCalendarListeners() {
  const calendarCells = document.querySelectorAll(".calendar-cell");
  calendarCells.forEach((cell) => {
    cell.addEventListener("click", () => {
      const clickedDate = cell.getAttribute("data-date");
      showTodosForDate(clickedDate);
    });
  });
}

function updateTodoList(selectedDate) {
  const selectedTodos = todos.filter((todo) => {
    const todoDate = new Date(todo.date);
    return todoDate.toLocaleDateString() === selectedDate;
  });
  renderFilteredTodos(selectedTodos);
}

function renderFilteredTodos(filteredTodos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  filteredTodos.forEach((todo) => {
    const todoItem = document.createElement("li");
    todoItem.className = "todoListText";
    const updateButton = document.createElement("button");
    updateButton.setAttribute("data-cy", "edit-todo-button");
    updateButton.textContent = "Uppdatera";
    updateButton.onclick = () => editTodo(todo.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort";
    deleteButton.onclick = () => deleteTodo(todo.id);
    deleteButton.setAttribute("data-cy", "delete-todo-button");

    todoItem.innerHTML = `
      ${todo.text} ${todo.date}
    `;

    todoList.appendChild(todoItem);
    todoList.appendChild(updateButton);
    todoList.appendChild(deleteButton);
  });
}
