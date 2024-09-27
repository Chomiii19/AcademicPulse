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
const filterContainer = document.querySelector(".filter-container");
const deleteBtn = document.querySelector(".delete-btn");

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
        renderPagination();
      }, 3000);
    } else throw new Error("There was an error uploading the file.");
  } catch (err) {
    fileName.textContent = `${file.name} • Error`;
    console.error(err);
  }
};

let studentQuery = "",
  yearLevelQuery = "",
  courseQuery = "";

filterContainer.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(filterContainer);
  const data = Object.fromEntries(formData.entries());

  studentQuery = data.studentNumber
    ? `studentNumber=${data.studentNumber}&`
    : "";
  yearLevelQuery = data.yearLevel ? `yearLevel=${data.yearLevel}&` : "";
  courseQuery = data.course ? `course=${data.course}&` : "";

  displayStudentRecord(studentQuery, yearLevelQuery, courseQuery);
});

deleteBtn.addEventListener("click", async (event) => {
  event.preventDefault();
  try {
    const response = await fetch("/app/api/delete-record");

    if (!response.ok) throw new Error("Failed to delete record");
    const data = await response.json();

    setTimeout(() => {
      start = 1;
      end = 3;
      currentPage = 1;
      main.classList.add("blurred");
      dragDropContainer.classList.remove("remove");
    }, 2000);
  } catch (err) {
    console.error(err);
  }
});

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
          student.isEnrolledAt ? student.isEnrolledAt.split("T")[0] : ""
        }</span></p>
    </div>`;
};
let totalPages;
const displayStudentRecord = async (
  student = "",
  yearLevel = "",
  course = "",
  page = 1
) => {
  try {
    studentRecordContainer.innerHTML = "";
    const response = await fetch(
      `/app/api/getAllStudents?${student}${yearLevel}${course}page=${page}`
    );
    if (!response.ok) throw new Error(response.message);

    const data = await response.json();
    if (!data.totalStudents) {
      dragDropContainer.classList.remove("remove");
      main.classList.add("blurred");
    } else {
      const students = data.data;
      totalPages = data.pages;

      students.forEach((student) => {
        const studentRecord = studentRecordAppend(student);
        studentRecordContainer.insertAdjacentHTML("beforeend", studentRecord);
      });
    }
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

  pages.forEach((pg) => pg.classList.remove("active-page"));

  const currentPageElement = [...pages].find(
    (pg) => parseInt(pg.dataset.page) === currentPage
  );
  if (currentPageElement) currentPageElement.classList.add("active-page");

  previousBtn.disabled = start === 1;
  nextBtn.disabled = end === totalPages;
  displayStudentRecord(studentQuery, yearLevelQuery, courseQuery, currentPage);
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

if (dragDropContainer.classList.contains("remove")) displayStudentRecord();
else main.classList.add("blurred");
