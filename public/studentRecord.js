const form = document.querySelector(".drop-zone");
const fileInput = form.querySelector(".file-input");
const formText = document.querySelector(".form-text");
const uploadLogo = document.querySelector(".fa-cloud-arrow-up");
const fileUploadOngoing = document.querySelector(".ongoing");
const fileName = document.querySelector(".file-name");
const fileSize = document.querySelector(".size");
const loadingIcon = document.querySelector(".fa-spinner");
const completeIcon = document.querySelector(".fa-square-check");
const dragDropContainer = document.querySelector(".drag-drop-container");
const studentRecordContainer = document.querySelector(
  ".student-record-container"
);
const pages = document.querySelectorAll(".page");
const nextBtn = document.querySelector(".next");
const previousBtn = document.querySelector(".prev");
const main = document.querySelector(".main");

form.addEventListener("click", () => {
  fileInput.click();
});

fileInput.onchange = ({ target }) => {
  handleFile(target.files[0]);
};

form.addEventListener("dragover", (e) => {
  e.preventDefault();
  uploadLogo.classList.add("uploading");
  formText.textContent = "Drop the file";
});

form.addEventListener("dragleave", () => {
  uploadLogo.classList.remove("uploading");
  formText.textContent = "Browse File to Upload";
});

form.addEventListener("drop", (e) => {
  e.preventDefault();
  uploadLogo.classList.remove("uploading");
  formText.textContent = "Browse File to Upload";

  const files = e.dataTransfer.files;
  if (files.length > 0) {
    handleFile(files[0]);
  }
});

const handleFile = (file) => {
  if (file) {
    fileUploadOngoing.classList.add("active");
    fileName.textContent = `${file.name} • Uploading`;
    loadingIcon.classList.remove("remove");
  }

  upload(file);
};

const upload = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch("/app/api/upload", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      const data = await response.json();
      fileName.textContent = `${file.name} • Uploaded`;
      fileSize.textContent = `${Math.round(file.size / 1024)} KB`;
      completeIcon.classList.remove("remove");
      loadingIcon.classList.add("remove");

      setTimeout(() => {
        dragDropContainer.classList.add("remove");
        main.classList.remove("blurred");
        displayStudentRecord(1);
      }, 3000);
    } else throw new Error("There was an error uploading the file.");
  } catch (err) {
    fileName.textContent = `${file.name} • Error`;
    console.error(err);
  }
};

const studentRecordAppend = (student) => {
  return `
    <div class="student-record">
        <p>
            Student Number: <span class="studentNumber">${
              student.studentNumber
            }</span>
        </p>
        <div class="fullname">
            <p>Surname: <span class="surname">${student.surname}</span></p>
            <p>First name: <span class="firstname">${
              student.firstname
            }</span></p>
            <p>Middle name: <span class="middlename">${
              student.middlename || ""
            }</span></p>
            <p>Extension: <span class="extension">${
              student.extension || ""
            }</span></p>
        </div>

        <p>Course: <span class="course">${student.course}</span></p>
        <p>Year Level: <span class="course">${student.yearLevel}</span></p>
        <p>
            Email:
            <span class="email">${student.email}</span>
        </p>
        <p>Status: <span class="enrollStatus">${
          student.isEnrolled ? "Enrolled" : "Not Enrolled"
        }</span></p>
        <p>Date enrolled: <span class="date-enrolled">${
          student.isEnrolledAt
        }</span></p>
    </div>`;
};
let totalPages;
const displayStudentRecord = async (page = 1) => {
  try {
    const response = await fetch(`/app/api/getAllStudents?page=${page}`);
    if (!response.ok) throw new Error(response.message);

    const data = await response.json();
    if (!data.totalStudents) {
      dragDropContainer.classList.remove("remove");
      main.classList.add("blurred");
    }

    const students = data.data;
    totalPages = data.pages;

    students.forEach((student) => {
      const studentRecord = studentRecordAppend(student);
      studentRecordContainer.insertAdjacentHTML("beforeend", studentRecord);
    });
  } catch (err) {
    console.error(err);
  }
};

let start = 1;
let end = 3;
let currentPage = 1;
const renderPagination = () => {
  pages.forEach((page, index) => {
    page.textContent = start + index;
    page.dataset.page = start + index;
  });

  previousBtn.disabled = start === 1;
  nextBtn.disabled = end === totalPages;
  displayStudentRecord(currentPage);
};

pages.forEach((page) => {
  page.addEventListener("click", (event) => {
    currentPage = parseInt(event.target.dataset.page);

    if (currentPage === end && end < totalPages) {
      start++;
      end++;
    } else if (currentPage === start && start > 1) {
      start--;
      end--;
    }

    renderPagination();
  });
});

previousBtn.addEventListener("click", () => {
  if (start > 1) {
    start--;
    currentPage--;
    end--;
  }

  renderPagination();
});

nextBtn.addEventListener("click", () => {
  if (end < totalPages) {
    start++;
    currentPage++;
    end++;
  }

  renderPagination();
});

displayStudentRecord();
renderPagination();
