import Chart from "chart.js/auto";

const ctx = document.getElementById("idvalidated-graph").getContext("2d");

const idValidated = async () => {
  const response = await fetch("/app/api/validated-id-stats?groupby=month", {
    method: "POST",
  });

  const data = await response.json();
  console.log(data);

  const idValidatedGraph = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [
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
      ],
      datasets: [
        {
          label: "# of ID validated",
          backgroundColor: "rgb(255, 99, 132)",
          hoverBackgroundColor: "rgba(255, 99, 133, 0.655)",
          data: [12, 19, 3, 5, 2, 3],
          borderWidth: 0.5,
        },
      ],
    },
    options: {},
  });
};

idValidated();
