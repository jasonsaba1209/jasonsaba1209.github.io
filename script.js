// Declare a global variable to hold the fetched JSON data
let jsonData = [];
let jsonData_ind = [];
let user_id = "";

// Function to load JSON data from output.json using fetch()
function loadData() {
    Promise.all([
        fetch('output.json').then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        }),
        fetch('output_t.json').then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            return response.json();
        })
    ])
    .then(([data1, data2]) => {
        jsonData = data1;
        jsonData_ind = data2;
        handleSelectionChange();
    })
    .catch(error => console.error('Error fetching data:', error));
}


function returnUserID(passwordValue){
    switch (passwordValue) {
        case "Pumpkin":
            return "p5sv079r17y4bi06x4c24h3fe"
        case "allahbaba":
            return "z6qbjotuaf6o3ys8hgwjc20j1"
        case "bashar":
            return "1177164531"
        case "oida":
            return "11102572930"
        case "sethxy":
            return "22rbzh4xlqhd5kwlx2zve5gda"
        case "dubai":
            return "21r743lbsas2y2hbpqx5fp2ti"
    
        default:
            console.warn('Password did not match')
            return ""
    }

}

// This function is called when the dropdown selection changes
function handleSelectionChange() {
  
  let passwordValue = document.getElementById('userPassword').value.trim().toLowerCase();
  console.log('Entered value: ', passwordValue);

  user_id = returnUserID(passwordValue);

    if (user_id) {
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('userPassword', passwordValue); // Optional: store the actual password
      } else {
        // Optionally, remove any previously stored values if the password is invalid
        localStorage.removeItem('user_id');
        localStorage.removeItem('userPassword');
      }  

  if(user_id != "")
    document.getElementById("success_header").textContent = "Your info is ready cutie";
  else
  document.getElementById("success_header").textContent = "";
  // Filter the data to get only records matching the selected user_id
  const filteredData = jsonData.filter(record => record.user_id === user_id);
  console.log('Filtered data: ', filteredData)

  // Build the HTML table rows dynamically
  let tableRows = '';
  filteredData.forEach(record => {
    tableRows += `<tr>
                    <td>${record.track_name}</td>
                    <td>${record.artist_name}</td>
                    <td>${record.count}</td>
                  </tr>`;
  });
  // Update the table body with the new rows
  document.getElementById('stats-body').innerHTML = tableRows;

  const filteredData_ind = jsonData_ind.filter(record => record.user_id === user_id);
    let tableRows_ind = '';
    filteredData_ind.forEach(record => {
        tableRows_ind += `<tr>
                            <td>${record.track_name}</td>
                            <td>${record.artist_name}</td>
                            <td>${record.listen_date}</td>
                          </tr>`;
    });
    document.getElementById('stats-body-ind').innerHTML = tableRows_ind;
}

// Use DOMContentLoaded to ensure the document is fully loaded before fetching data
document.addEventListener('DOMContentLoaded', () => {
    // First load the data
    loadData();

    // Check localStorage for previously stored user details
    const savedUserId = localStorage.getItem('user_id');
    const savedPassword = localStorage.getItem('userPassword');
    if (savedUserId && savedPassword) {
      // Optionally, populate the input field so the user sees their saved password
      document.getElementById('userPassword').value = savedPassword;
      // Call handleSelectionChange to update the table immediately
      handleSelectionChange();
    }
});

function showReportView(view) {
    // Hide all report views
    document.querySelectorAll('.report-view').forEach(div => {
        div.style.display = 'none';
    });

    // Show the selected view
    const selectedView = document.getElementById(`${view}-view`);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
}


function showView(viewId) {

    document.querySelectorAll('.view').forEach(view => {
        view.style.display = 'none';
    });

    const selectedView = document.getElementById(viewId);
    if (selectedView) {
        selectedView.style.display = 'block';
    }
}

// When the hash changes in the URL
window.addEventListener('hashchange', () => {
    const viewId = location.hash.replace('#', '');
    showView(viewId);
});

// On page load, check the hash and show the view; default to "home"
document.addEventListener('DOMContentLoaded', () => {
    const viewId = location.hash.replace('#', '') || 'home';
    showView(viewId);
});

function updateDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDateTime = now.toLocaleDateString('en-US', options);
    document.getElementById('datetime').textContent = `Updated: ${formattedDateTime}`;
  }

  // Update the date and time when the page loads
  window.onload = updateDateTime;
