import Chart from "chart.js/auto";

let year;
let month;
let day;
let idValidatedGraph;
let dayList = [];
const monthLists = [
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

const time = [
  "12 AM",
  "1 AM",
  "2 AM",
  "3 AM",
  "4 AM",
  "5 AM",
  "6 AM",
  "7 AM",
  "8 AM",
  "9 AM",
  "10 AM",
  "11 AM",
  "12 PM",
  "1 PM",
  "2 PM",
  "3 PM",
  "4 PM",
  "5 PM",
  "6 PM",
  "7 PM",
  "8 PM",
  "9 PM",
  "10 PM",
  "11 PM",
];

const idValidatedGraphContainer = document.getElementById("idvalidated-graph");
const schoolLogsGraph = document.getElementById("schoollogs-graph");
const doughnut = document.getElementById("doughnut-graph");
const doughnutPercentage = document.querySelector(".label-doughnut");

function resizeCanvas(canvas) {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
}

function adjustCanvases() {
  resizeCanvas(idValidatedGraphContainer);
  resizeCanvas(schoolLogsGraph);
  resizeCanvas(doughnut);
}

window.addEventListener("load", adjustCanvases);
window.addEventListener("resize", adjustCanvases);

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

    idValidated(`year=${year}`, monthLists, "year");
  }
};

const monthOptions = () => {
  month = document.querySelector(".months-option").value.padStart(2, "0");
  const days = new Date(year, month, 0).getDate();
  const dayOption = document.querySelector(".day-option");
  dayOption.innerHTML = "";

  for (let i = 1; i <= days; i++) {
    const option = document.createElement("option");
    option.value = i;
    option.textContent = i;
    dayList.push(i);
    dayOption.appendChild(option);
  }
  idValidated(`year=${year}&month=${month}`, dayList, "month");
};

const dayOptions = () => {
  day = document.querySelector(".day-option").value.padStart(2, "0");
  idValidated(`hours=${year}-${month}-${day}`, time, "hour");
};

const idValidated = async (
  url = `year=${new Date().getFullYear()}`,
  lists = monthLists,
  type = "year"
) => {
  try {
    const ctx = document.getElementById("idvalidated-graph").getContext("2d");
    const response = await fetch(`/app/api/validated-id-stats?${url}`);

    const dataAPI = await response.json();

    const dataList = lists.reduce((acc, list) => {
      acc[list] = 0;
      return acc;
    }, {});

    if (type === "year") {
      dataAPI.data.forEach((log) => {
        dataList[lists[log.month - 1]] = log.count;
      });
    } else if (type === "month") {
      dataAPI.data.forEach((log) => {
        dataList[lists[log.day - 1]] = log.count;
      });
    } else if (type === "hour") {
      dataAPI.data.forEach((log) => {
        dataList[lists[log.hour - 1]] = log.count;
      });
    }

    const counts = Object.values(dataList);

    if (idValidatedGraph) {
      idValidatedGraph.destroy();
      idValidatedGraph = null;
    }

    idValidatedGraph = new Chart(ctx, {
      type: "bar",
      data: {
        labels: lists,
        datasets: [
          {
            label: "# of ID validated (2024)",
            backgroundColor: "rgb(107, 45, 168)",
            hoverBackgroundColor: "rgba(107, 45, 168, 0.75)",
            data: counts,
            borderWidth: 0.5,
          },
        ],
      },
      options: {
        animation: {
          duration: 1000,
          easing: "easeOutBounce",
        },
      },
    });
  } catch (err) {
    console.error(err);
  }
};

const doughnutGraph = async () => {
  const ctx = document.getElementById("doughnut-graph").getContext("2d");
  try {
    const [response1, response2] = await Promise.all([
      fetch("/app/api/validated-students"),
      fetch("/app/api/enrolled-students"),
    ]);

    const validatedAPI = await response1.json();
    const enrolledAPI = await response2.json();

    const enrolledCount = enrolledAPI.data[0].count;
    const validatedCount = validatedAPI.data[0].count;

    doughnutPercentage.textContent =
      ((enrolledCount / validatedCount) * 100).toFixed(1) + "%";

    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Enrolled", "Validated"],
        datasets: [
          {
            label: "Number of Students",
            data: [enrolledCount, validatedCount],
            backgroundColor: ["rgb(107, 45, 168)", "rgb(144, 68, 220)"],
            hoverOffset: 4,
            borderJoinStyle: "round",
            borderWidth: 1,
          },
        ],
      },
      options: {
        cutout: "90%",
      },
    });
  } catch (err) {
    console.error(err);
  }
};

window.displayType = displayType;
window.displayOptions = displayOptions;
window.monthOptions = monthOptions;
window.dayOptions = dayOptions;

idValidated();
doughnutGraph();
