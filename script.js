document.addEventListener('DOMContentLoaded', function() {
      // Global variable to store fetched JSON data
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
            jsonData = data;
            console.log("Data loaded:", jsonData);
          })
          .catch(error => console.error('Error fetching data:', error));
      }
  
      // Function to filter JSON data based on the entered key
      function handleSelectionChange() {
        // Get the value from the text input, trim spaces and convert to lowercase
        let inputValue = document.getElementById('userInput').value.trim().toLowerCase();
        console.log('Entered value:', inputValue);
        
        let selectedUserId;
  
        // Use a switch to determine the user_id from the input key
        switch (inputValue) {
          case "pumpkin":
            selectedUserId = "p5sv079r17y4bi06x4c24h3fe";
            break;
          case "allahbaba":
            selectedUserId = "z6qbjotuaf6o3ys8hgwjc20j1";
            break;
          case "bashar":
            selectedUserId = "1177164531";
            break;
          case "oida":
            selectedUserId = "11102572930";
            break;
          case "sethxy man":
            selectedUserId = "22rbzh4xlqhd5kwlx2zve5gda";
            break;
          case "dubai":
            selectedUserId = "21r743lbsas2y2hbpqx5fp2ti";
            break;
          default:
            console.warn('Key did not match');
            document.getElementById('stats-body').innerHTML =
              '<tr><td colspan="3">No data found for that key.</td></tr>';
            return; // Exit early if input is not valid
        }
  
        console.log('Selected user ID:', selectedUserId);
  
        // Filter the JSON data for records with the matching user_id
        const filteredData = jsonData.filter(record => record.user_id === selectedUserId);
        console.log('Filtered data:', filteredData);
  
        // Build the table rows dynamically
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
  
      // Attach an event listener to the form to intercept submission and process the input
      const loginForm = document.getElementById('loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
          event.preventDefault(); // Prevent form from reloading the page
          handleSelectionChange();
        });
      } else {
        console.error('loginForm not found in DOM');
      }
  
      // Load JSON data when the DOM is fully loaded
      loadData();
    });
