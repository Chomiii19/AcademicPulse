import { Html5Qrcode } from "html5-qrcode";

const detectionStatus = document.querySelector(".detection-status");
const studentNumber = document.querySelector(".student-number");
const idStatus = document.querySelector(".id-status");
const qrDetails = document.querySelector(".qr-details");
const surname = document.querySelector(".surname");
const firstname = document.querySelector(".firstname");
const middlename = document.querySelector(".middlename");
const extension = document.querySelector(".extension");
const course = document.querySelector(".course");
const html5QrCode = new Html5Qrcode("reader");

const student = (student) => {
  surname.textContent = student?.data?.student?.surname
    ? `${student.data.student.surname},`
    : "";
  firstname.textContent = student?.data?.student?.firstname || "";
  middlename.textContent = student?.data?.student?.middlename || "";
  extension.textContent = student?.data?.student?.extension || "";
  course.textContent = student?.data?.student?.course
    ? `Course: ${student.data.student.course}`
    : "";
  idStatus.textContent = student?.message || "";
};

let isScanning = true;

function getAspectRatio() {
  const viewportWidth = window.innerWidth;
  const isMobile = viewportWidth <= 768;
  return isMobile ? 1.0 : 0.75;
}

const aspectRatio = getAspectRatio();

const config = {
  fps: 15,
  qrbox: { width: 250, height: 250 },
  aspectRatio: aspectRatio,
};

function startScanning() {
  student(undefined);
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
            console.log(`Code matched = ${decodedText}`, decodedResult);

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
              student(data);
              qrDetails.style.background =
                "linear-gradient(to top left, #39b385, #8ed74d)";

              html5QrCode.stop().then(() => {
                setTimeout(() => {
                  isScanning = true;
                  startScanning();
                }, 5000);
              });
            } else {
              idStatus.textContent = data.message;
              qrDetails.style.background =
                "linear-gradient(to top left, #e52a5a, #ff585f)";
              setTimeout(() => (isScanning = true), 3000);
            }
          } catch (err) {
            console.error("Error processing QR code:", err);
            setTimeout(() => (isScanning = true), 3000);
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
