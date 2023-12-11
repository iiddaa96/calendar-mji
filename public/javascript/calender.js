// window.addEventListener("DOMContentLoaded", initCalendar);

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

async function renderCalenderDays() {
  let calenderUL = document.querySelector(".calendar");

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
    const cell = document.createElement("li");
    cell.className = "padding-days";
    cell.textContent = lastDateOfPrevMonth - i + 1;
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
    let holidayString = "";

    const xx = holidays.filter((h) => {
      return h.datum === currentDate;
    });

    if (xx[0]) {
      holidayString = xx[0].helgdag;
    }

    const todosForDay = todos.filter((todo) => todo.date === currentDate);
    const hasTodos = todosForDay.length > 0;
    const todoCount = hasTodos ? todosForDay.length : "";

    const cell = document.createElement("li");
    cell.className = isToday + (xx[0] ? " redDay" : ""); // Om det är en röd dag så blir texten röd.
    cell.textContent = i;
    cell.addEventListener("click", () => {
      const loopDay = new Date(calendar.year, calendar.month, i);
      const formattedDate = loopDay.toLocaleDateString();
      updateTodoList(formattedDate);
    });

    // Felet är med span
    const dateSpan = document.createElement("span");
    dateSpan.textContent = holidayString;
    const todoCountSpan = document.createElement("span");

    todoCountSpan.className = "todoCountSpan";
    todoCountSpan.textContent = todoCount;

    cell.append(dateSpan, todoCountSpan);

    dayCells.push(cell);
  }
  // Creating li of next month first days
  for (let i = lastDayOfMonth; i < 6; i++) {
    const cell = document.createElement("li");
    cell.className = "padding-days";
    cell.textContent = i - lastDayOfMonth + 1;
    dayCells.push(cell);
  }

  calenderUL.innerHTML = "";
  calenderUL.append(...dayCells);
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
