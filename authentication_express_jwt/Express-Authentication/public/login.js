let loginForm = document.getElementById("login-form");

loginForm.onsubmit = function (e) {
  e.preventDefault();
  fetch("http://localhost:3000/api/v1/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginForm.email.value,
      password: loginForm.password.value,
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((err) => {
      console.log(err);
    });
};
