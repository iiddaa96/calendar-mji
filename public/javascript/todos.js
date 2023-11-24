window.addEventListener("DOMContentLoaded", startTodos);

/**
 * Global array
 */
let todos = [];

function startTodos() {
  addEventListeners();
  togglePopup();
  addTodoFormEventListener();
}

/** Aktiverar funktionen togglePopup vid klick av knappen på "Skapa Anteckningar".
 * Spara-knappen leder vidare till addTodoFormEventListener.
 */
function addEventListeners() {
  const todoButton = document.getElementById("todoButton");
  todoButton.addEventListener("click", togglePopup);

  // Hämta spara knappen med klick event
  const saveTodoButton = document.getElementById("saveButton");
  saveTodoButton.addEventListener("click", addTodoFormEventListener);
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

/** Tar vara på datan som användaren skriver in vid skapandet av en todo.
 * Båda input-fälten måste vara ifyllda, annars varningsmeddelande.
 */
function addTodoFormEventListener() {
  const todoInput = document.getElementById("todoInput").value;
  const dateInput = document.getElementById("dateInput").value;
  const form = document.getElementById("add-todo-form");
  const warning = document.getElementById("warning");
  const feedback = document.getElementById("feedback");

  if (todoInput === "" || dateInput === "") {
    warning.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i>';
    feedback.textContent = "Var vänlig fyll i anteckningar och datum.";
    event.preventDefault();
  } else {
    form.addEventListener("submit", createNewTodoObject);
    warning.innerHTML = "";
    feedback.textContent = "";
  }
}

/** Skapar ny data i ett objekt och pushar in det i arrayen (todos). */
function createNewTodoObject(event) {
  event.preventDefault();

  const todo = {
    content: event.target.elements.text.value,
    date: event.target.elements.date.value,
    completed: false,
  };

  todos.push(todo);

  event.target.reset();

  refreshTodoList();
}

/** Skapar element, tillämpar klasser och renderar de skapade todo:sen. */
function refreshTodoList() {
  const allTodo = document.querySelector("#allTodo");
  allTodo.innerHTML = "";

  for (const todo of todos) {
    const todoItem = document.createElement("li");
    todoItem.classList.add("todo");

    const todoContent = document.createElement("div");
    const todoTitle = document.createElement("p");
    const todoDate = document.createElement("p");
    const todoButtons = document.createElement("div");
    const editButton = document.createElement("button");
    const deleteButton = document.createElement("button");

    todoContent.classList.add("todo-content");
    todoButtons.classList.add("todo-buttons");
    editButton.classList.add("todo-button-edit");
    deleteButton.classList.add("todo-button-delete");

    todoContent.innerHTML = `<p>${todo.content}</p>`;
    todoDate.innerHTML = `<p>${todo.date}</p>`;

    editButton.textContent = "Ändra";
    deleteButton.textContent = "Ta bort";
    deleteButton.setAttribute("data-cy", "delete-todo-button");

    todoContent.appendChild(todoTitle);
    todoContent.appendChild(todoDate);
    todoButtons.appendChild(editButton);
    todoButtons.appendChild(deleteButton);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoContent);
    todoItem.appendChild(todoButtons);

    allTodo.appendChild(todoItem);

    // Ändrar todo.
    editButton.addEventListener("click", (event) => {
      const todoInput = todoContent.querySelector(".input-todo");
      const todoDate = todoContent.querySelector(".input-date");

      if (editButton.textContent === "Ändra") {
        todoInput.removeAttribute("readonly");
        todoDate.removeAttribute("readonly");
        todoInput.style.backgroundColor = "grey";
        todoDate.style.backgroundColor = "purple";
        editButton.textContent = "Spara";
        todoInput.focus();
      } else if (editButton.textContent === "Spara") {
        todo.content = todoInput.value;
        todo.date = todoDate.value;

        todos = todos.map((item, index) => {
          if (item.id === todo.id) {
            return todo;
          }
          return item;
        });

        refreshTodoList();
        togglePopup();
      }
    });

    // Tar bort todo.
    deleteButton.addEventListener("click", () => {
      todos = todos.filter((t) => t != todo);
      refreshTodoList();
      togglePopup();
    });
  }
  togglePopup();
}
