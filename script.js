const API_KEY = "AIzaSyC507JjPNAqCt4R3m068i_YuivTXVMFLlw";

const searchBtn = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const results = document.getElementById("results");
const playerFrame = document.getElementById("playerFrame");

async function searchMusic(query) {
  results.innerHTML = "<p>Loading...</p>";

  const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}%20music&type=video&maxResults=12&key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    results.innerHTML = "";

    data.items.forEach((item) => {
      const videoId = item.id.videoId;
      const title = item.snippet.title;
      const channel = item.snippet.channelTitle;
      const thumbnail = item.snippet.thumbnails.high.url;

      const card = document.createElement("div");
      card.classList.add("card");

      card.innerHTML = `
        <img src="${thumbnail}" alt="${title}">
        <h3>${title}</h3>
        <p>${channel}</p>
      `;

      card.addEventListener("click", () => {

  playerFrame.src =
    `https://www.youtube.com/embed/${videoId}?autoplay=1`;

  document.getElementById("miniThumb").src = thumbnail;

  document.getElementById("miniTitle").innerText = title;

  document.getElementById("miniArtist").innerText = channel;
});

      results.appendChild(card);
    });
  } catch (error) {
    results.innerHTML = "<p>Terjadi error saat mengambil data.</p>";
    console.error(error);
  }
}

function saveHistory(query) {

  let history =
    JSON.parse(localStorage.getItem("history")) || [];

  history.unshift(query);

  history = [...new Set(history)];

  history = history.slice(0, 10);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}

function playMusic(videoId) {
  playerFrame.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

searchBtn.addEventListener("click", () => {
  const query = searchInput.value.trim();

  if (query !== "") {
    saveHistory(query);
    searchMusic(query);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    searchBtn.click();
  }
});

searchMusic("Top Hits Indonesia");
