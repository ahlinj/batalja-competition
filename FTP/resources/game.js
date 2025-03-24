const asciiTab = 9


if (typeof Game !== "function") {
    console.error("Game class is not defined.")
}


const canvas = document.createElement("canvas")
canvas.setAttribute("id", "canvasGame")
const game = new Game(canvas)

function addCanvas() {
    const container = document.getElementById("container")
    if (container) container.appendChild(canvas)
}

addCanvas()



// Update game player stuff

function updatePlayer() {

    let progressBar = document.getElementById("progressBar")
    let timeStamp = document.getElementById("timeStamp")

    if (progressBar && timeStamp) {
       progressBar.max = game.getTurnCount()
       progressBar.value = game.getTurn()
       timeStamp.textContent = "Turn: "  + game.getTurn() + " / " + (game.getTurnCount())
    }

}

let lastTurn = 0

function updateStats() {

    let statsJson = game.getTableStats()

    if (!statsJson) return

    // Top bar
    let barOut = ""
    let lastTeam = ""

    let sum = 0

    for (const player of statsJson) sum += player.score

    for (const player of statsJson) {
        if (lastTeam != player.team && lastTeam != "")  barOut += "<div class='breaker team-label'></div>"
        lastTeam = player.team
        barOut += "<div style='width:" + (player.score / sum) * 100 + "%;background-color:" + player.color + "' class='team-label'></div>"
    }

    document.getElementById('game-bar').innerHTML = barOut

    // Group players by team
    let teams = {}
    for (let player of statsJson) {
        if (!teams[player.team]) teams[player.team] = []
        teams[player.team].push(player)
    }

    let statsHtml = "<thead><tr><th>Teams</th>"

    // Create the team row
    let teamNames = Object.keys(teams)
    for (let team of teamNames) statsHtml += "<th colspan='" + teams[team].length + "'>" + team + "</th>"
    statsHtml += "</tr>"

    // Create the player row
    statsHtml += "<tr><tbody><th>Players</th>"
    let playerCount = 0
    for (let team of teamNames) {
        for (let player of teams[team]) statsHtml += "<td>Player " + playerCount++ + "</td>"
    }
    statsHtml += "</tr></thead>"

    // Create the color row
    statsHtml += "<tr><th>Colors</th>"
    for (let team of teamNames) {
        for (let player of teams[team]) statsHtml += "<td style='color:" + player.color + ";'>" + player.color + "</td>"
    }
    statsHtml += "</tr>"

    // Create the data rows
    let columns = Object.keys(statsJson[0]).filter(column => column !== 'team' && column !== 'color')

    for (let column of columns) {
        statsHtml += "<tr><th>" + column + "</th>"
        for (let team of teamNames) {
            for (let player of teams[team]) statsHtml += "<td>" + player[column] + "</td>"
        }
        statsHtml += "</tr>"
    }

    statsHtml += "</tbody>"

    document.getElementById('stats').innerHTML = statsHtml

}

document.addEventListener("keydown", (event) => {
    if (event.keyCode != asciiTab) return
    event.preventDefault()
    document.getElementById('stats').style.display = "table"
})

document.addEventListener("keyup", (event) => {
    if (event.which != asciiTab) return;
    event.preventDefault()
    document.getElementById('stats').style.display = "none"
})


anime.timeline().add({
    duration: Infinity,
    update: function() {
        if (!document.getElementById("game")) return
        if (lastTurn != game.getTurn()) updateStats()
        updatePlayer()
        lastTurn = game.getTurn()
}})



// Hide/show controls

let hideControlsTimeout

function showControls() {
    const controls = document.getElementById("controls")
    controls.classList.remove("hidden")
    clearTimeout(hideControlsTimeout)
    hideControlsTimeout = setTimeout(() => {if (!controls.matches(":hover")) {controls.classList.add("hidden")}}, 2000);
}






// Game turns loading stuff

let allAnimation = []


function loadGameTurn(turn) {
    startGame()
    game.loadTurn(turn)
}

function loadGameTurns(turns) {
    startGame()
    for (const turn of JSON.parse(turns)) game.loadTurn(turn)
}

function startGame() {
     addCanvas()
     for (const anime of allAnimation) anime.play()
     allAnimation = []
}

function endGame() {
    game.reset()
    anime.running.forEach(animation => {
        allAnimation.push(animation)
        animation.pause()
    })
}

endGame()



