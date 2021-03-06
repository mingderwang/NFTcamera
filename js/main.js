// ./js/main.js
"use strict";
const video = document.querySelector("video");
const canvas = document.createElement("canvas");
const img = document.querySelector("img");

const constraints = (window.constraints = {
  audio: false,
  video: true,
});

function handleSuccess(stream) {
  window.stream = stream;
  video.srcObject = stream;
}

function handleError(error) {
  console.log(
    "navigator.MediaDevices.getUserMedia error: ",
    error.message,
    error.name
  );
}

function onCapture() {
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then(handleSuccess)
    .catch(handleError);
}

canvas.addEventListener("load", () => {
  console.log("canvas on load");
});

async function takeScreenshot() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.getContext("2d").drawImage(video, 0, 0);
  // Other browsers will fall back to image/png
  //img.src = canvas.toDataURL("image/webp");
  //<img src=""> in html

  canvas.toBlob(function (blob) {
    const reader = new FileReader();
    reader.addEventListener("loadend", () => {
      const arrayBuffer = reader.result;
      console.log(arrayBuffer.byteLength + " bytes.");

      // Dispay Blob content in an Image.
      const blob = new Blob([arrayBuffer], { type: "image/png" });
      img.src = URL.createObjectURL(blob);
      ipfs
        .add(blob)
        .then((e) => {
          return "https://ipfs.io/ipfs/" + e.path;
        })
        .then((url) => {
          document.querySelector(
            "#ipfs"
          ).innerHTML = `To see your phone, you may click here -> <a href='${url}' target="_blank"> ${url} </a>`;

          const metadataJson = {
            name: "login with a Gmail account",
            description: "Generated by a NFTcam webapp",
            external_url: "https://www.nftcam.me/",
            image: url,
          };
          console.log(metadataJson);
        });
    });
    reader.readAsArrayBuffer(blob);
    // reader will start on listener
  });
}

function stopMedia() {
  if (window.stream) {
    const videoStreams = window.stream.getVideoTracks();
    console.log("videoStreams", videoStreams);
    videoStreams.forEach((stream) => {
      stream.stop(); // stop all media stream
    });

    // release resource
    video.src = video.srcObject = null;
  }
}

onCapture();
