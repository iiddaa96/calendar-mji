function initWelcome() {
  updateDateTime();
}

/**
 * This function retrieves the current date and time, formats them, and updates the
 * corresponding HTML elements with the ids "todaysDate" and "time" to display the information.
 * It is intended to be called on page load and then repeatedly every second to keep the
 * displayed date and time up-to-date.
 * @returns {void}
 */
function updateDateTime() {
  const now = new Date();
  const days = [
    "Söndag",
    "Måndag",
    "Tisdag",
    "Onsdag",
    "Torsdag",
    "Fredag",
    "Lördag",
  ];
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

  // Format the day, date, and month
  const dayOfWeek = days[now.getDay()];
  const date = now.getDate();
  const month = months[now.getMonth()];
  const year = now.getFullYear();

  // Display the full date
  const todaysDateElement = document.getElementById("todaysDate");
  todaysDateElement.textContent = `${dayOfWeek} ${date} ${month} ${year}`;

  // Format the time
  const timeElement = document.getElementById("time");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Display the current time
  timeElement.textContent = `${hours}:${minutes}:${seconds}`;
}

// Call `updateDateTime` on page load and then every second
document.addEventListener("DOMContentLoaded", function () {
  updateDateTime();
  setInterval(updateDateTime, 1000);
});
