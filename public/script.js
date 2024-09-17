import Typed from "typed.js";

const popup = document.querySelector(".popUp");
const sections = document.querySelectorAll("section");
const header = document.querySelector("header");
const popupTitle = document.querySelector(".popupTitle");
const signupForm = document.querySelector(".signup-form");
const loginForm = document.querySelector(".login-form");
const success = document.querySelector(".success");
const signupBtn = document.querySelector(".signup-btn");
const loginBtn = document.querySelector(".login-btn");
const getStarted = document.querySelector(".get-started");
const sidebarBtn = document.querySelector(".fa-bars");
const sidebar = document.querySelector(".sidebar");
const sidebarLoginBtn = document.querySelector(".login-sidebar");
const sidebarSignupBtn = document.querySelector(".signup-sidebar");
const sidebarBtns = document.querySelectorAll(".sidebar-btns");

const typed = new Typed(".typed-text", {
  strings: [" Student Logs", " ID Management", " School Admins"],
  typeSpeed: 50,
  backSpeed: 50,
  loop: true,
  showCursor: false,
});

const openPopup = () => {
  popup.classList.add("slideup");
  sections.forEach((section) => section.classList.add("blurred"));
  header.classList.add("blurred");
};

const closePopup = () => {
  sections.forEach((section) => section.classList.remove("blurred"));
  popup.classList.remove("slideup");
  header.classList.remove("blurred");
};

const addSignupForm = () => {
  popupTitle.textContent = "Sign Up";
  signupForm.classList.remove("hidden");
  loginForm.classList.add("hidden");
  success.classList.add("hidden");
  openPopup();
};

const addLoginForm = () => {
  popupTitle.textContent = "Log In";
  loginForm.classList.remove("hidden");
  signupForm.classList.add("hidden");
  success.classList.add("hidden");
  openPopup();
};

signupBtn.addEventListener("click", addSignupForm);

sidebarSignupBtn.addEventListener("click", () => {
  addSignupForm();
  sidebar.classList.remove("sidebar-active");
});

loginBtn.addEventListener("click", addLoginForm);

sidebarLoginBtn.addEventListener("click", () => {
  addLoginForm();
  sidebar.classList.remove("sidebar-active");
});

getStarted.addEventListener("click", (event) => {
  event.stopPropagation();
  addSignupForm();
});

document.addEventListener("keydown", (event) => {
  event.key === "Escape" &&
    header.classList.contains("blurred") &&
    closePopup();
});

document.body.addEventListener("click", (event) => {
  if (event.target.closest("section")) {
    if (header.classList.contains("blurred")) closePopup();

    if (sidebar.classList.contains("sidebar-active"))
      sidebar.classList.remove("sidebar-active");
  }
});

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("sidebar-active");
  sections.forEach((section) => section.classList.add("blurred"));
  header.classList.add("blurred");
});

const signupSuccess = () => {
  popupTitle.textContent = "";
  signupForm.classList.add("hidden");
  success.classList.remove("hidden");
};

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    const result = await response.json();

    console.log(result);
    if (result.status === "Success") {
      signupForm.reset();
      signupSuccess();

      setTimeout(() => closePopup(), 5000);
    }
  } catch (error) {
    console.error(error);
  }
});

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(loginForm);
  const data = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/users/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    window.location.href = response.url;
  } catch (err) {
    console.error(err);
  }
});
