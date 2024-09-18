import Chart from "chart.js/auto";

const ctx = document.getElementById("idvalidated-graph").getContext("2d");

const idValidated = async () => {
  const response = await fetch("/app/api/validated-id-stats?groupby=month");

  const dataAPI = await response.json();
  console.log(dataAPI);

  const months = Object.keys(dataAPI.data);
  const counts = Object.values(dataAPI.data);

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
