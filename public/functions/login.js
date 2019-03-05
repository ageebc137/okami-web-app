const form = document.querySelector('form');
const message = document.querySelector('#message');


function submitEmailPassword(e) {
  e.preventDefault();
  const email = document.querySelector('#inputEmail').value;
  const password = document.querySelector('#inputPassword').value;
  axios.post(('//localhost:3000/getuser'), {email, password}).then((res) => {
    let data = res.data;
    localStorage.setItem('profile',JSON.stringify(data));
    window.location.href="/myaccount";
  }).catch((e) => {
    if (e) {
      message.innerHTML = `<i>Email address does not match any account, and/or password is incorrect.</i>`;
    }
  })

}



form.addEventListener('submit', submitEmailPassword);
