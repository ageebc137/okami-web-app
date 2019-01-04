let queryField = document.querySelector(`#searchName`);
console.log(queryField);

let getQuery = function(e) {
  e.preventDefault();
  let query = this.querySelector('input').value;
  localStorage.setItem('query', query);
  window.location.href = '/results';
}

queryField.addEventListener('submit', getQuery);

let bulkBtn = document.querySelector('#bulkSearch');


function bulkSearch(e) {
  e.preventDefault();
  console.log(this);
  window.location.href = '/bulksearch';
}

bulkBtn.addEventListener('click', bulkSearch);
