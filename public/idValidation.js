import { Html5Qrcode } from "html5-qrcode";

const detectionStatus = document.querySelector(".detection-status");
const studentNumber = document.querySelector(".studentNumber");
const html5QrCode = new Html5Qrcode("reader");

function getAspectRatio() {
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth <= 768;

  if (isMobile) {
    return 0.7;
  } else {
    return 0.75;
  }
}

const aspectRatio = getAspectRatio();

const config = {
  fps: 15,
  qrbox: { width: 250, height: 250 },
  aspectRatio: aspectRatio,
};

function startScanning() {
  html5QrCode
    .start(
      { facingMode: "environment" },
      config,
      async (decodedText, decodedResult) => {
        try {
          console.log(`Code matched = ${decodedText}`, decodedResult);
          detectionStatus.classList.remove("hidden");

          const response = await fetch("/app/id-validation/submit", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify({ studentNumber: decodedText }),
          });
          const data = await response.json();
          console.log(data);
          studentNumber.textContent = data.data.validatedStudent.studentNumber;

          html5QrCode.stop().then(() => {
            setTimeout(() => {
              startScanning();
            }, 5000);
          });
        } catch (err) {
          console.error(err);
        }
      },
      (error) => {
        detectionStatus.classList.add("hidden");
      }
    )
    .catch((err) => {
      console.error(`Unable to start scanning: ${err}`);
    });
}

startScanning();
