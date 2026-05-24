const API_KEY = "AIzaSyC507JjPNAqCt4R3m068i_YuivTXVMFLlw";

const searchBtn =
document.getElementById("searchBtn");

const searchInput =
document.getElementById("searchInput");

const results =
document.getElementById("results");

const playerFrame =
document.getElementById("playerFrame");

const playBtn =
document.getElementById("playBtn");

let isPlaying = false;

/* SEARCH MUSIC */

async function searchMusic(query){

  results.innerHTML = `
<div class="loading">
  Loading music...
</div>
`;

  const url =
`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}%20music&type=video&maxResults=12&key=${API_KEY}`;

  try{

    const response =
      await fetch(url);

    const data =
      await response.json();

    results.innerHTML = "";

    data.items.forEach((item)=>{

      const videoId =
        item.id.videoId;

      const title =
        item.snippet.title;

      const channel =
        item.snippet.channelTitle;

      const thumbnail =
        item.snippet.thumbnails.high.url;

      const card =
        document.createElement("div");

      card.classList.add("card");

      card.innerHTML = `
        <img src="${thumbnail}">
        <h3>${title}</h3>
        <p>${channel}</p>
      `;

      card.addEventListener("click",()=>{

        playerFrame.src =
`https://www.youtube.com/embed/${videoId}?autoplay=1&enablejsapi=1`;

        document.getElementById("miniThumb").src =
          thumbnail;

        document.getElementById("miniTitle").innerText =
          title;

        document.getElementById("miniArtist").innerText =
          channel;

        isPlaying = true;

        playBtn.innerHTML =
          '<i class="fa-solid fa-pause"></i>';
      });

      results.appendChild(card);
    });

  }catch(error){

    console.error(error);

    results.innerHTML =
      "<p>Terjadi error saat mengambil data.</p>";
  }
}

/* SAVE HISTORY */

function saveHistory(query){

  let history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  history.unshift(query);

  history = [...new Set(history)];

  history = history.slice(0,10);

  localStorage.setItem(
    "history",
    JSON.stringify(history)
  );
}

/* SEARCH BUTTON */

searchBtn.addEventListener("click",()=>{

  const query =
    searchInput.value.trim();

  if(query !== ""){

    saveHistory(query);

    renderHistory();

    searchMusic(query);
  }
});

/* ENTER KEY */

searchInput.addEventListener("keypress",(e)=>{

  if(e.key === "Enter"){

    searchBtn.click();
  }
});

/* PLAY / PAUSE */

playBtn.addEventListener("click",()=>{

  if(!playerFrame.src) return;

  if(isPlaying){

    playerFrame.contentWindow.postMessage(
      '{"event":"command","func":"pauseVideo","args":""}',
      '*'
    );

    playBtn.innerHTML =
      '<i class="fa-solid fa-play"></i>';

  }else{

    playerFrame.contentWindow.postMessage(
      '{"event":"command","func":"playVideo","args":""}',
      '*'
    );

    playBtn.innerHTML =
      '<i class="fa-solid fa-pause"></i>';
  }

  isPlaying = !isPlaying;
});

  /* PLAY BUTTON AUTO FIX */

playerFrame.onload = () => {

  playBtn.innerHTML =
    '<i class="fa-solid fa-pause"></i>';

  isPlaying = true;
};

/* SHOW HISTORY */

function renderHistory(){

  const historyList =
    document.getElementById("historyList");

  const history =
    JSON.parse(
      localStorage.getItem("history")
    ) || [];

  historyList.innerHTML = "";

  history.forEach((item)=>{

    const btn =
      document.createElement("button");

    btn.innerText = item;

    btn.addEventListener("click",()=>{

      searchInput.value = item;

      searchMusic(item);
    });

    historyList.appendChild(btn);
  });
}

renderHistory();

/* DEFAULT SEARCH */

searchMusic("Top Hits Indonesia");
