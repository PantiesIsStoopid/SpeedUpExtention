chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (
    changeInfo.status === "complete" &&
    tab.url.includes("youtube.com/watch")
  ) {
    chrome.storage.sync.get(["playbackSpeed"], function (result) {
      const savedSpeed = result.playbackSpeed || 1;
      chrome.scripting.executeScript({
        target: { tabId: tabId },
        func: (speed) => {
          const applySpeed = (video) => {
            if (video) {
              video.playbackRate = speed;
            }
          };

          const video = document.querySelector("video");
          applySpeed(video);

          // Attach an event listener to handle AJAX navigation
          document.addEventListener("yt-navigate-finish", () => {
            const newVideo = document.querySelector("video");
            applySpeed(newVideo);
          });
        },
        args: [savedSpeed],
      });
    });
  }
});
