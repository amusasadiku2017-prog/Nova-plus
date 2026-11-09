// ============================
// NOVA+ AUTHENTICATION SYSTEM
// ============================

let isSignup = false;

const authForm = document.getElementById("authForm");

document.getElementById("switchAuth").onclick = function(e) {

    e.preventDefault();

    isSignup = !isSignup;

    document.getElementById("authTitle").textContent =
    isSignup ? "Create Account" : "Welcome Back";

    document.getElementById("authText").textContent =
    isSignup ? "Join NOVA+ today." : "Sign in to continue watching.";

    document.getElementById("username").style.display =
    isSignup ? "block" : "none";

    document.getElementById("username").required = isSignup;

    document.getElementById("authButton").textContent =
    isSignup ? "Sign Up" : "Sign In";

    document.getElementById("switchText").textContent =
    isSignup ? "Already have an account?" : "New to NOVA+?";

    this.textContent = isSignup ? "Sign In" : "Create account";

};

authForm.onsubmit = function(e) {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("authMessage");

    let users = JSON.parse(localStorage.getItem("novaUsers")) || [];

    if (isSignup) {

        const username = document.getElementById("username").value;

        if (password.length < 6) {
            message.textContent = "Password must be at least 6 characters.";
            return;
        }

        if (users.some(u => u.email === email)) {
            message.textContent = "Account already exists.";
            return;
        }

        users.push({
            username,
            email,
            password
        });

        localStorage.setItem("novaUsers", JSON.stringify(users));

        message.style.color = "lightgreen";
        message.textContent = "Account created! You can now sign in.";

        return;
    }

    const user = users.find(u =>
        u.email === email && u.password === password
    );

    if (!user) {
        message.textContent = "Incorrect email or password.";
        return;
    }

    localStorage.setItem("novaCurrentUser", JSON.stringify({
        username: user.username,
        email: user.email
    }));

    openApp();
};


// ============================
// OPEN APP
// ============================

function openApp() {

    const user = JSON.parse(localStorage.getItem("novaCurrentUser"));

    if (!user) return;

    document.getElementById("authScreen").style.display = "none";
    document.getElementById("mainApp").style.display = "block";

    document.getElementById("profileName").textContent =
    "👤 " + user.username;

    loadMovies();
    loadMyList();
}


// ============================
// LOGOUT
// ============================

function logout() {

    localStorage.removeItem("novaCurrentUser");

    document.getElementById("mainApp").style.display = "none";
    document.getElementById("authScreen").style.display = "flex";

}


// ============================
// MOVIE DATABASE
// ============================

const movies = [

    {
        title: "Big Buck Bunny",
        category: "movie",
        description: "An animated adventure full of fun.",
        image: "photo-1489599849927-2ee91cede3ba",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
    },

    {
        title: "Sintel",
        category: "movie",
        description: "A fantasy adventure.",
        image: "photo-1518709268805-4e9042af9f23",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
    },

    {
        title: "Tears of Steel",
        category: "series",
        description: "A science fiction adventure.",
        image: "photo-1451187580459-43490279c0fa",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
    },

    {
        title: "Elephants Dream",
        category: "movie",
        description: "Explore a strange animated world.",
        image: "photo-1536440136628-849c177e76a1",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
    },

    {
        title: "For Bigger Blazes",
        category: "series",
        description: "An exciting short video.",
        image: "photo-1500530855697-b586d89ba3ee",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    },

    {
        title: "For Bigger Escapes",
        category: "movie",
        description: "A short cinematic adventure.",
        image: "photo-1519608487953-e999c86e7455",
        video: "https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4"
    }

];


// ============================
// DISPLAY MOVIES
// ============================

function createCard(movie) {

    const card = document.createElement("div");

    card.className = "movie-card";

    card.innerHTML = `
        <img src="https://images.unsplash.com/${movie.image}?w=500"
        alt="${movie.title}">

        <h3>${movie.title}</h3>

        <p>▶ Watch now</p>

        <button class="add-button">＋ My List</button>
    `;

    card.querySelector("img").onclick = () => playMovie(movie);

    card.querySelector("h3").onclick = () => playMovie(movie);

    card.querySelector(".add-button").onclick = (e) => {
        e.stopPropagation();
        addToMyList(movie.title);
    };

    return card;
}


function loadMovies() {

    const movieContainer = document.getElementById("movieContainer");
    const seriesContainer = document.getElementById("seriesContainer");

    movieContainer.innerHTML = "";
    seriesContainer.innerHTML = "";

    movies.forEach(movie => {

        if (movie.category === "movie") {
            movieContainer.appendChild(createCard(movie));
        } else {
            seriesContainer.appendChild(createCard(movie));
        }

    });

}


// ============================
// VIDEO PLAYER
// ============================

function playMovie(movie) {

    document.getElementById("playerModal").style.display = "flex";

    document.getElementById("playerTitle").textContent = movie.title;

    document.getElementById("videoDescription").textContent =
    movie.description;

    const player = document.getElementById("videoPlayer");

    player.src = movie.video;
    player.load();

    player.play().catch(() => {
        document.getElementById("videoDescription").textContent =
        movie.description + " Tap the play button to start.";
    });

}


function playFeatured() {
    playMovie(movies[0]);
}


function closePlayer() {

    const player = document.getElementById("videoPlayer");

    player.pause();
    player.removeAttribute("src");
    player.load();

    document.getElementById("playerModal").style.display = "none";

}


// ============================
// SEARCH MOVIES
// ============================

document.getElementById("search").addEventListener("input", function() {

    const value = this.value.toLowerCase();

    document.querySelectorAll(".movie-card").forEach(card => {

        const title = card.querySelector("h3").textContent.toLowerCase();

        card.style.display =
        title.includes(value) ? "block" : "none";

    });

});


// ============================
// MY LIST
// ============================

function loadMyList() {

    const container = document.getElementById("listContainer");

    const saved = JSON.parse(
        localStorage.getItem("novaList") || "[]"
    );

    container.innerHTML = "";

    saved.forEach(title => {

        const movie = movies.find(m => m.title === title);

        if (movie) {
            container.appendChild(createCard(movie));
        }

    });

}


function addToMyList(title) {

    let saved = JSON.parse(
        localStorage.getItem("novaList") || "[]"
    );

    if (!saved.includes(title)) {
        saved.push(title);
    }

    localStorage.setItem("novaList", JSON.stringify(saved));

    loadMyList();

}


// ============================
// START NOVA+
// ============================

if (localStorage.getItem("novaCurrentUser")) {
    openApp();
}
