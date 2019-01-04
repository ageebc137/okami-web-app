//Declare HTML elements from results.hbs
let results = document.querySelector('#listResults'),
      resultsMessage = document.querySelector('#resultsMessage'),
      searchBox = document.querySelector('#searchName');



function searchForResults(e) {
  //Prevent a refresh of the page.
  e.preventDefault();
  //set the query to either the home page's or the result's
  let query = searchBox.querySelector('input').value || (localStorage.getItem('query') || localStorage.getItem('bulkQuery'));
  console.log(query);

if () {

}
  searchOne(query);


}

function searchOne(query) {
  let  queryURI = encodeURIComponent(query),
        querycodeUrl =
        `https://api.trade.gov/consolidated_screening_list/search?api_key=lVRffURh533foYGOFnvH6gnA&q=${queryURI}`;
  axios.get(querycodeUrl).then((res) => {
    //Store response data into local storage.
    localStorage.setItem('results', JSON.stringify(res.data.results));
    //Display results message based on response.
    if (res.data.results.length == 0) {
      resultsMessage.innerHTML = `No results for <b><i>${query}</i></b>. Please conduct another search.`;
    }else{
      resultsMessage.innerHTML = `Your results for <b><i>${query}</i></b>`;

    }

    //Display list of results in table.
    displayResults(res, query);
    localStorage.removeItem('query');

  }).catch(err => console.log(err));
}

function displayResults(res, query) {

  results.innerHTML = res.data.results.map((sdn) => {
    return `
      <tr onclick="displayProfile('${sdn.id}')" id='${sdn.id}'>
        <td>${sdn.name}</td>
        <td>${sdn.type || 'N/A'}</td>
        <td>${sdn.source}</td>
        <td><i>${query}</i></td>
      </tr>
      `
  }).join('');
}

function displayProfile(id) {
  let sdn = JSON.parse(localStorage.getItem('results')).find(sdn => sdn.id == id),
      details;
  if ('type' in sdn) {
    details = `
      <img src='logos/${sdn.type}-icon.png' alt='${sdn.type} logo'>
      <li id='type'><b>Type:</b> ${sdn.type}</li>
      <li id='fullName'><b>Full Name:</b> ${sdn.name};
      <li id='program'><b>Program:</b> ${sdn.source}</li>
    `;
  }else{
    details = `
      <li id='fullName'><b>Full Name:</b> ${sdn.name}
      <li id='program'><b>Program:</b> ${sdn.source}</li>
    `;
  }
  document.querySelector('#details').innerHTML = details;
}

window.onload = searchForResults;
searchBox.addEventListener('submit', searchForResults);
