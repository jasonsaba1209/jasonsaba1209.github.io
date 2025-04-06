// Declare a global variable to hold the fetched JSON data
let jsonData = [];

// This is a placeholder to see if the chart is loaded or not
// to not cause errors of the chart reloading itself
let chartInstance = null;

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

// This is a temporary, or when using the JSON data
// need to figure out how to make passwords then actual
// encrypted passwords stored securely on my database 
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
  
  //get the password from the field 'userPassword'
  let passwordValue = document.getElementById('userPassword').value.trim().toLowerCase();
  console.log('Entered value: ', passwordValue);

  // This is the temp function. change later
  user_id = returnUserID(passwordValue);

    // check the cache(?) if the user already has their information saved
    if (user_id) {
        localStorage.setItem('user_id', user_id);
        localStorage.setItem('userPassword', passwordValue); // Optional: store the actual password later
      } else {
        localStorage.removeItem('user_id');
        localStorage.removeItem('userPassword');
      }  

  if(user_id != "")
    document.getElementById("success_header").textContent = "Your info is ready cutie";
  else
  document.getElementById("success_header").textContent = "";

  //so currently, this loads the data in the reports screen immediately
  //when the user logs in sucessfully, maybe in the future adopt a diff
  //approach, with different views and different pages, improving
  //performance
  const filteredData = jsonData.trackCounts.filter(record => record.user_id === user_id);
  console.log('Filtered data: ', filteredData)

  let tableRows = '';
  filteredData.forEach(record => {
    tableRows += `<tr>
                    <td>${record.track_name}</td>
                    <td>${record.artist_name}</td>
                    <td>${record.count}</td>
                  </tr>`;
  });
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

    drawChart(user_id);
}

// Using DOMContentLoaded to ensure the document is fully loaded before fetching data
// i got way too many errors otherwise..
document.addEventListener('DOMContentLoaded', () => {
    loadData().then(() => {
        const savedUserId = localStorage.getItem('user_id');
        const savedPassword = localStorage.getItem('userPassword');
        if (savedUserId && savedPassword) {
            document.getElementById('userPassword').value = savedPassword;
            //I think this is the main part of the code.
            //coming from the main page anyways.
            handleSelectionChange();
        }
    });
});

//handling the changing of views.
//current approach is all in the same HTML
//i think changing it later to when having full reports
//to be individual pages that load, will save on resources
//and the load on the server hopefully
//plus i am not a huge fan of this way
function showReportView(view) {
    document.querySelectorAll('.report-view').forEach(div => {
        div.style.display = 'none';
    });

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
  
    //this was temporary testing. keeping it here cz why not?
    if (viewId === 'dashboard') {
      loadData().then(() => {
        const query = "What If I Fly";
        searchSpotify(query);
      }).catch(error => {
        console.error('Failed to load data before searching Spotify:', error);
      });
    }
  }

// actually not super sure what this does.
// looks like it is the hashchange when selecting the views
// and then actually displays it
window.addEventListener('hashchange', () => {
    const viewId = location.hash.replace('#', '');
    showView(viewId);
});

document.addEventListener('DOMContentLoaded', () => {
    const viewId = location.hash.replace('#', '') || 'home';
    showView(viewId);
});

// this is the temporary function
// it is just here to reassure ppl that the website 
// IS being updated. but soon it won't be necessary
function updateDateTime() {
  const now = new Date();
  const options = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit', 
      timeZone: 'Europe/Berlin'
  };
  const formattedDateTime = now.toLocaleString('en-US', options);
  document.getElementById('datetime').textContent = `Updated: ${formattedDateTime}`;
}

window.onload = updateDateTime;

// Not sure about the validity of this.
// returns the top artists for the "SearchSpotify function"
function returnTopStats(user_id) {
  console.log("User id for artists: ", user_id);

  const filteredArtists = jsonData.top_five_artists.filter(record => record.user_id === user_id);
  const filteredTracks = jsonData.top_five_tracks.filter(record => record.user_id === user_id);

  let topStats = [];

  const limit = Math.min(5, filteredArtists.length, filteredTracks.length);
  for (let index = 0; index < limit; index++) {
    const record = filteredArtists[index];
    const record_s = filteredTracks[index];

    // safety check
    if (!record || !record_s) continue;

    topStats.push({
      artist_name: record.artist_name,
      artist_link: record.artist_link,
      artist_img: record.artist_image_url,
      artist_count: record.listen_count,

      track_name: record_s.track_name,
      track_link: record_s.track_link,
      album_image_url: record_s.album_image_url,
      track_count: record_s.listen_count
    });
  }

  console.log("-----------Logging data for the TopStats-----------------")
  console.log(topStats);
  return topStats;
}


