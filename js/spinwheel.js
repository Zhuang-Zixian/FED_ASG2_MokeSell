const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");

// Define the degree ranges for values 1-6
const rotationValues = [
  { minDegree: 0, maxDegree: 30, value: 2 },
  { minDegree: 31, maxDegree: 90, value: 1 },
  { minDegree: 91, maxDegree: 150, value: 6 },
  { minDegree: 151, maxDegree: 210, value: 5 },
  { minDegree: 211, maxDegree: 270, value: 4 },
  { minDegree: 271, maxDegree: 330, value: 3 },
  { minDegree: 331, maxDegree: 360, value: 2 },
];

// **Manually mapped discount percentages**
const discountMapping = {
  1: "12%",
  2: "9%",
  3: "10%",
  4: "20%",
  5: "25%",
  6: "5%",
};

// **Ensure slices remain equal in size**
const data = [16, 16, 16, 16, 16, 16];
const pieColors = ["#0d6efd", "#609ffc", "#0d6efd", "#609ffc", "#0d6efd", "#609ffc"];

// **Create the Pie Chart**
let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [1, 2, 3, 4, 5, 6], // Keep 1-6 for internal mapping
    datasets: [{ backgroundColor: pieColors, data: data }],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// **Reset wheel before each spin**
const resetWheel = () => {
  myChart.options.rotation = 0;
  myChart.update();
};

// **Determine the discount based on the final stopping angle**
const valueGenerator = (angleValue) => {
  let selectedValue = null;

  // Loop through rotationValues to find the matching segment
  for (let i = 0; i < rotationValues.length; i++) {
    if (angleValue >= rotationValues[i].minDegree && angleValue <= rotationValues[i].maxDegree) {
      selectedValue = rotationValues[i].value;
      break;
    }
  }

  // **Assign hardcoded discount**
  let discount = discountMapping[selectedValue] || "No Discount";

  // **Display the correct discount result with claim button**
  finalValue.innerHTML = `
    <p>🎉 You won a <strong>${discount} Discount!</strong></p>
    <button id="claim-btn" class="claim-btn">Claim Discount</button>
  `;
  
  spinBtn.disabled = false;

  // **Attach event listener to claim button**
  document.getElementById("claim-btn").addEventListener("click", () => {
    alert(`🎉 Your ${discount} discount has been claimed!`);
    console.log(`User claimed ${discount} discount`);
  });
};

// **Spin logic**
spinBtn.addEventListener("click", () => {
  spinBtn.disabled = true;
  finalValue.innerHTML = `<p>Spinning...</p>`;

  resetWheel(); // Reset wheel before spinning

  let randomDegree = Math.floor(Math.random() * 360) + 1800; // Ensures multiple rotations before stopping
  let currentRotation = 0;
  let spinSpeed = 20;

  let rotationInterval = setInterval(() => {
    currentRotation += spinSpeed;

    if (currentRotation >= randomDegree) {
      clearInterval(rotationInterval);

      let stoppingAngle = randomDegree % 360; // Get final stopping angle
      valueGenerator(stoppingAngle); // Determine the winning discount
      spinBtn.disabled = false;
    }

    myChart.options.rotation = currentRotation % 360;
    myChart.update();
  }, 10);
});


// JS Code to send the voucher won to the RestDB collection