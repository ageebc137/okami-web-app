const searchForm = document.querySelector('form');

function handleSearchForm(e) {
  e.preventDefault();
  let query =  searchForm.querySelector('input').value;
  localStorage.setItem('searchItem', JSON.stringify({
    type: 'single',
    query: query
  }));
  window.location.href = '/tryit';
}

searchForm.addEventListener('submit', handleSearchForm);
