chrome.runtime.onInstalled.addListener(function () {
  console.log("Extension Loaded.");
   
  chrome.action.onClicked.addListener((tab) => {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: testMethod
    });

  });
  
});

function testMethod() {
  const button = document.querySelector("button[id='uploadButton']");
  button.addEventListener("click", async () => {
    alert("Upload Button Clicked!!");
  });
  
}
