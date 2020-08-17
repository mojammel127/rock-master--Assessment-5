// First part...

let searchInput = $('#search-input');
let results = $('#results');
let apiUrl = 'https://api.lyrics.ovh';
let lyricsDiv = $('#lyrics');
lyricsDiv.hide();
let b = 0;
const text_design = ["text-warning","text-info","text-danger","text-success","text-warning","text-primary","text-danger","text-success","text-warning","text-info"];

//Input song name & search....
const searchBox = document.querySelector('.content-area .search-bar #search-box #search-input');
searchBox.addEventListener('keypress',setQuery);
function setQuery(evt){
    if(evt.keyCode == 13 || evt=='click'){
        // localStorage.clear();
        suggestions();
    }
}

//Clearing result...

function removeResults() {
  $('.result').remove();
  b=0;
  perResult = [];
}


function suggestions() {
  var term = searchInput.val();
  if (!term) {
    removeResults();
    return;
  }
//   console.log(`${apiUrl}'/suggest/'${term}`);
  fetch(apiUrl+'/suggest/'+term)
  .then(response => response.json())
  .then(data => displayResults(data))
  .catch(err => console.log(err))
}

//Displaying 10 lists of single result...

function displayResults(data) {
    removeResults();
    // console.log(data);
    var finalResults = [];
    var seenResults = [];
    data.data.forEach(function (result) {
      if (seenResults.length >= 10) {
        return;
      }
      //Not same song or album...
      var t = result.title + ' - ' + result.artist.name;
      if (seenResults.indexOf(t) >= 0) {
        return;
      }
      seenResults.push(t);
      finalResults.push({
        display: t,
        artist: result.artist.name,
        title: result.title,
        album: result.album.title,
        id: b++,
        audio: result.preview
      });
    });

    var l = finalResults.length;
    myKey = [];
    finalResults.forEach(function (result, i) {
      var c = 'result';
      if (i == l-1) {
        c += ' result-last'
      }
      var e = $(`<li class=" ${c} single-result row align-items-center my-3 p-3">
        <div class="col-md-9">
            <h3 class="lyrics-name ${text_design[result.id]}">${result.display}</h3>
            <p class="author lead">Album by <span>${result.album}</span></p><br>
            <audio controls style="outline:none">
                <source src="${result.audio}" type="audio/mp3">
            </audio>
        </div>
        <div class="col-md-3 text-md-right text-center">
            <button onclick="findSongLyrics(${result.id})" id="btn-${result.id}" class="lyrics-btn btn btn-success" title="After clicking, go to down for the lyrics">Get Lyrics</button>
        </div>
      </li>
      `);
      results.append(e);
      myKey.push(result);
   
        
    });
}

//Finding Song Lyrics by clicking 'Get Lyrics" button...

function findSongLyrics(id){
    document.getElementById('single-lyric').innerHTML = "";
    // console.log(myKey[id]);
    const result = myKey[id];
    songLyrics(result);
}

//Find song lyrics...

function songLyrics(song) {
    
    fetch(apiUrl + '/v1/' + song.artist + '/' + song.title)
    .then(response => response.json())
    .then(data => checkData(data,song))
}

//Checking valid data

function checkData(data,song){
    try{
        if(data.error == "No lyrics found"){
            throw Error;
        }
        // console.log(data);
        displaySong(data,song);
        //Valid data...
    }catch(err){
        let html = '<p class="lyrics-title text-warning mb-4">The lyrics of '+ song.display +' is not available...</p>';
        
        const parentNode = document.getElementById('single-lyric');
        parentNode.innerHTML = html;
    }
}

//Displaying song lyrics...

function displaySong(data,song) {
    let html = '<h2 class="lyrics-title text-success mb-4">' + song.display + '</h2>';
    html += '<div class="lyric text-white" id="thelyrics">' + data.lyrics.replace(/\n/g, '<br />') + '</div>';
   
    const parentNode = document.getElementById('single-lyric');
    parentNode.innerHTML = html;
}

