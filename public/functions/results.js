//Declare HTML elements from results.hbs
let results = document.querySelector('#listResults'),
      resultsMessage = document.querySelector('#resultsMessage'),
      searchBox = document.querySelector('#searchName');



function searchForResults(e) {
  //Prevent a refresh of the page.
  e.preventDefault();
  //set the query to either the home page's or the result's
  let searchItem = {};
  if (searchBox.querySelector('input').value) {
    searchItem.type = 'single';
    searchItem.query = searchBox.querySelector('input').value;
  }else if (localStorage.getItem('searchItem')) {
    searchItem = JSON.parse(localStorage.getItem('searchItem'));
  }else {
    return;
  }

  searchItem.type === 'bulk' ? searchMany(searchItem.query) : searchOne(searchItem.query);

  localStorage.removeItem('searchItem');
}

function searchMany(queryArray) {

  let promiseArray = queryArray.filter(query => query !== '').map(query => {
    let  queryURI = encodeURIComponent(query),
          querycodeUrl =
          `https://api.trade.gov/consolidated_screening_list/search?api_key=lVRffURh533foYGOFnvH6gnA&q=${queryURI}`;
          return axios.get(querycodeUrl)
  });
  Promise.all(promiseArray).then((responseArray) => {
    responseArray = responseArray.map((res, i) => {
      return {
        res,
        query: queryArray[i]
      }
    });
    console.log(responseArray);
    resultsMessage.innerHTML = 'Your bulk search results are listed below';
    resultsStorage = [];

    results.innerHTML = responseArray.map(response => {
        return response.res.data.results.map((sdn) => {
          resultsStorage.push(sdn);
          return `
            <tr onclick="displayProfile('${sdn.id}')" id='${sdn.id}'>
              <td>${sdn.name}</td>
              <td>${sdn.type || 'N/A'}</td>
              <td>${sdn.source}</td>
              <td><i>${response.query}</i></td>
            </tr>
            `;
       }).join('');
    }).join('');
    console.log(resultsStorage);
    localStorage.setItem('results', JSON.stringify(resultsStorage));
  });
}



function searchOne(query) {
  let  queryURI = encodeURIComponent(query),
        querycodeUrl =
        `https://api.trade.gov/consolidated_screening_list/search?api_key=lVRffURh533foYGOFnvH6gnA&name=${queryURI}&fuzzy_name=true`;
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
    // localStorage.removeItem('searchItem');

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
      `;
  }).join('');
}

function displayProfile(id) {
  let sdn = JSON.parse(localStorage.getItem('results')).find(sdn => sdn.id == id),
      details,
      identifications,
      aliases,
      addresses;
  if ('type' in sdn) {

    let placesOfBirth = sdn.places_of_birth.map(place => place).join('; ');
    let dateOfBirth = sdn.dates_of_birth.map(date => date).join('; ');
    let programs = sdn.programs.map(program => program).join('; ');

    details = `
      <img src='/logos/${sdn.type.toLowerCase()}-icon.png' alt='${sdn.type} logo'>
      <li id='type'><b>Type:</b> ${sdn.type}</li>
      <li id='fullName'><b>Full Name:</b> ${sdn.name}</li>
      <li id='listDesignation'><b>List:</b> ${sdn.source}</li>
      <li id='listPrograms'><b>Programs:</b> ${programs}</li>
      <li id='dateOfBirth'><b>Date of Birth: </b>${dateOfBirth || 'N/A'}</li>
      <li id='placeOfBirth'><b>Places of Birth: </b>${placesOfBirth || 'N/A'}</li>
    `;

    identifications = sdn.ids.map((id, i) => {
      let header = ``;
        if (i == 0) {
          header = `<thead>
            <th><u>Type</u></th>
            <th><u>ID #</u></th>
            <th><u>Country</u></th>
            <th><u>Issue Date</u></th>
            <th><u>Expire Date</u></th>
          </thead>
          `
        }

       return header + `
       <tr>
        <td>${id.type || ''}</td>
        <td>${id.number || ''}</td>
        <td>${id.country || ''}</td>
        <td>${id.issue_date || ''}</td>
        <td>${id.expiration_date || ''}</td>
       </tr>
       `;
     }).join('');

       aliases =   sdn.alt_names.map((name, i) => {
         let header = ``;
           if (i == 0) {
             header = `
               <thead>
                 <th><u>Aliases</u></th>
               </thead>
             `
           }
          return header + `
          <tr>
            <td>${name}</td>
          </tr>
          `;
        }).join('');

        addresses = sdn.addresses.map((address,i) => {
          let header = ``;
            if (i == 0) {
              header =  `
                <thead>
                  <th><u>Address</u></th>
                  <th><u>City</u></th>
                  <th><u>State/Province</u></th>
                  <th><u>Postal Code</u></th>
                  <th><u>Country</u></th>
                </thead>
              `
            }
           return  header + `
           <tr>
             <td>${address.address || ''}</td>
             <td>${address.city || ''}</td>
             <td>${address.state || ''}</td>
             <td>${address.postal_code || ''}</td>
             <td>${address.country || ''}</td>
           </tr>
           `;
         }).join('');

  }else{
    details = `
      <li id='fullName'><b>Full Name:</b> ${sdn.name}
      <li id='program'><b>Program:</b> ${sdn.source}</li>
    `;
    identifications = ``;
    aliases = ``;
    addresses = `
      <thead>
        <th><u>Address</u></th>
        <th><u>City</u></th>
        <th><u>State/Province</u></th>
        <th><u>Postal Code</u></th>
        <th><u>Country</u></th>
      </thead>
    ` + sdn.addresses.map(address => {
       return `
       <tr>
         <td>${address.address || ''}</td>
         <td>${address.city || ''}</td>
         <td>${address.state || ''}</td>
         <td>${address.postal_code || ''}</td>
         <td>${address.country || ''}</td>
       </tr>
       `;
     }).join('');



  }

  document.querySelector('#details').innerHTML = details;
  document.querySelector('#identifications').innerHTML = identifications;
  document.querySelector('#aliases').innerHTML = aliases;
  document.querySelector('#addresses').innerHTML = addresses;

  document.querySelector('#source').innerHTML =
   `For more information please check out <a href='${sdn.source_information_url}' target='_blank'>this link</a>`
}

window.onload = searchForResults;
searchBox.addEventListener('submit', searchForResults);
