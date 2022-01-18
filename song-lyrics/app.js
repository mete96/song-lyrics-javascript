const devam = document.querySelector("#devam");
const sonuc = document.querySelector("#sonuc");
const icerik = document.querySelector(".icerik");
const form = document.getElementById("form");
const search = document.getElementById("search");
const baseURL = "https://api.lyrics.ovh";

fetch("./data.json")
  .then((cevap) => cevap.json())
  .then((veri) => {
    veri.forEach(function (element, index) {
      const resim = document.createElement("div");
      resim.classList.add("grido");
      resim.innerHTML = `
        <img src="${element.image}" />
      `;

      icerik.appendChild(resim);
    });
  });

async function findSong(word) {
  const res = await fetch(`${baseURL}/suggest/${word}`);
  const data = await res.json();
  dataSong(data);
  console.log(data);
}

function dataSong(data) {
  sonuc.innerHTML = `
      <ul class="songs">
        ${data.data
          .map(
            (song) => `<li>
            <audio
            controls
            src="${song.artist.preview}">
                Your browser does not support the
                <code>audio</code> element.
        </audio>
            <img src="${song.artist.picture_small}" />
        <span><strong>${song.artist.name}</strong> - ${song.title}</span>
        <button class="btn" data-artist="${song.artist.name}" data-songtitle="${song.title}">Get Lyrics</button>
      </li>`
          )
          .join("")}
      </ul>
    `;

  if (data.prev || data.next) {
    devam.innerHTML = `
        ${
          data.prev
            ? `<button class="btn" onclick="getMoreSongs('${data.prev}')">Prev</button>`
            : ""
        }
        ${
          data.next
            ? `<button class="btn" onclick="getMoreSongs('${data.next}')">Next</button>`
            : ""
        }
      `;
  } else {
    devam.innerHTML = "";
  }
}

async function getLyrics(artist, songTitle) {
  const res = await fetch(`${baseURL}/v1/${artist}/${songTitle}`);
  const data = await res.json();

  if (data.error) {
    sonuc.innerHTML = data.error;
  } else {
    let re = /Ben Fero/gi;
    let re1 = /Paroles de la chanson/gi;
    let re2 = /par/gi;
    let re3 = /motivasyon/gi;
    let re4 = /motivasyon/gi;
    let re5 = /motivasyon/gi;
    const lyrics = data.lyrics
      .replace(/(\r\n|\r|\n)/g, "<br>")
      .replace(re, "Ben Money")
      .replace(re1, "")
      .replace(re2, "")
      .replace(re3, "<br>")
      .replace(re4, "<br>")
      .replace(re5, "<br>");

    sonuc.innerHTML = `
    <div class="music">
              <div class="lyric">${artist}</strong> - ${songTitle}</div>
              <div class="orta">${lyrics}</d>
              </div>
          `;
  }

  devam.innerHTML = "";
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const searchTerm = search.value.trim();

  if (!searchTerm) {
    alert("Please type in a search term");
  } else {
    searchSongs(searchTerm);
  }
});

async function searchSongs(term) {
  const res = await fetch(`${baseURL}/suggest/${term}`);
  const data = await res.json();

  dataSong(data);
  console.log(data);
}

sonuc.addEventListener("click", (e) => {
  const clickedEl = e.target;

  if (clickedEl.tagName === "BUTTON") {
    const artist = clickedEl.getAttribute("data-artist");
    const songTitle = clickedEl.getAttribute("data-songtitle");

    getLyrics(artist, songTitle);
  }
});

async function getMoreSongs(url) {
  const res = await fetch(`https://cors-anywhere.herokuapp.com/${url}`);
  const data = await res.json();

  dataSong(data);
}
