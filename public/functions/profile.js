let searchForm = document.querySelector('#search-form');
let profile  = JSON.parse(localStorage.getItem('profile'));
let tableReports = document.querySelector('#listResults');
let signOut = document.querySelector('#signout');

function uploadProfile() {
 if (!profile) {return window.location.href = "/login"};

 document.querySelector('#firstName').innerHTML = `<i>First Name:</i><b> ${profile.account.firstName}</b>`;
 document.querySelector('#lastName').innerHTML = `<i>Last Name:</i> <b>${profile.account.lastName}</b>`;
 document.querySelector('#cityName').innerHTML = `<i>City/Town:</i> <b>${profile.account.city}</b>`;
 document.querySelector('#stateName').innerHTML = `<i>State:</i> <b>${profile.account.state}</b>`;
}


function handleSearchForm(e) {
  e.preventDefault();
  let query =  searchForm.querySelector('input').value;
  localStorage.setItem('searchItem', JSON.stringify({
    type: 'single',
    query: query
  }));
  window.location.href = '/results'
}

function displayReports() {
  tableReports.innerHTML = profile.account.reports.map((sdn) => {
    return `
      <tr onclick="displayProfile('${sdn.id}')" id='${sdn.id}'>
        <td>${sdn.name}</td>
        <td>${sdn.type || 'N/A'}</td>
        <td>${sdn.source}</td>
      </tr>
      `;
  }).join('');
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
   <button id="deleteReport">Delete Report</button>
   <button onClick="printProfile()" id="print">Print Report</button>
   `;

   document.querySelector('#deleteReport').addEventListener('click', function(e) {
      let body = JSON.parse(localStorage.getItem('profile'));
      let sdnId = sdn.id;
      let user = body.user;
      let _userid = body.user._id;
      // https://okami-sanctions.herokuapp.com/getuser
      axios.post('https://okami-sanctions.herokuapp.com/delete', {_userid, sdnId}).then((res) => {
          let data = {};
           data.account = res.data;
          data.user = user;
          localStorage.setItem('profile', JSON.stringify(data));
          location.reload();
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

window.onload = uploadProfile;
window.onload = displayReports;
searchForm.addEventListener('submit', handleSearchForm);
signOut.addEventListener('click', handleSignOut);
