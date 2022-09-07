//the API documentation site https://developers.themoviedb.org/3/

class App {
  static async run() {
    const movies = await APIService.fetchMovies();
    HomePage.renderMovies(movies);
  }
}

class APIService {
  static TMDB_BASE_URL = "https://api.themoviedb.org/3";
  static async fetchMovies() {
    const url = APIService._constructUrl(`movie/now_playing`);
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((movie) => new Movie(movie));
  }
  static async fetchMovie(movieId) {
    const url = APIService._constructUrl(`movie/${movieId}`);
    const response = await fetch(url);
    const data = await response.json();
    return new Movie(data);
  }
  static async fetchActors() {
    const url = APIService._constructUrl("person/popular");
    const response = await fetch(url);
    const data = await response.json();
    return data.results.map((actor) => new Actor(actor));
  }

  static _constructUrl(path) {
    return `${this.TMDB_BASE_URL}/${path}?api_key=${atob(
      "NTQyMDAzOTE4NzY5ZGY1MDA4M2ExM2M0MTViYmM2MDI="
    )}`;
  }
}

class HomePage {
  static container = document.getElementById("container");
  static renderMovies(movies) {
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.classList = "movie-div";
      const movieImage = document.createElement("img");
      movieImage.src = `${movie.backdropUrl}`;
      const movieTitle = document.createElement("h3");
      movieTitle.textContent = `${movie.title}`;
      movieImage.addEventListener("click", function () {
        Movies.run(movie);
      });
      const rating = document.createElement("p");
      rating.innerText = `${movie.rating}`;
      rating.classlist = "rating";

      movieDiv.appendChild(movieImage);
      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(rating);

      this.container.appendChild(movieDiv);
    });
  }
}

class ActorPage {
  static container = document.getElementById("container");
  static renderActors(actors) {
    this.container.classList = "actor-page";
    this.container.innerHTML = "";
    // actorDiv.className = 'actor-page';
    actors.forEach((actor) => {
      //   const img=document.createElement("img");
      //   img.src=`${actor.backdropUrl}`;
      //   this.container.appendChild(img);
      const actorDiv = document.createElement("div"); // Parent Div

      const actorImageContainer = document.createElement("div");
      actorImageContainer.classList.add("actor-image");

      const actorImage = document.createElement("img");
      actorImage.src = `${actor.backdropUrl}`;

      const actorName = document.createElement("h3"); //title
      actorName.textContent = `${actor.name}`;

      actorImage.addEventListener("click", function () {
        //   Movies.run(movie);
        console.log(actor.name, "hey");
      });

      actorImageContainer.appendChild(actorImage);
      actorDiv.appendChild(actorImageContainer);
      actorDiv.appendChild(actorName);
      this.container.appendChild(actorDiv);
    });
  }
}

class Movies {
  static async run(movie) {
    const movieData = await APIService.fetchMovie(movie.id);
    MoviePage.renderMovieSection(movieData);
    APIService.fetchActors(movieData);
  }
}

class MoviePage {
  static container = document.getElementById("container");
  static renderMovieSection(movie) {
    MovieSection.renderMovie(movie);
  }
}

class MovieSection {
  static renderMovie(movie) {
    MoviePage.container.innerHTML = `
        <div class="row">
          <div class="col-md-4">
            <img id="movie-backdrop" src=${movie.backdropUrl}> 
          </div>
          <div class="col-md-8">
            <h2 id="movie-title">${movie.title}</h2>
            <p id="genres">${movie.getGenres}</p>
            <p id="movie-release-date">${movie.releaseDate}</p>
            <p id="movie-runtime">${movie.runtime}</p>
            <h3>Overview:</h3>
            <p id="movie-overview">${movie.overview}</p>
          </div>
        </div>
        <h3>Actors:</h3>
      `;
  }
}

class Movie {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.rating = json.vote_average;
    this.id = json.id;
    this.title = json.title;
    this.releaseDate = json.release_date;
    this.runtime = json.runtime + " minutes";
    this.overview = json.overview;
    this.backdropPath = json.backdrop_path;
    this.rating = json.vote_average;
    this.genres = json.genres;
  }

  get getGenres() {
    let genresString = "";
    let genres = this.genres.map((el) => {
      genresString += `${el.name} `;
    });
    return genresString;
  }

  get backdropUrl() {
    return this.backdropPath ? Movie.BACKDROP_BASE_URL + this.backdropPath : "";
  }
}

class Actor {
  static BACKDROP_BASE_URL = "http://image.tmdb.org/t/p/w780";
  constructor(json) {
    this.name = json.name;
    this.id = json.id;
    this.gender = json.gender;
    this.popularity = json.popularity;
    this.profilePath = json.profile_path;
    // this.profilePath = ;
  }
  get backdropUrl() {
    return this.profilePath ? Actor.BACKDROP_BASE_URL + this.profilePath : "";
  }
  static data() {
    console.log(this.name);
  }
}

class RunActors {
  static async run() {
    const actors = await APIService.fetchActors();
    ActorPage.renderActors(actors);
  }
}
document.addEventListener("DOMContentLoaded", App.run);
document.querySelector(".actors").addEventListener("click", RunActors.run);
