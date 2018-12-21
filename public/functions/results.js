console.log(localStorage.getItem('query'));
const results = document.querySelector('#listResults');

function getResults(e) {
  e.preventDefault();
  let query = localStorage.getItem('query');
  let queryURI = encodeURIComponent(query);
  let querycodeUrl = `https://api.trade.gov/consolidated_screening_list/search?api_key=lVRffURh533foYGOFnvH6gnA&q=${queryURI}`


  axios.get(querycodeUrl).then((res) => {
    console.log(res.data.results);
    results.innerHTML = res.data.results.map((sdn) => {
      return `
        <tr>
          <td>${sdn.name}</td>
          <td>${sdn.programs}</td>
          <td>${query}</td>
        </tr>
      `
    }).join('')
  }).catch(err => console.log(err));
}

window.onload = getResults;
