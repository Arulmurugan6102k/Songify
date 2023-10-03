
    var players = {}; // To keep track of YouTube players

    function onYouTubeIframeAPIReady() {
      // This function is called automatically by the iFrame API when it's ready
      // No need to do anything here
    }

    function playAudio(videoId) {
      if (!players[videoId]) {
        players[videoId] = new YT.Player('player-' + videoId, {
          height: '0',
          width: '0',
          videoId: videoId,
          events: {
            'onReady': function(event) {
              event.target.playVideo();
            }
          }
        });
      } else {
        players[videoId].playVideo();
      }
    }

    function pauseAudio(videoId) {
      if (players[videoId]) {
        players[videoId].pauseVideo();
      }
    }

    function search() {
      var searchTerm = document.getElementById("search").value;
      var headphoneCheckbox = document.getElementById("headphoneCheckbox");

      // Check if the checkbox is checked
      if (headphoneCheckbox.checked) {
        var apiKey = "AIzaSyA-_lg7FkmNuGJ5ZkHU-R073oKEBdLyh_s"; // Replace with your actual YouTube API key
        var url = "https://www.googleapis.com/youtube/v3/search?part=snippet&q=" + searchTerm + "&key=" + apiKey;
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
          if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            var results = response.items;
            var resultsDiv = document.getElementById("results");

            // Clear any existing search results
            resultsDiv.innerHTML = "";

            for (var i = 0; i < results.length; i++) {
              var result = results[i];
              var videoId = result.id.videoId;
              var title = result.snippet.title;
              var audioUrl = "https://www.youtube.com/watch?v=" + videoId;

              // Create a div to hold the player and title for each result
              var audioDiv = document.createElement("div");
              audioDiv.className = "audio-container";

              // Add the video title as a heading
              var heading = document.createElement("h2");
              heading.textContent = title;
              audioDiv.appendChild(heading);

              // Create a play button for each audio track
              var playButton = document.createElement("button");
              playButton.textContent = "Play";
              playButton.onclick = function() {
                playAudio(videoId);
              };
              audioDiv.appendChild(playButton);

              // Create a pause button for each audio track
              var pauseButton = document.createElement("button");
              pauseButton.textContent = "Pause";
              pauseButton.onclick = function() {
                pauseAudio(videoId);
              };
              audioDiv.appendChild(pauseButton);

              // Append the YouTube player to the div
              var playerDiv = document.createElement("div");
              playerDiv.setAttribute("id", "player-" + videoId);
              audioDiv.appendChild(playerDiv);

              // Append the div to the results container
              resultsDiv.appendChild(audioDiv);
            }
          } else {
            alert("Error: Unable to fetch search results. Please try again later.");
          }
        };
        xhr.send();
      } else {
        alert("Please tick the 'Headphones plugged in' checkbox to enable the search function.");
      }
    }

    document.getElementById("searchButton").addEventListener("click", search);