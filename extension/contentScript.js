const reader = new FileReader();
const inputFileTag = document.querySelector(
  "input[type='file'][data-obliv-encrypt]"
);
let key;
inputFileTag.addEventListener(
  "change",
  function (event) {
    event.preventDefault();
    reader.addEventListener("load", handleEvent);
    const selectedFile = inputFileTag.files[0];
    const apiKeyValue = inputFileTag.getAttribute("data-obliv-encrypt");
    if (this.files.length > 0) {
      //Generating key for encryption
      //Need to save it somewhere to decrypt the data as needed.
      //Not saving it now.
      let req = new XMLHttpRequest();
      let baseUrl = "http://localhost:4200/generateKey";
      let urlParams = {
        apiKey: apiKeyValue,
      };
      req.open("POST", baseUrl, true);
      req.send(JSON.stringify(urlParams));
      req.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
          key = JSON.parse(this.responseText);
          reader.readAsDataURL(selectedFile);
        }
      };
    }
  },
  true
);

function handleEvent(event) {
  //On load complete, picking the file content to encrypt using generated key
  if (event.type === "load") {
    var data = reader.result.valueOf();
    encryptData(data);
  }
}

function encryptData(data) {
  let req = new XMLHttpRequest();
  let baseUrl = "http://localhost:4200/encrypt";
  let urlParams = {
    value: data.substring(data.indexOf("base64") + 7),
    key: key.generatedKey,
  };
  req.open("POST", baseUrl, true);
  req.send(JSON.stringify(urlParams));
  req.onreadystatechange = function () {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
      let response = JSON.parse(this.responseText);
      let tfile = new File([response.output], inputFileTag.files[0].name, {
        type: data.substring(5, data.indexOf("base64")),
        lastModified: new Date().getTime(),
      });
      //After file encryption, setting the file back to input tag
      let container = new DataTransfer();
      container.items.add(tfile);
      inputFileTag.files = container.files;
    }
  };
}
