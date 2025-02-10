let jsonData = [];

    // Function to load data from output.json using fetch
    function loadData() {
      fetch('output.json')
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
          }
          return response.json();
        })
        .then(data => {
          jsonData = data; // Save the fetched data globally
          console.log("Data loaded:", jsonData);
          // Optionally, you might update the UI here if needed
        })
        .catch(error => console.error('Error fetching data:', error));
    }

    // Function to filter the JSON data based on the password value
    function handleSelectionChange() {
      // Get the value from the password field, trim extra spaces and convert to lowercase
      let passwordValue = document.getElementById('userPassword').value.trim().toLowerCase();
      console.log('Entered password:', passwordValue);
      
      let selectedUserId;

      // Compare against pre-defined passwords (converted to lowercase)
      switch (passwordValue) {
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
          console.warn('Password did not match');
          document.getElementById('stats-body').innerHTML =
            '<tr><td colspan="3">No data found for that password.</td></tr>';
          return;  // Exit the function if no valid password is entered
      }
      
      console.log('Selected user ID:', selectedUserId);
      
      // Filter the JSON data to include only records with the matching user_id
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

    // Attach an event listener to the form submission to handle filtering without page reload
    document.getElementById('loginForm').addEventListener('submit', function(event) {
      event.preventDefault(); // Prevent the form from submitting normally
      handleSelectionChange(); // Call our function to filter and update the table
    });

    // Load the JSON data when the DOM content is fully loaded
    document.addEventListener('DOMContentLoaded', loadData);
