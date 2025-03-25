// Declare a global variable to hold the fetched JSON data
let jsonData = [];

// Function to load JSON data from output.json using fetch()
function loadData() {
    return fetch('output_tok.json')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        jsonData = data;
        console.log("Data loaded successfully.");
        console.log(data.trackCounts);
        console.log(data.individualSongs);
        console.log(data.accessTokens);
        console.log(data.topArtists);
      })
      .catch(error => console.error('Error loading JSON:', error));
  }


function returnUserID(passwordValue){
    switch (passwordValue) {
        case "pumpkin":
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
  const filteredData = jsonData.trackCounts.filter(record => record.user_id === user_id);
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

  const filteredData_ind = jsonData.individualSongs.filter(record => record.user_id === user_id);
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
    // First load the data and then handle any saved user credentials.
    loadData().then(() => {
        // Check localStorage for previously stored user details
        const savedUserId = localStorage.getItem('user_id');
        const savedPassword = localStorage.getItem('userPassword');
        if (savedUserId && savedPassword) {
            document.getElementById('userPassword').value = savedPassword;
            handleSelectionChange();
        }
    });
});

function showReportView(view) {
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
  
    if (viewId === 'dashboard') {
      loadData().then(() => {
        const query = "What If I Fly";
        searchSpotify(query);
      }).catch(error => {
        console.error('Failed to load data before searching Spotify:', error);
      });
    }
  }

window.addEventListener('hashchange', () => {
    const viewId = location.hash.replace('#', '');
    showView(viewId);
});

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

  window.onload = updateDateTime;

function returnTopStats(user_id){
  console.log("User id for artists: ", user_id);
  const filteredData_ind = jsonData.topArtists.filter(record => record.user_id === user_id);
  const filteredData_ind_S = jsonData.topSongs.filter(record => record.user_id === user_id);
  
  let topArtists = [];
  //let allSongsArr = [];

  for (let index = 0; index < Math.min(5, filteredData_ind.length); index++) {
    const record = filteredData_ind[index];
    const record_s = filteredData_ind_S[index];
    topArtists.push({
      artist: record.top_artist_name,
      count: record.artist_count,
      track: record_s.top_artist_name,
      track_count: record_s.artist_count
    });
    console.log(record_s.artist_count);
    console.log(record_s.top_artist_name);
  }

  return topArtists;
}

async function searchSpotify(query) {
  if (!jsonData || !jsonData.accessTokens) {
    console.error("Access tokens not loaded yet!");
    return;
  }
  
  // Retrieve the correct token for the given user_id from your DB-loaded jsonData
  const tokenRecord = jsonData.accessTokens.find(u_token => u_token.user_id === user_id);
  if (!tokenRecord) {
    console.error("No token found for user:", user_id);
    return;
  }
  const token = tokenRecord.access_token; // Use the valid token from your DB
  console.log("Using token:", token);

  // Get top artist data (an array of objects with properties: artist, count)
  let topArtistsData = returnTopStats(user_id);
  if (!topArtistsData || topArtistsData.length === 0) {
    console.error("No artist data found for user:", user_id);
    return;
  }
  console.log("Top artist data:", topArtistsData);
  
  // Build a comma-separated list of artist IDs (or names if that's what you store)
  const idsParam_art = topArtistsData.map(item => item.artist).join(',');
  const idsParam_tra = topArtistsData.map(item => item.track).join(',');
  const artistUrl = `https://api.spotify.com/v1/artists?ids=${idsParam_art}`;
  const trackUrl = `https://api.spotify.com/v1/tracks?ids=${idsParam_tra}`;

  try {
    const artistResponse = await fetch(artistUrl, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!artistResponse.ok) {
      throw new Error(`Error fetching artist data: ${artistResponse.statusText}`);
    }
    const trackResponse = await fetch(trackUrl, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    });

    if (!trackResponse.ok) {
      throw new Error(`Error fetching artist data: ${trackResponse.statusText}`);
    }

    const artistData = await artistResponse.json();
    const trackData = await trackResponse.json();
    
    console.log("Artist Information:");
    artistData.artists.forEach( (artist, index) => {
      console.log(`Name: ${artist.name}`);
      console.log(`Genres: ${artist.genres.join(', ')}`);
      console.log(`Followers: ${artist.followers.total}`);
      console.log(`Popularity: ${artist.popularity}`);
      console.log(`Spotify URL: ${artist.external_urls.spotify}`);
      console.log(`Listen Count: ${topArtistsData[index].count}`);
      console.log('-----------------------------');
    });

    console.log("Track Information:");
    trackData.tracks.forEach( (track, index) => {
      console.log(`Name: ${track.name}`);
      console.log(`Popularity: ${track.popularity}`);
      console.log(`Spotify URL: ${track.external_urls.spotify}`);
      console.log(`Listen Count: ${topArtistsData[index].track_count}`);
      console.log('-----------------------------');
    });
    
    let artistContentName = 'artists';

    const artistsContent = document.getElementById(`${artistContentName}_content`);
    artistsContent.innerHTML = ''; 
      
    artistData.artists.forEach((artist, index) => {
      const artistDiv = document.createElement('div');
      artistDiv.classList.add('artist-info');

      if (artist.images && artist.images.length > 0) {
        const imgElement = document.createElement('img');
        imgElement.src = artist.images[0].url; // Use the first image
        imgElement.alt = artist.name;
        imgElement.style.width = "100px"; // Adjust size as needed
        artistDiv.appendChild(imgElement);
      }

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('artist-details');

      const nameElement = document.createElement('h3');
      nameElement.textContent = artist.name;
      infoDiv.appendChild(nameElement);

      const countElement = document.createElement('p');
      countElement.textContent = `Listen Count: ${topArtistsData[index].count}`;
      infoDiv.appendChild(countElement);

      const linkElement = document.createElement('a');
      linkElement.href = artist.external_urls.spotify;
      linkElement.textContent = 'View on Spotify';
      linkElement.target = '_blank';
      infoDiv.appendChild(linkElement);
      artistDiv.appendChild(infoDiv);

      artistsContent.appendChild(artistDiv);
    });
    const tracksContent = document.getElementById(`tracks_content`);
    tracksContent.innerHTML = ''; // Clear previous content

    trackData.tracks.forEach((track, index) => {
      // Create a new div for each artist
      const trackDiv = document.createElement('div');
      trackDiv.classList.add('artist-info');

      if (track.album && track.album.images && track.album.images.length > 0) {
        const imgElement = document.createElement('img');
        imgElement.src = track.album.images[0].url; // Use the first album image
        imgElement.alt = track.name;
        imgElement.style.width = "100px"; // Adjust size as needed
        trackDiv.appendChild(imgElement);
      }

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('artist-details');

      const nameElement = document.createElement('h3');
      nameElement.textContent = track.name;
      infoDiv.appendChild(nameElement);

      const countElement = document.createElement('p');
      countElement.textContent = `Listen Count: ${topArtistsData[index].track_count}`;
      infoDiv.appendChild(countElement);

      const linkElement = document.createElement('a');
      linkElement.href = track.external_urls.spotify;
      linkElement.textContent = 'View on Spotify';
      linkElement.target = '_blank';
      infoDiv.appendChild(linkElement);

      trackDiv.appendChild(infoDiv);

      tracksContent.appendChild(trackDiv);
    });
  } catch (error) {
    console.error("Error in searchSpotify:", error.message);
  }
}
