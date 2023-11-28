function initCalender() {
  generateCalenderDays();
  
  //test
  // calenderInfo();
  // changeBackgroundByMonth();
}

document.addEventListener("DOMContentLoaded", () => {
  const displayCurrentMonth = document.getElementById("displayCurrentMonth");
  const calendar = document.querySelector(".calendar");
  let currentDate = new Date();

  function updateMonthDisplay() {
    displayCurrentMonth.textContent = currentDate.toLocaleDateString("sv-SE", {
      month: "long",
      year: "numeric",
    });
  }

  async function getHolidayAPI() {
    try {
      const url = `https://sholiday.faboul.se/dagar/v2.1/${currentDate.getFullYear()}/${
        currentDate.getMonth() + 1
      }`;
      const response = await fetch(url);

      const days = result.dagar;

      const fetchedHolidays = [];
      for (let i = 0; i < days.length; i++) {
        if (days[i].helgdag) {
          fetchedHolidays.push(days[i]);
        }
      }
      return fetchedHolidays;
    } catch (error) {
      console.error("Error fetching holiday data:", error);
      throw error; // Rethrow the error to propagate it further
    }
  }

  async function generateCalenderDays() {
    const firstDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDayOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const now = new Date();

    getHolidayAPI().then((holidays) => {
      let liTag = "";

      const lastDateOfPrevMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        0
      ).getDate();
      // loop for padding days of previous month
      for (let i = firstDayOfMonth.getDay(); i > 0; i--) {
        liTag += `<li class="padding-days">${lastDateOfPrevMonth - i + 1}</li>`;
      }

      // Iterates the current month and adds the days to the calendar
      for (let i = 1; i <= lastDayOfMonth.getDate(); i++) {
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

        liTag += `<li class="${isToday}">${i}<p>${holidayString}</p></li>`;
      }
      // Creating li of next month first days
      for (let i = lastDayOfMonth.getDate(); i < 6; i++) {
        liTag += `<li class="padding-days">${
          i - lastDayOfMonth.getDate() + 1
        }</li>`;
      }

      calendar.innerHTML = liTag;
    });

    // Clear the calendar
    calendar.innerHTML = "";

    // Add empty cells at the start of the calendar
    for (let i = 0; i < firstDayOfMonth.getDay(); i++) {
      calendar.insertAdjacentHTML("beforeend", '<li class="empty-day"></li>');
    }

    // Fill in the days of the month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      const dayItem = document.createElement("li");
      dayItem.textContent = day;
      calendar.appendChild(dayItem);
    }
  }

  function navigateMonth(offset) {
    currentDate.setMonth(currentDate.getMonth() + offset);
    updateMonthDisplay();
    generateCalenderDays();
  }

  // Event listeners for navigation arrows
  document
    .getElementById("monthBackArrow")
    .addEventListener("click", () => navigateMonth(-1));
  document
    .getElementById("monthForwardArrow")
    .addEventListener("click", () => navigateMonth(1));

  // Initial setup
  updateMonthDisplay();
  generateCalenderDays();
});
