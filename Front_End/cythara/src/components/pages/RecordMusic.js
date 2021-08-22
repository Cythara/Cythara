import React from "react";

import AudioReactRecorder,{RecordState} from "audio-react-recorder"
import MicRecorder from "mic-recorder-to-mp3";

const Mp3Recorder = new MicRecorder({bitRate:128});
class RecordMusic extends React.Component{
    constructor(){
        super();

        this.state = {
            isRecording:false,
            blobURL:"",
            isBlocked:false,
            file: "",
            fileName: "Choose File"
        }
        navigator.getUserMedia({audio:true},
            () => {
                console.log("Permission Granted")
                this.setState({isBlocked:false})
            },
            () =>{
                console.log("Permission Denied")
                this.setState({isBlocked: true})
            }
        );
    }
    start = () => {
        if(this.state.isBlocked){
            console.log("Permission Denied");
        }
        else{
            Mp3Recorder.start()
            .then(
                () =>{
                    this.setState({isRecording: true});
                })
            .catch(
                (e) => console.error(e)
            )
        }
    }
    stop = () =>{
        Mp3Recorder
        .stop()
        .getMp3()
        .then(([buffer,blob]) =>{
            const blobURL = URL.createObjectURL(blob)
            this.setState({blobURL,isRecording:false});
        })
        .catch(
            (e) => console.log(e)
            )
    }

    onChange = (e) =>{
        this.setState({file:e.target.files[0]});
        this.setState({fileName:e.target.files[0].name});
    }

    uploadFile = async (e) =>{
        e.preventDefault();
        const formData = new formData();
        formData.append("file",file);
        console.log(formData)
        //make post request to server
    }
    render(){
        return(
            <div>
                <button onClick = {this.start} disabled = {this.state.isRecording}>Record</button>
                <button onClick = {this.stop} disable = {this.state.isRecording}>Stop</button>
                <audio src = {this.state.blobURL} controls = "controls"/>
                <form onSubmit = {this.uploadFile}>
                    <div>
                        <input type = "file" onChange = {this.onChange}></input>
                        <label htmlFor = "customFile">{this.state.fileName}</label>
                    </div>
                    <input type = "submit" value = "Upload" onChange = {this.uploadFile}/>
                </form>
                </div>
        )
    }
}

export default RecordMusic