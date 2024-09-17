const welcomeUser = document.querySelector(".welcome-user");
const time = document.querySelector(".time");
const header = document.querySelector("header");
const sidebarBtn = document.querySelector(".fa-bars");
const sidebar = document.querySelector(".sidebar");
const section = document.querySelector(".section-contain");

function updateDateTime() {
  const now = new Date();
  const formattedDateTime = now.toLocaleString();
  time.textContent = formattedDateTime;
}

setInterval(updateDateTime, 1000);
updateDateTime();

const loadData = async () => {
  try {
    const response = await fetch("/users/api/user");
    const data = await response.json();

    if (data?.data?.user?.firstname) {
      welcomeUser.textContent = `Welcome, ${
        data.data.user.firstname.split(" ")[0]
      }!`;
    } else {
      console.warn("User's firstname is not available.");
      welcomeUser.textContent = "Welcome, User!";
    }
  } catch (err) {
    console.error(err);
  }
};

loadData();

sidebarBtn.addEventListener("click", () => {
  sidebar.classList.add("sidebar-active");
  section.classList.add("blurred");
  header.classList.add("blurred");
});

section.addEventListener("click", (event) => {
  if (sidebar.classList.contains("sidebar-active")) {
    sidebar.classList.remove("sidebar-active");
    section.classList.remove("blurred");
    header.classList.remove("blurred");
  }
});
