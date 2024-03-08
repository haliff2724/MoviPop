var searchInput = document.getElementById('Input');
var displaySearchList = document.getElementsByClassName('movielist');

searchInput.addEventListener('input', findMovies); //trigger findMovie function


function findMovies() {

    fetch(`https://www.omdbapi.com/?apikey=c1aecf62&s=${(searchInput.value).trim()}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            
            if (data.Search) {
                displayMovieList(data.Search);
            }
        })
        .catch(error => {
            console.error('Error fetching movies:', error);
        });
}

function movieDetails() {
    var detailsid = new URLSearchParams(window.location.search);
    var id = detailsid.get('id');
    console.log(id);

    fetch(`https://www.omdbapi.com/?apikey=c1aecf62&i=${id}`)
        .then(response => response.json())
        .then(data => {
            console.log(data);

            // Update elements using document.getElementById
            document.getElementById("moviePoster").src = data.Poster;
            document.getElementById("movieTitle").textContent = data.Title;
            document.getElementById("movieYear").textContent = data.Year;
            document.getElementById("movieGenre").textContent = data.Genre;
            document.getElementById("movieDirector").textContent = data.Director;
            document.getElementById("movieActors").textContent = data.Actors;
            document.getElementById("moviePlot").textContent = data.Plot;
            var img = document.createElement('img');
            img.src = data.Poster;
            document.getElementById("movieRating").textContent = data.Ratings[0].Value;
            document.getElementById("movieSourceRating").textContent = data.Ratings[0].Source;
            document.getElementById("movieAwards").textContent = data.Awards;
            document.getElementById("movieWriter").textContent = data.Writer;
        })
        .catch(error => {
            console.error('Error fetching movie details:', error);
        });
}

async function displayMovieList(movies) {
    var output = '';
    
    for (i of movies) {

        var img = '';
        if (i.Poster != 'N/A') {
            img = i.Poster;
        }
        else {
            img = 'no.jpg';
        }
        var id = i.imdbID;

        output += `

        <div class="fetchmovie">
            <div class="fetchposter">
            <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fetchdetails">
                <div class="fetchdetails-box">
                    <div>
                        <p class="fetchmovie-name"><a href="movie.html?id=${id}">${i.Title}</a></p>
                        <p class="fetchmovie-year"><a href="movie.html?id=${id}">${i.Year}</a></p>
       
                    </div>
                    <div>
                        <i class="fa-solid fa-bookmark" style="cursor:pointer;" onClick=addTofavorites('${id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `
    }
    document.querySelector('.movielist').innerHTML = output; 
    console.log(movies); //select movielist class to insert output in html
}

async function addTofavorites(id) {
    console.log("fetchmovie", id);

    localStorage.setItem(Math.random().toString(36).slice(2, 7), id); // math.random for the unique key and value pair
    alert('Movie Added to Favorites!');
}


async function removeFromfavorites(id) {
    console.log(id);
    for (i in localStorage) {
        // remove movie from fav if the id match
        if (localStorage[i] == id) {
            localStorage.removeItem(i)
            break;
        }
    }
    alert('Movie Removed from Watchlist');
    window.location.replace('favorite.html');
}
//Favorites movies are loaded on to the fav page from localstorage
async function favoritesMovieLoader() {

    var output = ''
    // display favmovie from localstorage
    for (i in localStorage) {
        var id = localStorage.getItem(i);
        if (id != null) {
            const url = `https://www.omdbapi.com/?apikey=c1aecf62&i=${id}&plot=full`
            const res = await fetch(`${url}`);
            const data = await res.json();
            console.log(data);

            var img = ''
            if (data.Poster) {
                img = data.Poster
            }
            else { img = data.Title }
            var Id = data.imdbID;
            
            output += `

        <div class="fetchmovie">
            <div class="fetchposter">
                <a href="movie.html?id=${id}"><img src=${img} alt="Favourites Poster"></a>
            </div>
            <div class="fetchdetails">
                <div class="fetchdetails-box">
                    <div>
                        <p class="fetchmovie-name">${data.Title}</p>
                        <p class="fetchmovie-rating">${data.Year} &middot; <span
                                style="font-size: 15px; font-weight: 600;">${data.imdbRating}</span>/10</p>
                    </div>
                    <div style="color: maroon">
                        <i class="fa-solid fa-trash" style="cursor:pointer;" onClick=removeFromfavorites('${Id}')></i>
                    </div>
                </div>
            </div>
        </div>

       `;
        }

    }
    document.querySelector('.movielist').innerHTML = output;
}