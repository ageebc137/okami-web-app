let queryField = document.querySelector('#searchName');


let getQuery = function(e) {
  e.preventDefault();
  let query = this.querySelector('input').value;
  localStorage.setItem('query', query);
  window.location.href = '/results';
}

queryField.addEventListener('submit', getQuery);
