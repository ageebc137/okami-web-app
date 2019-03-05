const   formField = document.querySelector('form'),
        message = document.querySelector('#message');

function createUserAccount(e) {
  e.preventDefault();

  let   firstName = document.querySelector('#inputFirstName').value,
        lastName = document.querySelector('#inputLastName').value,
        city = document.querySelector('#inputCity').value,
        state = document.querySelector('#inputState').value,
        password = document.querySelector('#inputPassword').value,
        confirmPassword = document.querySelector('#inputConfirmPassword').value;

  if (password !== confirmPassword) {
    message.innerHTML = `Passwords do not match. Please ensure that passwords are the same.`;
    return;
  }

  let email = document.querySelector('#inputEmail').value;


  const userObj = {
          firstName,
          lastName,
          city,
          state,
          email,
          password
  }

  axios.post('//localhost:3000/createaccount', userObj)
      .then((res) => {
        let data = res.data;
        localStorage.setItem("profile", JSON.stringify(data));
        window.location.href = "/myaccount";
      })
      .catch((e) => {
        message.innerHTML = `<i>Email address <strong>${email}</strong> may already be taken, or email address not formatted correctly.</i>`;
        console.log(e);
      });

}

formField.addEventListener('submit', createUserAccount);
