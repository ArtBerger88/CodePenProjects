import React from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";

const initialState = {
breakLength: 5,
sessionLength: 25,
timerLabel: "Session",
timeLeft: 25 * 60,
isRunning: false,
};

const formatTime = (seconds) => {
const minutes = Math.floor(seconds / 60);
const secondsRemaining = seconds % 60;
return `${minutes.toString().padStart(2, '0')}:${secondsRemaining.toString().padStart(2, '0')}`;
};

class Clock extends React.Component {
constructor(props) {
super(props);
this.state = initialState;
this.handleBreakIncrement = this.handleBreakIncrement.bind(this);
this.handleBreakDecrement = this.handleBreakDecrement.bind(this);
this.handleSessionIncrement = this.handleSessionIncrement.bind(this);
this.handleSessionDecrement = this.handleSessionDecrement.bind(this);
this.handleStartStop = this.handleStartStop.bind(this);
this.handleReset = this.handleReset.bind(this);
this.handleBeep = this.handleBeep.bind(this);
}

 handleBreakIncrement() {
this.setState((prevState) => ({
breakLength: prevState.breakLength + 1,
timeLeft: prevState.timerLabel === "Break" ? Math.min((prevState.breakLength + 1) * 60, 60 * 60) : prevState.timeLeft,
}));
}

 handleBreakDecrement() {
this.setState((prevState) => ({
breakLength: Math.max(prevState.breakLength - 1, 1),
timeLeft: prevState.timerLabel === "Break" ? Math.max((prevState.breakLength - 1) * 60, 0) : prevState.timeLeft,
}));
}

 handleSessionIncrement() {
this.setState((prevState) => ({
sessionLength: prevState.sessionLength + 1,
timeLeft: prevState.timerLabel === "Session" ? Math.min((prevState.sessionLength + 1) * 60, 60 * 60) : prevState.timeLeft,
}));
}

 handleSessionDecrement() {
this.setState((prevState) => ({
sessionLength: Math.max(prevState.sessionLength - 1, 1),
timeLeft: prevState.timerLabel === "Session" ? Math.max((prevState.sessionLength - 1) * 60, 0) : prevState.timeLeft,
}));
}

 handleBeep() {
const beepAudio = document.getElementById('beep');
beepAudio.play().catch((error) => console.error('Audio playback error:', error));
};
  
  handleSwitchSessionBreak() {
  clearInterval(this.state.intervalId);
  if (this.state.timerLabel === "Session") {
    console.log("Session ended. Switching to Break.");
    this.setState((prevState) => ({
      timerLabel: "Break",
      timeLeft: (prevState.breakLength) * 60,
    }));
  } else {
    console.log("Break ended. Switching to Session.");
    this.setState((prevState) => ({
      timerLabel: "Session",
      timeLeft: (prevState.sessionLength) * 60,
    }));
  }
    console.log("Updated timerLabel:", this.state.timerLabel);
    this.startTimer();
}

 startTimer() {
    if (this.state.isRunning) {
      clearInterval(this.state.intervalId);
    }
   console.log("Starting timer. Current timerLabel:", this.state.timerLabel);
   
  const intervalId = setInterval(() => {
    if (this.state.timeLeft > 0) {
      this.setState((prevState) => ({ timeLeft: prevState.timeLeft - 1 }));
    } else {
      this.handleSwitchSessionBreak();
      this.handleBeep();
    }
  }, 1000);
  this.setState({ intervalId, isRunning: true });
}
  
handleStartStop() {
  if (this.state.isRunning) {
    clearInterval(this.state.intervalId);
    this.setState({intervalId: null, isRunning: false });
  } else {
    this.startTimer();
  }
}

 handleReset() {
   if (this.state.intervalId) {
    clearInterval(this.state.intervalId);
  }
  this.setState({ isRunning: false, intervalId: null });
  this.setState(initialState);
  if (this.audioBeep) {
    this.audioBeep.pause();
    this.audioBeep.currentTime = 0;
  }
}
 
  componentDidUpdate(prevProps, prevState) {
this.audioBeep = document.getElementById('beep');
}
  
  render() {
return (
<div>
<div id="session-label">Session Length</div>
<button className="btn" id="session-increment" onClick={this.handleSessionIncrement} disabled={this.state.sessionLength >= 60}>△</button>
<p id="session-length">{this.state.sessionLength}</p>
<button className="btn" id="session-decrement" onClick={this.handleSessionDecrement} disabled = {this.state.sessionLength <= 1}>▼</button>
<div id="break-label">Break Length</div>
<button className="btn" id="break-increment" onClick={this.handleBreakIncrement} disabled={this.state.breakLength >= 60}>△</button>
<p id="break-length">{this.state.breakLength}</p>
<button className="btn" id="break-decrement" onClick={this.handleBreakDecrement} disabled = {this.state.sessionLength <= 1}>▼</button>
<div id="timer-container">
<div id="timer-label">{this.state.timerLabel}</div>
<div id="time-left">{formatTime(this.state.timeLeft)}</div>
</div>
<button id="start_stop" onClick={this.handleStartStop}>{this.state.isRunning ? 'Pause' : 'Start'}</button>
<button id="reset" onClick={this.handleReset}>RESET</button>
  <audio id="beep" src="https://raw.githubusercontent.com/ArtBerger88/CodePenProjects/main/CodePen/beep.wav" preload="auto"></audio>
</div>
);
}
}

ReactDOM.render(
<React.StrictMode>
<Clock />
</React.StrictMode>,
document.getElementById("root"),
);

console.log('Component rendered');