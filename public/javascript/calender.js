function initCalendar() {
  renderCalenderDays();
  calenderInfo();
  changeBackgroundByMonth();
}

/**
 * Creates an object with the current date, year, month and day.
 */
let calendar = {
  date: new Date(),
  year: null,
  month: null,
  day: null,
};

calendar.year = calendar.date.getFullYear();
calendar.month = calendar.date.getMonth();
calendar.day = calendar.date.getDate();

/**
 * Array with the months of the year.
 * */
const months = [
  "Januari",
  "Februari",
  "Mars",
  "April",
  "Maj",
  "Juni",
  "Juli",
  "Augusti",
  "September",
  "Oktober",
  "November",
  "December",
];

/**
 * Array with the weekdays
 */
const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

/**
 * Asynchronously fetches holiday data from a third-party API based on the current year and month.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of holiday objects.
 */
async function getHolidayAPI() {
  const url = `https://sholiday.faboul.se/dagar/v2.1/${calendar.year}/${
    calendar.month + 1
  }`;
  const response = await fetch(url);
  const result = await response.json();

  const days = result.dagar;

  const fetchedHolidays = [];
  for (let i = 0; i < days.length; i++) {
    if (days[i].helgdag) {
      fetchedHolidays.push(days[i]);
    }
  }
  return fetchedHolidays;
}

/**
 * Renders a list of selected todos in the HTML element with the id "todoList".
 *
 * @param {Array<Object>} selectedTodos - An array of selected todo objects to be rendered.
 */
