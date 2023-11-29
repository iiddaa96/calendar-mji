window.addEventListener("DOMContentLoaded", startTodos);

function startTodos() {
  addEventListeners();
  togglePopup();
  renderTodos();
  addTodo();
  generateUniqueId();
  updateTodo();
  deleteTodo();
  // addTodoFormEventListener();
}

let todos = [];

/** Aktiverar funktionen togglePopup vid klick av knappen på "Skapa Anteckningar".
 * Spara-knappen leder vidare till addTodoFormEventListener.
 */
function addEventListeners() {
  const todoButton = document.getElementById("todoButton");
  todoButton.addEventListener("click", togglePopup);

  const createButton = document.getElementById("createButton");
  createButton.addEventListener("click", addTodo);
}

/** Visar / döljer popup fönstret för att skapa Todo. */
function togglePopup() {
  const todoPopup = document.getElementById("todoPopup");
  const warning = document.getElementById("warning");
  const feedback = document.getElementById("feedback");

  todoPopup.classList.toggle("show-popup");
  warning.textContent = "";
  feedback.textContent = "";
}

function addTodo() {
  const todoInput = document.getElementById("todoInput");
  const dueDateInput = document.getElementById("dueDate");

  const todoText = todoInput.value.trim();
  const dueDate = dueDateInput.value;

  if (todoText === "" || dueDate === "") {
    warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
  }
  const todo = {
    id: generateUniqueId(),
    text: todoText,
    date: dueDate,
  };

  todos.push(todo);

  saveToLocalStorage();
  renderTodos();

  todoInput.value = "";
  dueDateInput.value = "";
}

function generateUniqueId() {
  return "_" + Math.random().toString(36).substr(2, 9);
}

function renderTodos() {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  todos.forEach((todo) => {
    const todoItem = document.createElement("li");

    const updateButton = document.createElement("button");
    updateButton.textContent = "Uppdatera";
    updateButton.onclick = () => renderInput(todo.id);

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Ta bort";
    deleteButton.onclick = () => deleteTodo(todo.id);

    todoItem.innerHTML = `
      ${todo.text}${todo.date}
    `;

    todoList.appendChild(todoItem);
    todoList.appendChild(updateButton);
    todoList.appendChild(deleteButton);
  });
}

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
  }
}

function deleteTodo(id) {
  todos = todos.filter((todo) => todo.id !== id);
  saveToLocalStorage();
  renderTodos();
}

function saveToLocalStorage() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function loadFromLocalStorage() {
  const storedTodos = localStorage.getItem("todos");
  todos = storedTodos ? JSON.parse(storedTodos) : [];
  renderTodos();
}

// Ladda tidigare sparade todos när sidan laddas
loadFromLocalStorage();

// /** Tar vara på datan som användaren skriver in vid skapandet av en todo.
//  * Båda input-fälten måste vara ifyllda, annars varningsmeddelande.
//  */
// function addTodoFormEventListener() {
//   const todoInput = document.getElementById("todoInput").value;
//   const dateInput = document.getElementById("dateInput").value;
//   const form = document.getElementById("add-todo-form");
//   const warning = document.getElementById("warning");
//   const feedback = document.getElementById("feedback");

//   if (todoInput === "" || dateInput === "") {
//     warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
//     feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
//     event.preventDefault();
//   } else {
//     form.addEventListener("submit", createNewTodoObject);
//     warning.innerHTML = "";
//     feedback.textContent = "";
//   }
// }

// /** Skapar ny data i ett objekt och pushar in det i arrayen (todos). */
// function createNewTodoObject(event) {
//   event.preventDefault();

//   const todo = {
//     content: event.target.elements.text.value,
//     date: event.target.elements.date.value,
//     completed: false,
//   };

//   todos.push(todo);

//   event.target.reset();

//   refreshTodoList();
// }

// /** Skapar element, tillämpar klasser och renderar de skapade todo:sen. */
// function refreshTodoList() {
//   const allTodo = document.querySelector("#allTodo");
//   allTodo.innerHTML = "";

//   for (const todo of todos) {
//     const todoItem = document.createElement("li");
//     todoItem.classList.add("todo");

//     const todoContent = document.createElement("div");
//     const todoTitle = document.createElement("p");
//     const todoDate = document.createElement("p");
//     const todoButtons = document.createElement("div");
//     const editButton = document.createElement("button");
//     const deleteButton = document.createElement("button");

//     todoContent.classList.add("todo-content");
//     todoButtons.classList.add("todo-buttons");
//     editButton.classList.add("todo-button-edit");
//     deleteButton.classList.add("todo-button-delete");

//     todoContent.innerHTML = `<p>${todo.content}</p>`;
//     todoDate.innerHTML = `<p>${todo.date}</p>`;

//     editButton.textContent = "Ändra";
//     deleteButton.textContent = "Ta bort";
//     deleteButton.setAttribute("data-cy", "delete-todo-button");

//     todoContent.appendChild(todoTitle);
//     todoContent.appendChild(todoDate);
//     todoButtons.appendChild(editButton);
//     todoButtons.appendChild(deleteButton);
//     todoItem.appendChild(todoContent);
//     todoItem.appendChild(todoContent);
//     todoItem.appendChild(todoButtons);

//     allTodo.appendChild(todoItem);

//     // Ändrar todo.
//     editButton.onclick = () => updateTodo();

//     editButton.addEventListener("click", () => {
//       const todoInput = todoContent.querySelector(".input-todo");
//       const todoDate = todoContent.querySelector(".input-date");

//       if (editButton.textContent === "Ändra") {
//         todoInput.removeAttribute("readonly");
//         todoDate.removeAttribute("readonly");
//         todoInput.style.backgroundColor = "grey";
//         todoDate.style.backgroundColor = "purple";
//         editButton.textContent = "Spara";
//         todoInput.focus();
//       } else if (editButton.textContent === "Spara") {
//         todo.content = todoInput.value;
//         todo.date = todoDate.value;

//         todos = todos.map((item, index) => {
//           if (item.id === todo.id) {
//             return todo;
//           }
//           return item;
//         });

//         refreshTodoList();
//         togglePopup();
//       }
//     });

//     // Tar bort todo.
//     deleteButton.addEventListener("click", () => {
//       todos = todos.filter((t) => t != todo);
//       refreshTodoList();
//       togglePopup();
//     });
//   }
//   togglePopup();
// }
