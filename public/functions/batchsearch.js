const inputForm = document.querySelector('#inputSearch');
let listDisplay = document.querySelector('#searchList');
const removeAllButton = document.querySelector('#removeAllButton');
let message = document.querySelector('#listMessage');
const searchButton = document.querySelector('#searchButton');
let signOut = document.querySelector('#signout');

let batch = [];


function refreshBatch() {
  batch = [];
}

function addName(e) {

  e.preventDefault();
  const input = document.querySelector('#search-input').value;

  if (input === "") return;

  if (batch.length === 15) return message.innerHTML = `<i>List has reached its maximum length of 15</i>`;

  if (batch.find((item) => item === input) === undefined) {
    batch.push(input);
    restoreMessage();
    clearInput();
  }else{
    message.innerHTML = `<i>Name is already on the list. Please type another name</i>`;
  }

  displayList(batch);

}

function displayList(batch) {
  listDisplay.innerHTML = batch.map((name, i) => (
    // Need to understand why the <li> element is not adding numbers.
    `
    <li class="form-row search-name">
        <div class="col-12 col-md-9 mb-2 mb-md-0">
          ${i+1}. ${name}
        </div>
        <span class="col-12 col-md-3">
          <button onClick="removeItem(${i})" id="${i}"type="submit" class="btn btn-block btn-lg btn-primary btn-search-name">Remove</button>
        </span>
    </li>
    `
  )).join('');
}

function removeItem(index) {
  batch.splice(index, 1);
  displayList(batch);
}

function restoreMessage() {
  message.innerHTML = `<i>The following names will be searched (maximum of 15): </i>`;
}

function clearInput() {
  document.querySelector('#search-input').value = "";
}

function handleRemoveAll() {
  batch = [];
  displayList(batch);
  restoreMessage();
  clearInput();
}

function searchBatch(e) {
  e.preventDefault();
  localStorage.setItem('searchItem', JSON.stringify({
    type: 'bulk',
    query: batch
  }));

  window.location.href = "/results";
}

function handleSignOut(e) {
  localStorage.removeItem('profile');
  window.location.href = '/';
}

removeAllButton.onclick = handleRemoveAll;
searchButton.addEventListener('click', searchBatch);
window.onload = refreshBatch;
inputForm.addEventListener('submit', addName);
signOut.addEventListener('click', handleSignOut);
