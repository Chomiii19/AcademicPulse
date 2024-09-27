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

      setTimeout(() => dragDropContainer.classList.add("remove"), 3000);
    } else throw new Error("There was an error uploading the file.");
  } catch (err) {
    fileName.textContent = `${file.name} • Error`;
    console.error(err);
  }
};
