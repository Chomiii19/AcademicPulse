import Chart from "chart.js/auto";

const ctx = document.getElementById("idvalidated-graph").getContext("2d");

const idValidated = async () => {
  const response = await fetch("/app/api/validated-id-stats?year=2024");

  const dataAPI = await response.json();
  console.log(dataAPI);

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

  const data = monthsList.reduce((acc, month) => {
    acc[month] = 0;
    return acc;
  }, {});

  dataAPI.data.forEach((log) => {
    data[months[log.month - 1]] = log.count;
  });

  const months = Object.keys(data);
  const counts = Object.values(data);

  const idValidatedGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: months,
      datasets: [
        {
          label: "# of ID validated",
          backgroundColor: "rgb(255, 99, 132)",
          hoverBackgroundColor: "rgba(255, 99, 133, 0.655)",
          data: counts,
          borderWidth: 0.5,
        },
      ],
    },
    options: {},
  });
};

idValidated();
