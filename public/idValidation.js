import { Html5Qrcode } from "html5-qrcode";

const detectionStatus = document.querySelector(".detection-status");
const studentNumber = document.querySelector(".student-number");
const idStatus = document.querySelector(".id-status");
const html5QrCode = new Html5Qrcode("reader");

let isScanning = true; // Flag to prevent multiple entries

function getAspectRatio() {
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth <= 768;
  return isMobile ? 0.7 : 0.75;
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
        // Only process if scanning is allowed
        if (isScanning) {
          isScanning = false; // Block further scanning
          try {
            console.log(`Code matched = ${decodedText}`, decodedResult);

            // Send the decoded text (student number) to your server
            const response = await fetch("/app/id-validation/submit", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ studentNumber: decodedText }),
            });

            const data = await response.json();
            console.log(data);

            studentNumber.textContent = decodedText;

            if (data.status === "Success") {
              // Update the student number on the UI
              idStatus.textContent = data.message;
              // Stop scanning and pause for 5 seconds
              html5QrCode.stop().then(() => {
                setTimeout(() => {
                  console.log("Restarting QR code scanning...");
                  isScanning = true; // Re-enable scanning
                  studentNumber.textContent = "";
                  idStatus.textContent = "";
                  startScanning(); // Restart scanning after 5 seconds
                }, 5000);
              });
            } else {
              idStatus.textContent = data.message;
              isScanning = true; // Re-enable scanning in case of error
            }
          } catch (err) {
            console.error("Error processing QR code:", err);
            isScanning = true; // Re-enable scanning in case of error
          }
        }
      },
      (error) => {
        // console.log("QR code scan error:", error);
      }
    )
    .catch((err) => {
      console.error(`Unable to start scanning: ${err}`);
    });
}

startScanning();
