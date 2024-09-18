import { Html5Qrcode } from "html5-qrcode";
import Typed from "typed.js";

const studentNumber = document.querySelector(".student-number");
const idStatus = document.querySelector(".id-status");
const qrDetails = document.querySelector(".qr-details");
const scanning = document.querySelector(".scanning-effect");
const html5QrCode = new Html5Qrcode("reader");

const typed = new Typed(".typed-text", {
  strings: [".", "..", "..."],
  typeSpeed: 50,
  backSpeed: 0,
  loop: true,
  showCursor: false,
});

let isScanning = true;

const config = {
  fps: 15,
  qrbox: { width: 250, height: 250 },
  aspectRatio: 1.0,
};

function startScanning() {
  idStatus.textContent = "";
  scanning.style.display = "flex";
  studentNumber.textContent = "";
  qrDetails.style.background =
    "linear-gradient(45deg, #6b2da8, rgba(83, 18, 158, 0.62))";
  html5QrCode
    .start(
      { facingMode: "environment" },
      config,
      async (decodedText, decodedResult) => {
        if (isScanning) {
          isScanning = false;
          try {
            const response = await fetch("/app/student-log/entrance/submit", {
              method: "POST",
              headers: {
                "Content-type": "application/json",
              },
              body: JSON.stringify({ studentNumber: decodedText }),
            });

            const data = await response.json();
            studentNumber.textContent = decodedText;

            if (data.status === "Success") {
              scanning.style.display = "none";
              idStatus.textContent = data.message || "";
              qrDetails.style.background =
                "linear-gradient(to top left, #39b385, #8ed74d)";

              html5QrCode.stop().then(() => {
                setTimeout(() => {
                  isScanning = true;
                  startScanning();
                }, 5000);
              });
            } else {
              scanning.style.display = "none";
              idStatus.textContent = data.message;
              qrDetails.style.background =
                "linear-gradient(to top left, #e52a5a, #ff585f)";
              setTimeout(() => {
                isScanning = true;
                startScanning();
              }, 3000);
            }
          } catch (err) {
            console.error("Error processing QR code:", err);
            setTimeout(() => {
              isScanning = true;
              startScanning();
            }, 3000);
          }
        }
      },
      (error) => {}
    )
    .catch((err) => {
      console.error(`Unable to start scanning: ${err}`);
    });
}

startScanning();