function renderSelectedTodos(selectedTodos) {
  const todoList = document.getElementById("todoList");
  todoList.innerHTML = "";

  selectedTodos.forEach((todo) => {
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
      ${todo.text} ${todo.date}
    `;

    todoList.appendChild(todoItem);
    todoList.appendChild(updateButton);
    todoList.appendChild(deleteButton);
  });
}

/**
 * Renders the calendar days for the specified month and year, populating the UI with day cells.
 * @async
 * @function renderCalenderDays
 * @returns {Promise<void>} A Promise that resolves when the rendering is complete.
 */
async function renderCalenderDays() {
  let calenderUL = document.querySelector(".calendar");
  calenderUL.innerHTML = "";

  let firstWeekDayOfMonth = new Date(
    calendar.year,
    calendar.month,
    1,
    -1
  ).getDay(); // Getting first weekday of month
  let lastDateOfMonth = new Date(
    calendar.year,
    calendar.month + 1,
    0
  ).getDate(); // Getting last date of month
  let lastDayOfMonth = new Date(
    calendar.year,
    calendar.month,
    lastDateOfMonth - 1
  ).getDay(); // Getting last date of previous month
  let lastDateOfPrevMonth = new Date(
    calendar.year,
    calendar.month,
    0
  ).getDate(); // Getting last date of prev month

  const now = new Date();

  const holidays = await getHolidayAPI();
  let liTag = "";
  const dayCells = [];

  // loop for padding days of previous month
  for (let i = firstWeekDayOfMonth; i > 0; i--) {
    const cell = createAdjacentCalendarCell(lastDateOfPrevMonth - i + 1);
    dayCells.push(cell);
  }

  // Iterates the current month and adds the days to the calendar
  for (let i = 1; i <= lastDateOfMonth; i++) {
    const currentDate =
      calendar.year +
      "-" +
      ("" + (calendar.month + 1)).padStart(2, "0") +
      "-" +
      ("" + i).padStart(2, "0");

    let isToday =
      i === calendar.day &&
      calendar.month === now.getMonth() &&
      calendar.year === now.getFullYear()
        ? "activeDay"
        : "";
    let holidayString = ""; // Test
    const xx = holidays.filter((h) => {
      return h.datum === currentDate;
    });

    if (xx[0]) {
      holidayString = xx[0].helgdag;
    }

    const todosForDay = todos.filter((todo) => todo.date === currentDate);
    const hasTodos = todosForDay.length > 0;

    const cell = document.createElement("li");
    cell.setAttribute("data-cy", "calendar-cell");
    cell.className = isToday + (xx[0] ? " redDay" : "");
    cell.textContent = holidayString;
    cell.addEventListener("click", () => {
      const loopDay = new Date(calendar.year, calendar.month, i);
      selectedDate = loopDay.toLocaleDateString();
      renderTodos();
    });

    const dateSpan = document.createElement("span");
    dateSpan.setAttribute("data-cy", "calendar-cell-date");
    dateSpan.textContent = i;
    cell.appendChild(dateSpan);

    addTodoCountSpanToCell(cell, todosForDay);

    dayCells.push(cell);
  }

  // Creating li of next month first days
  for (let i = lastDayOfMonth; i < 6; i++) {
    const cell = createAdjacentCalendarCell(i - lastDayOfMonth + 1);
    dayCells.push(cell);
  }

  calenderUL.innerHTML = "";
  calenderUL.append(...dayCells);
}

/**
 * Adds a todo count span to the specified calendar cell if there are todos for the day.
 *
 * @param {HTMLLIElement} cell - The calendar cell element to which the todo count span should be added.
 * @param {Array<Object>} todosForDay - An array of todos for the specified day.
 */
function addTodoCountSpanToCell(cell, todosForDay) {
  const hasTodos = todosForDay.length > 0;

  if (hasTodos) {
    const todoCount = todosForDay.length;

    const todoCountSpan = document.createElement("span");
    todoCountSpan.setAttribute("data-cy", "calendar-cell-todos");
    todoCountSpan.className = "todoCountSpan";
    todoCountSpan.textContent = todoCount;

    // Append the todo count span to the calendar cell.
    cell.appendChild(todoCountSpan);
  }
}

/**
 * Creates a calendar cell element with specified text content, intended for adjacent months' padding.
 *
 * @param {string} textContent - The text content to be displayed in the calendar cell.
 * @returns {HTMLLIElement} The created calendar cell element.
 */
function createAdjacentCalendarCell(textContent) {
  const cell = document.createElement("li");
  cell.setAttribute("data-cy", "calendar-cell");
  cell.className = "padding-days";
  cell.textContent = textContent;
  return cell;
}

/**
 * Gets the current year, month and day and displays the current month in the calendar.
 */
function calenderInfo() {
  changeMonths();

  drawCurrentMonth();
}

/**
 * Adds event listeners to the buttons that changes the month.
 */
function changeMonths() {
  document
    .getElementById("monthBackArrow")
    .addEventListener("click", monthBack);
  document
    .getElementById("monthForwardArrow")
    .addEventListener("click", monthForward);
}

/**
 * If the month is december, the month will be set to january and the year will be increased by one.
 */
function monthForward() {
  if (calendar.month === 11) {
    calendar.month = 0;
    calendar.year++;
  } else {
    calendar.month++;
  }
  renderCalenderDays();
  drawCurrentMonth();
  changeBackgroundByMonth();
}

/**
 * If the month is january, the month will be set to december and the year will be decreased by one.
 */
function monthBack() {
  if (calendar.month === 0) {
    calendar.month = 11;
    calendar.year--;
  } else {
    calendar.month--;
  }
  renderCalenderDays();
  drawCurrentMonth();
  changeBackgroundByMonth();
}

/**
 * Displays the current month and year in the calendar.
 */
function drawCurrentMonth() {
  document.getElementById("displayCurrentMonth").innerText =
    months[calendar.month] + " " + +calendar.year;
}

/**
 * Array, Hämta bildnamnet för den aktuella månaden
 * @param {number} month - Månadens index (0-11) som representerar januari till december.
 * @returns {string} - Bildnamnet för den angivna månaden.
 */
function getMonthImage(month) {
  const monthImages = [
    "january.jpg",
    "february.jpg",
    "march.jpg",
    "april.jpg",
    "may.jpg",
    "june.jpg",
    "july.jpg",
    "august.jpg",
    "september.jpg",
    "october.jpg",
    "november.jpg",
    "december.jpg",
  ];
  return monthImages[month];
}

/**
 * Sätt bakgrundsbild
 */
function changeBackgroundByMonth() {
  const month = calendar.month;
  const imageUrl = `/images/${getMonthImage(month)}`;

  document.body.style.backgroundImage = `url("${imageUrl}")`;
}

// Anropa initCalendar() när sidan har laddats
window.addEventListener("DOMContentLoaded", initCalendar);
