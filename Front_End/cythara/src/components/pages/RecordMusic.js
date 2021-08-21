import React from "react";

import AudioReactRecorder,{RecordState} from "audio-react-recorder"

class RecordMusic extends React.Component{
    constructor(props){
        super(props)
        this.state = {
            recordState : null,
            blob:""
        }
    }

    start = () =>{
        this.setState({
            recordState: RecordState.START
        })
    }

    stop = () =>{
        this.setState({
            recordState:RecordState.STOP
        })
    }

    onStop = (audioData) =>{
        this.state.blob = audioData.url;

    }
    render(){
        const recordState = this.state.recordState
        return(
            <div>
                <AudioReactRecorder state = {recordState} onStop = {this.onStop}/>
                <button onClick = {this.start}>Start</button>
                <button onClick = {this.stop}>Stop</button>
                <audio controls src = {this.state.blob}/>
            </div>
        )
    }
}

export default RecordMusic