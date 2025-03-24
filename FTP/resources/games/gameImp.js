class GameImp {

  constructor(canvas) {}

  // Reset must be implemented to work with angular
  reset() {throw new Error("Method 'reset' must be implemented.")}

  loadTurn(json) {throw new Error("Method 'loadTurn' must be implemented.")}

  setTurn(turnIndex) {throw new Error("Method 'setTurn' must be implemented.")}

  setSpeed(speed) {throw new Error("Method 'setSpeed' must be implemented.");}

  pauseResume() {throw new Error("Method 'pauseResume' must be implemented.")}

  getTurn() {throw new Error("Method 'getTurn' must be implemented.")}

  getTurnCount() {throw new Error("Method 'getTurnCount' must be implemented.")}

  clearDebugging() {throw new Error("Method 'clearDebugging' must be implemented.")}

  getTableStats() {throw new Error("Method 'getTableStats' must be implemented.")}

}
