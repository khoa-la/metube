const videoCardContainer = document.querySelector(".video-container");

let api_key = "your api key";
let video_http = "https://www.googleapis.com/youtube/v3/videos?";
let channel_http = "https://www.googleapis.com/youtube/v3/channels?";

fetch(
  video_http +
    new URLSearchParams({
      key: api_key,
      part: "snippet",
      chart: "mostPopular",
      maxResults: 50,
      regionCode: "IN",
    })
)
  .then((res) => res.json())
  .then((data) => {
    data.items.forEach((item) => {
      getChannelIcon(item);
    });
  })
  .catch((err) => console.log(err));

const getChannelIcon = (video_data) => {
  fetch(
    channel_http +
      new URLSearchParams({
        key: api_key,
        part: "snippet",
        id: video_data.snippet.channelId,
      })
  )
    .then((res) => res.json())
    .then((data) => {
      video_data.channelThumbnail =
        data.items[0].snippet.thumbnails.default.url;
      makeVideoCard(video_data);
    });
};

const makeVideoCard = (data) => {
  videoCardContainer.innerHTML += `
    <div class="video" onclick="location.href = 'https://youtube.com/watch?v=${data.id}'">
        <img src="${data.snippet.thumbnails.high.url}" class="thumbnail" alt="">
        <div class="content">
            <img src="${data.channelThumbnail}" class="channel-icon" alt="">
            <div class="info">
                <h4 class="title">${data.snippet.title}</h4>
                <p class="channel-name">${data.snippet.channelTitle}</p>
            </div>
        </div>
    </div>
    `;
};

// search bar

const searchInput = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");
let searchLink = document.getElementById("ifrm");

searchBtn.addEventListener("click", () => {
  if (searchInput.value.length) {
    searchLink.src = searchInput.value;
    searchInput.value = "";
  }
});
// Paste to search
document.addEventListener("DOMContentLoaded", function () {
  let pasteButton = document.getElementsByTagName("button")[0];
  pasteButton.addEventListener("click", function () {
    navigator.clipboard.readText().then(
      (cliptext) => (document.querySelector(".search-bar").value = cliptext),
      (err) => console.log(err)
    );
  });
});

function downloadImage() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", searchInput.value, true);
  xhr.responseType = "blob";
  xhr.onload = function () {
    var urlCreator = window.URL || window.webkitURL;
    var imageUrl = urlCreator.createObjectURL(this.response);
    var tag = document.createElement("a");
    tag.href = imageUrl;
    tag.target = "_blank";
    tag.download = "sample.png";
    document.body.appendChild(tag);
    tag.click();
    document.body.removeChild(tag);
  };
  xhr.onerror = (err) => {
    alert("Failed to download picture");
  };
  xhr.send();
}
