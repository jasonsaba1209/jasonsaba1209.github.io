// Declare a global variable to hold the fetched JSON data
let jsonData = [];

// Function to load JSON data from output.json using fetch()
function loadData() {
  fetch('output.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok: ' + response.statusText);
      }
      return response.json();
    })
    .then(data => {
      jsonData = data; // Store the fetched data globally
      // Populate the table for the default selection after loading data
      handleSelectionChange();
    })
    .catch(error => console.error('Error fetching data:', error));
}

// This function is called when the dropdown selection changes
function handleSelectionChange() {
  // Get the selected user_id from the dropdown

  //uncomment below to get for all
  //const selectedUserId = document.getElementById('user_id').value;
  
  let passwordValue = document.getElementById('userPassword').value;
  let selectedUserId;

    switch (passwordValue) {
        case "Pumpkin":
            selectedUserId = "p5sv079r17y4bi06x4c24h3fe"
        break;
        case "allahbaba":
            selectedUserId = "z6qbjotuaf6o3ys8hgwjc20j1"
        break;
        case "Bashar":
            selectedUserId = "1177164531"
        break;
        case "oida":
            selectedUserId = "11102572930"
        break;
        case "Sethxy Man":
            selectedUserId = "22rbzh4xlqhd5kwlx2zve5gda"
        break;
        case "Dubai":
            selectedUserId = "21r743lbsas2y2hbpqx5fp2ti"
        break;
    
        default:
            console.warn('Password did not match')
            break;
    }

  // Filter the data to get only records matching the selected user_id
  const filteredData = jsonData.filter(record => record.user_id === selectedUserId);
  
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
}

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevents the form from submitting and reloading the page
    handleSelectionChange(); // Process the password and update the table
});

// Use DOMContentLoaded to ensure the document is fully loaded before fetching data
document.addEventListener('DOMContentLoaded', loadData);