async function searchSpotify(query) {

  let topArtistsData = returnTopStats(user_id);
  if (!topArtistsData || topArtistsData.length === 0) {
    console.error("No artist data found for user:", user_id);
    return;
  }

  console.log("Top artist data:", topArtistsData);
    
  let artistContentName = 'artists';
  
  let artistData = returnTopStats(user_id);

  const artistsContent = document.getElementById(`${artistContentName}_content`);
  artistsContent.innerHTML = ''; 
      
  topArtistsData.forEach((artist, index) => {
      const artistDiv = document.createElement('div');
      artistDiv.classList.add('artist-info');

      if (artist.artist_img) {
        const imgElement = document.createElement('img');
        imgElement.src = artist.artist_img; 
        imgElement.alt = artist.artist_name;
        imgElement.style.width = "100px"; 
        artistDiv.appendChild(imgElement);
      }

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('artist-details');

      const nameElement = document.createElement('h3');
      nameElement.textContent = artist.artist_name;
      infoDiv.appendChild(nameElement);

      const countElement = document.createElement('p');
      countElement.textContent = `Listen Count: ${artist.artist_count}`;
      infoDiv.appendChild(countElement);

      const linkElement = document.createElement('a');
      linkElement.href = artist.artist_link;
      linkElement.textContent = 'View on Spotify';
      linkElement.target = '_blank';
      infoDiv.appendChild(linkElement);
      artistDiv.appendChild(infoDiv);

      artistsContent.appendChild(artistDiv);
    });

    // Here we populate the tracks
    const tracksContent = document.getElementById(`tracks_content`);
    tracksContent.innerHTML = ''; 

    topArtistsData.forEach((track, index) => {
      const trackDiv = document.createElement('div');
      trackDiv.classList.add('artist-info');

      if (track.album_image_url) {
        const imgElement = document.createElement('img');
        imgElement.src = track.album_image_url; 
        imgElement.alt = track.track_name;
        imgElement.style.width = "100px"; 
        trackDiv.appendChild(imgElement);
      }

      const infoDiv = document.createElement('div');
      infoDiv.classList.add('artist-details');

      const nameElement = document.createElement('h3');
      nameElement.textContent = track.track_name;
      infoDiv.appendChild(nameElement);

      const countElement = document.createElement('p');
      countElement.textContent = `Listen Count: ${track.track_count}`;
      infoDiv.appendChild(countElement);

      const linkElement = document.createElement('a');
      linkElement.href = track.track_link;
      linkElement.textContent = 'View on Spotify';
      linkElement.target = '_blank';
      infoDiv.appendChild(linkElement);

      trackDiv.appendChild(infoDiv);

      tracksContent.appendChild(trackDiv);
    });
}

function drawChart(data) {
  const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Filter data for the specified user_id
const userData = jsonData.dayListenTimes.filter(entry => entry.user_id === user_id);

// Map the data to labels and listen times (converting listen_time to minutes)
const labels = userData.map(entry => daysOfWeek[parseInt(entry.day_of_week)]);
const listenTimes = userData.map(entry => entry.listen_time / 60000); // Convert listen_time to minutes

const tooltip = d3.select("#tooltip");

// Set up the chart dimensions
const width = 800; // Wider width for the chart
const height = 400; // Increased height for better visualization
const margin = { top: 20, right: 20, bottom: 60, left: 40 };

// Create SVG element
const svg = d3.select("#chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Set up the x and y scales
const xScale = d3.scaleBand()
  .domain(labels)
  .range([0, width - margin.left - margin.right])
  .padding(0.1);

const yScale = d3.scaleLinear()
  .domain([0, d3.max(listenTimes)])
  .nice() // Makes the y axis a nice round number
  .range([height - margin.top - margin.bottom, 0]);

// Create the x-axis
svg.append("g")
  .selectAll(".x-axis")
  .data(labels)
  .enter()
  .append("text")
  .attr("x", (d, i) => xScale(d) + xScale.bandwidth() / 2)
  .attr("y", height - margin.bottom + 10) // Adjusted position to avoid overlap
  .attr("text-anchor", "middle")
  .attr("dy", "1em")
  .style("font-family", "Arial")
  .style("font-size", "14px")
  .style("font-weight", "bold")
  .style("fill", "white")
  .text(d => d);

// Create the y-axis
svg.append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(yScale).ticks(5))
  .selectAll("text")
  .style("font-family", "Arial")
  .style("font-size", "14px")
  .style("font-weight", "bold");

// Create the bars for the chart with styling (border radius and colors)
svg.selectAll(".bar")
  .data(listenTimes)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", (d, i) => xScale(labels[i]))
  .attr("y", d => yScale(d))
  .attr("width", xScale.bandwidth())
  .attr("height", d => height - margin.top - margin.bottom - yScale(d))
  .attr("fill", "rgba(29, 185, 84, 1)")  // Match the Chart.js background color
  .attr("stroke", "rgb(34, 210, 96)")  // Match the Chart.js border color
  .attr("stroke-width", 2)  // Border width from Chart.js
  .attr("rx", 10)  // Adding border radius to the bars
  .attr("ry", 10) // Rounded corners (similar to Chart.js)
  .on("mouseover", function (event, d) {
    tooltip
      .style("display", "block")
      .html(`<strong>${d.toFixed(2)} minutes</strong>`)
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 30}px`);
    d3.select(this).attr("fill", "rgb(34, 210, 96)"); // Highlight on hover
  })
  .on("mousemove", function (event) {
    tooltip
      .style("left", `${event.pageX + 10}px`)
      .style("top", `${event.pageY - 30}px`);
  })
  .on("mouseout", function () {
    tooltip.style("display", "none");
    d3.select(this).attr("fill", "rgba(29, 185, 84, 1)"); // Reset color
  });
}

function animateCounters() {
  const counters = document.querySelectorAll(".counter");
  const duration = 2000;

  counters.forEach(counter => {
    const target = +counter.getAttribute("data-target");
    const countNum = counter.querySelector(".count-num");
    const plusSign = counter.querySelector(".plus");

    const increment = target / (duration / 16);
    let current = 0;

    plusSign.style.opacity = 0; // Start hidden

    function updateCounter() {
      current += increment;
      if (current < target) {
        countNum.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        countNum.textContent = target.toLocaleString();
        // Fade in the plus sign
        plusSign.style.transition = "opacity 0.5s ease";
        plusSign.style.opacity = 1;
      }
    }

    updateCounter();
  });
}

window.addEventListener("DOMContentLoaded", animateCounters);
