//Declare HTML elements from results.hbs
let results = document.querySelector('#listResults'),
      resultsMessage = document.querySelector('#results-message'),
      searchForm = document.querySelector('#search-form'),
      signOut = document.getElementById('signout');



function searchForResults(e) {
  //Prevent a refresh of the page.
  e.preventDefault();

  //set the query to either the home page's or the result's
  let searchItem = {};
  if (searchForm.querySelector('input').value) {
    searchItem.type = 'single';
    searchItem.query = searchForm.querySelector('input').value;
  }else if (localStorage.getItem('searchItem')) {
    searchItem = JSON.parse(localStorage.getItem('searchItem'));
  }else {
    return;
  }
  console.log(searchItem);

  searchItem.type === 'bulk' ? searchMany(searchItem.query) : searchOne(searchItem.query);

  localStorage.removeItem('searchItem');
}

function searchMany(queryArray) {

  // //localhost:3000/searchmany
  // https://okami-sanctions.herokuapp.com/searchmany
  axios.post('https://okami-sanctions.herokuapp.com/searchbatch', {queryArray}).then((res) => {
    let responseArray = res.data;
    resultsMessage.innerHTML = 'Your bulk search results are listed below';
    resultsStorage = [];
    console.log(responseArray);

    results.innerHTML = responseArray.map(response => {
        return response.result.results.map((sdn) => {
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
  }).catch((e) => {
    console.log(e);
  });

}



function searchOne(query) {
  let  queryURI = encodeURIComponent(query);
  console.log(queryURI);
  // //localhost:3000/search
  // https://okami-sanctions.herokuapp.com/search
  axios.post('https://okami-sanctions.herokuapp.com/search', {queryURI}).then((res) => {
    console.log(res);
    //Store response data into local storage.
    localStorage.setItem('results', JSON.stringify(res.data.results));
    //Display results message based on response.
    if (res.data.results.length == 0) {
      resultsMessage.innerHTML = `No results for <b><i>${query}</i></b>. Please conduct another search.`;
      document.querySelector('#details').innerHTML = `<p>No results listed</p>`;

    }else{
      resultsMessage.innerHTML = `Your results for <b><i>${query}</i></b>`;
      document.querySelector('#details').innerHTML = `<p>Please select a result in the listing</p>`;
    }
      document.querySelector('#identifications').innerHTML = ``;
      document.querySelector('#aliases').innerHTML = ``;
      document.querySelector('#addresses').innerHTML = ``;
      document.querySelector('#source').innerHTML = ``;
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
  let source = sdn.source;
  if (source === "Specially Designated Nationals (SDN) - Treasury Department") {

    let placesOfBirth = sdn.places_of_birth.map(place => place).join('; ');
    let dateOfBirth = sdn.dates_of_birth.map(date => date).join('; ');
    let programs = sdn.programs.map(program => program).join('; ');

    details = `
      <img src='/logos/${sdn.type.toLowerCase()}-icon.png' alt='${sdn.type} logo'>
      <li id='fullName'><b>Full Name:</b> ${sdn.name}</li>
      <li id='type'><b>Type:</b> ${sdn.type}</li>
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

  }else if (source === "Entity List (EL) - Bureau of Industry and Security"){
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
    ` + (sdn.addresses.map(address => {
       return `
       <tr>
         <td>${address.address || ''}</td>
         <td>${address.city || ''}</td>
         <td>${address.state || ''}</td>
         <td>${address.postal_code || ''}</td>
         <td>${address.country || ''}</td>
       </tr>
       `;
     }).join('') || "" );

  }else if (source === "Denied Persons List (DPL) - Bureau of Industry and Security") {
    details = `
      <li id='fullName'><b>Full Name:</b> ${sdn.name}
      <li id='program'><b>Program:</b> ${sdn.source}</li>
    `;
    identifications = `
    <thead>
      <th><u>ID #</u></th>
    </thead>
    <tr>
     <td>${sdn.id}</td>
    </tr>`;
    aliases = '';
    addresses = '';
  }else{
    details = `
      <li id='fullName'><b>Full Name:</b> ${sdn.name}
      <li id='program'><b>Program:</b> ${sdn.source}</li>
    `;
    identifications = `
    <thead>
      <th><u>ID #</u></th>
    </thead>
    <tr>
     <td>${sdn.id}</td>
    </tr>`;
    aliases = sdn.alt_names.map((name, i) => {
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
     addresses = '';

  }

  document.querySelector('#details').innerHTML = details;
  document.querySelector('#identifications').innerHTML = identifications;
  document.querySelector('#aliases').innerHTML = aliases;
  document.querySelector('#addresses').innerHTML = addresses;

  document.querySelector('#source').innerHTML =
   `<p>For more information please check out <a href='${sdn.source_information_url}' target='_blank'>this link</a></p>
   <button id="saveReport">Save Report</button>
   <button onClick="printProfile()" id="print">Print Report</button>
   `;

   document.querySelector('#saveReport').addEventListener('click', function(e) {
      let body = JSON.parse(localStorage.getItem('profile'));
      let index = body.account.reports.find((report) => report.id === sdn.id);
      if (index !== undefined) return;
      let report = sdn;
      let user = body.user;
      let _userid = body.user._id;
      axios.post('https://okami-sanctions.herokuapp.com/update', {_userid, report}).then((res) => {
          let data = {};
          data.account = res.data;
          data.user = user;
          localStorage.setItem('profile', JSON.stringify(data));
      });
   });
}

function printProfile() {
  let printContent = document.querySelector('#profile').innerHTML;
  let originalContent = document.body.innerHTML;
  document.body.innerHTML = printContent;
  window.print();
  document.body.innerHTML = originalContent;
}


function handleSignOut(e) {
  localStorage.removeItem('profile');
  window.location.href = '/';
}

window.onload = searchForResults;
searchForm.addEventListener('submit', searchForResults);
signOut.addEventListener('click', handleSignOut)
