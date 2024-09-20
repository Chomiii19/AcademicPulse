import Chart from "chart.js/auto";

const ctx = document.getElementById("idvalidated-graph").getContext("2d");
let year;
let month;
let day;

const displayType = () => {
  const yearValue = document.querySelector(".year-options").value;
  if (yearValue === "currentYear") year = new Date().getFullYear();
  document.querySelector(".type-options").classList.add("active");
};

const displayOptions = () => {
  const type = document.querySelector(".type-options").value;
  if (type === "days") {
    document.querySelector(".months-option").classList.add("active");
    document.querySelector(".day-option").classList.remove("active");
  } else if (type === "hours") {
    document.querySelector(".months-option").classList.add("active");
    document.querySelector(".day-option").classList.add("active");
  } else if (type === "months") {
    document.querySelector(".months-option").classList.remove("active");
    document.querySelector(".day-option").classList.remove("active");
    idValidated(`year=${year}`);
  }
};

const monthOptions = () => {
  month = document.querySelector(".months-option").value.padStart(2, "0");
  console.log(year, month);
  idValidated(`year=${year}&month=${month}`);
  const days = new Date(year, month, 0).getDate();
  const dayOption = document.querySelector(".day-option");
  dayOption.innerHTML = "";

  for (let i = 1; i <= days; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    dayOption.appendChild(option);
  }
};

const dayOptions = () => {
  day = document.querySelector(".day-option").value.padStart(2, "0");
  console.log(year, month, day);
  idValidated(`hours=${year}-${month}-${day}`);
};

const idValidated = async (url = `year=${year}}`) => {
  try {
    const response = await fetch(`/app/api/validated-id-stats?${url}`);

    const dataAPI = await response.json();

    const monthsList = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const dataList = monthsList.reduce((acc, month) => {
      acc[month] = 0;
      return acc;
    }, {});

    dataAPI.data.forEach((log) => {
      dataList[monthsList[log.month - 1]] = log.count;
    });

    const months = Object.keys(dataList);
    const counts = Object.values(dataList);

    const idValidatedGraph = new Chart(ctx, {
      type: "bar",
      data: {
        labels: months,
        datasets: [
          {
            label: "# of ID validated (2024)",
            backgroundColor: "rgb(255, 99, 132)",
            hoverBackgroundColor: "rgba(255, 99, 133, 0.655)",
            data: counts,
            borderWidth: 0.5,
          },
        ],
      },
      options: {},
    });
  } catch (err) {
    console.error(err);
  }
};

idValidated();
//FIX BACKEND SEND DATA FOR ALL GRAPHS IN A SINGLE REQUEST
