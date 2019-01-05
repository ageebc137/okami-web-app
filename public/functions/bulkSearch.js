let btns = document.querySelectorAll("button"),
    querySection = document.querySelector("#inputSection");

function toggle(e) {
  if (this.id === 'add-button') {
    addQuery();
  }else if (this.id === 'remove-button') {
    removeQuery(e);
  }else {
    searchQueries(e);
  }
}

function addQuery() {
  if (querySection.childElementCount >= 20) {return;}
  let input = document.createElement('li');
  input.innerHTML = `<input type="textarea" placeholder=' Search entity or individual here' id='searchInput' /required>`;
  querySection.appendChild(input);
}

function removeQuery(e) {
  e.preventDefault();
  if (querySection.childElementCount <= 2) {return;}
  let queries = document.querySelectorAll(`ul[id='inputSection'] > li`);
  querySection.removeChild(queries[queries.length - 1]);
}

function searchQueries(e) {
  let queries = document.querySelectorAll(`ul[id='inputSection'] > li`);
  let array = [];
  queries.forEach(query => array.push(query.firstChild.value));
  localStorage.setItem('searchItem', JSON.stringify({
    type: 'bulk',
    query: array
  }));
  window.location.href = '/results';
}

btns.forEach(btn => btn.addEventListener('click', toggle));
