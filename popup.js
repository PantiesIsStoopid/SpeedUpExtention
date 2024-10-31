document.addEventListener("DOMContentLoaded", function () {
  const speedRange = document.getElementById("speedRange");
  const gridContainer = document.querySelector(".grid-container");

  // Create buttons
  for (let i = 0.25; i <= 5; i += 0.25) {
    const button = document.createElement("button");
    button.innerText = `${i}x`;
    button.addEventListener("click", () => setSpeed(i));
    gridContainer.appendChild(button);
  }

  // Load saved speed
  chrome.storage.sync.get(["playbackSpeed"], function (result) {
    const savedSpeed = result.playbackSpeed || 1;
    speedRange.value = savedSpeed;
    setSpeed(savedSpeed);
  });

  // Set speed from slider
  speedRange.addEventListener("input", function () {
    setSpeed(this.value);
  });

  // Function to set the playback speed
  function setSpeed(speed) {
    chrome.storage.sync.set({ playbackSpeed: speed });
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: (speed) => {
          const video = document.querySelector("video");
          if (video) {
            video.playbackRate = speed;
          }
          // Attach an event listener to handle AJAX navigation
          document.addEventListener("yt-navigate-finish", () => {
            const newVideo = document.querySelector("video");
            if (newVideo) {
              newVideo.playbackRate = speed;
            }
          });
        },
        args: [speed],
      });
    });
  }
});
