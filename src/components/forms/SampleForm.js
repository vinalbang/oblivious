import { Component } from "react";
import React from "react";

export class SampleForm extends Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }
  state = {
     selectedFile: null
  };
  
  // On file select (from the pop up)
  onFileChange = event => {
    this.setState({ selectedFile: event.target.files[0] });
    console.log("File Updated");
  };
  

  // On file upload (click the upload button)
  onFileUpload = () => {
    var formData = new FormData();
    const file = this.inputRef.current.files[0];
    if(this.state.selectedFile!==file){
      //If encryption has not been performed
      formData.append("sampleFile",file,this.state.selectedFile.name);
    }else{
      //If encryption has been performed
      formData.append("sampleFile",this.state.selectedFile,"finalName");
    }
    //Submit the data to server
    fetch("http://localhost:4000/upload",{
      "method":"POST",
      "mode": 'no-cors',
      "body":formData
    }).then((response) => {
      console.log(response=>response.json());
    })
      .then(data=>{
        console.log(data)
      })
    .catch(err => {
      console.log(err);
    });
  };

  render() {
    return (
        <div>
        <h3>
          File Upload using React!
        </h3>
        <div>
            <input type="file" data-obliv-encrypt="testValue" ref={this.inputRef} onChange={this.onFileChange} />
            <button id="uploadButton" onClick={this.onFileUpload}>
              Upload!
            </button>
        </div>
    </div>
    );
  }
}
