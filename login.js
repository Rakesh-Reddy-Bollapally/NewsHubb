
document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");

  function getUsers() {
    const storedUsers = localStorage.getItem("users");
    if (storedUsers) {
      return JSON.parse(storedUsers);
    } else {
      return [];
    }
  }

  function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
  }


  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault(); 

      const email = document.getElementById("loginEmail").value;
      const password = document.getElementById("loginPassword").value;
      const message = document.getElementById("loginMsg");

      const users = getUsers();


      const foundUser = users.find(user => user.email === email && user.password === password);

      if (foundUser) {
        message.style.color = "green";
        message.textContent = `Welcome, ${foundUser.name}! Redirecting...`;


        localStorage.setItem("loggedInUser", JSON.stringify(foundUser));


        setTimeout(() => {
          window.location.href = "news.html";
        }, 1500);
      } else {
        message.style.color = "red";
        message.textContent = "Invalid email or password!";
      }
    });
  }


  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault(); // 
      const name = document.getElementById("regName").value;
      const email = document.getElementById("regEmail").value;
      const password = document.getElementById("regPassword").value;
      const confirmPassword = document.getElementById("regConfirmPassword").value;
      const message = document.getElementById("registerMsg");

     
      if (password !== confirmPassword) {
        message.style.color = "red";
        message.textContent = "Passwords do not match!";
        return;
      }

      const users = getUsers();

      const emailExists = users.some(user => user.email === email);
      if (emailExists) {
        message.style.color = "red";
        message.textContent = "Email already registered!";
        return;
      }

      const newUser = { name, email, password };
      users.push(newUser);
      saveUsers(users);

      message.style.color = "green";
      message.textContent = "Registration successful! Redirecting...";

      setTimeout(() => {
        window.location.href = "login.html";
      }, 1500);
    });
  }
});
