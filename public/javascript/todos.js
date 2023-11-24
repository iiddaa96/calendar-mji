window.addEventListener('DOMContentLoaded', startTodos);


function startTodos() {
    addEventListeners();

}

/** Aktiverar funktionen togglePopup vid klick av knappen på "Skapa Anteckningar".
 * Spara-knappen leder vidare till addTodoFormEventListener.
 */
function addEventListeners() {
  const createTodoButton = document.getElementById("createTodoButton");
  createTodoButton.addEventListener("click", togglePopup);

  const saveTodoButton = document.getElementById("saveButton");
  saveTodoButton.addEventListener("click", addTodoFormEventListener);
}

function togglePopup() {

}

function addTodoFormEventListeners() {

}