const fontType = "Arial"
const planetsFontColor = "black"

const textSize = 0.7
const defaultTurnInterval = 150
const maxParticles = 40

// Data is not scaled it is directly px
const debuggingBoxColor = 'rgba(20, 20, 20, 0.9)'
const debuggingBoxTextColor = "white"
const debuggingTextSize = 15
const debuggingBoxPadding = 3


const images = new Map()

// Load images

for (const n of ['space', 'blue', 'cyan', 'green', 'yellow', 'gray']) {
  const image = new Image()
  image.src = './assets/' + n + '.png'
  images.set(n, image)
}


class Game extends GameImp {

    #canvas
    #canvas2d

    #width = 100
    #height = 100
    #scale

    #currentTurnFrameTime = 0
    #currentTurnIndex = 0

    #turns = []


    #turnInterval = defaultTurnInterval    // Game gets updated every Xms

    #previousTimestamp = performance.now()

    #pauseGame = false
    #gameFullyLoaded = false




    constructor(canvas) {

      super(canvas)

      this.#canvas = canvas
      this.#canvas2d = this.#canvas.getContext('2d')

      addEventListener('resize', () => {this.#updateCanvasSize()})

      const self = this


      // Set interval
      anime.timeline().add({
        duration: Infinity,
        update: function() {
          let currentTimestamp = performance.now()
          self.#gameInterval(currentTimestamp - self.#previousTimestamp)
          self.#previousTimestamp = currentTimestamp
      }})

      // Event listener for mouse clicks (needed for player debugging)
      this.#canvas.addEventListener('click', function(event) {
        if (self.#currentTurnIndex >= self.#turns.length) return
        const rect = canvas.getBoundingClientRect()
        const x = event.clientX - rect.left
        const y = event.clientY - rect.top
        self.#turns[self.#currentTurnIndex].flipDebuggingOnObject(x, y, self.#scale)
      })

    }


    reset() {
        this.#currentTurnFrameTime = 0
        this.#currentTurnIndex = 0
        this.#turns = []
        this.#turnInterval = defaultTurnInterval
        this.#previousTimestamp = performance.now()
        this.#pauseGame = false
        this.#gameFullyLoaded = false
    }


    loadTurn(json) {

      let turnIndex = this.#turns.length

      if (json.width && json.height) {
        this.#width = json.width
        this.#height = json.height
        this.#updateCanvasSize()
      }

      if (json.end) this.#gameFullyLoaded = json.end


      // Create turn
      const previousTurn = this.#turns[turnIndex - 1]
      const turn = new Turn(turnIndex, json, previousTurn)

      this.#turns.push(turn)

    }

    setTurn(turnIndex) {

      if (turnIndex < 0 || turnIndex >= this.#turns.length) {
        console.log("Turn invalid.")
        return
      }

      this.#currentTurnIndex = turnIndex
      this.#currentTurnFrameTime = 0

      if (this.#pauseGame) this.#gameInterval()

    }

    setSpeed(speed) {
      let newTurnInterval = Math.floor(defaultTurnInterval / speed)
      this.#currentTurnFrameTime = (this.#currentTurnFrameTime / this.#turnInterval) * newTurnInterval
      this.#turnInterval = newTurnInterval
    }

    pauseResume() {
      this.#pauseGame = !this.#pauseGame
      return !this.#pauseGame
    }

    getTurn() {
      return this.#currentTurnIndex
    }

    getTurnCount() {
      let turnCount = this.#turns.length - 1
      if (turnCount < 0) return 0
      return turnCount
    }

    clearDebugging() {
      for (const turn of this.#turns) turn.clearDebugging()
    }

    getTableStats() {
      if (this.#turns.length === 0) return null
      let turnIndex = this.#currentTurnIndex
      if (this.#currentTurnIndex >= this.#turns.length) turnIndex = this.#turns.length - 1
      return this.#turns[turnIndex].playersStat
    }

    // Private functions

    #updateCanvasSize() {
      this.#canvas.width = this.#canvas.offsetWidth
      this.#canvas.height = this.#canvas.offsetHeight
      this.#scale = {width: this.#canvas.width / this.#width, height: this.#canvas.height / this.#height, absolute: this.#canvas.width / this.#width}
    }

    #gameInterval(delta) {

      if (this.#currentTurnIndex >= this.#turns.length) return

      let frameInterpolation = this.#currentTurnFrameTime / this.#turnInterval + this.#currentTurnIndex

      this.#draw(frameInterpolation)

      if (this.#pauseGame) return

      let currentTurnIndexChanged = this.#nextFrame(delta)
      if (currentTurnIndexChanged) this.#createParticles()
    }

    // Draw runs every frame
    #draw(frameInterpolation) {

      const imgScale = images.get('space').height * Math.max(this.#scale.width, this.#scale.height * 1.6) * 0.018

      this.#canvas2d.save()
      this.#canvas2d.rotate(frameInterpolation * 0.001)
      this.#canvas2d.drawImage(images.get('space'),-imgScale / 2 ,- imgScale / 2, imgScale, imgScale)
      this.#canvas2d.restore()

      this.#turns[this.#currentTurnIndex].draw(frameInterpolation, this.#canvas, this.#canvas2d, this.#scale)
    }

    // Create particles runs every game turn (anime.js controls the drawing)
    #createParticles() {
      this.#turns[this.#currentTurnIndex].createParticles(this.#canvas2d, this.#scale)
    }

    #nextFrame(delta) {

      if ((this.#currentTurnIndex + 1) < this.#turns.length) {

        this.#currentTurnFrameTime += delta

        if (this.#currentTurnFrameTime > this.#turnInterval) {
          this.#currentTurnFrameTime -= this.#turnInterval
          if (this.#currentTurnFrameTime > delta) this.#currentTurnFrameTime = 0
          this.#currentTurnIndex++
          return true
        }

      } else if (!this.#gameFullyLoaded) {
        // Add code for game is loading
      }
      return false

    }

}


class Turn {

    #planets = []
    #fleets = []


    constructor(turnIndex, json, previousTurn) {

      if (Array.isArray(json.playersStat)) this.playersStat = json.playersStat

      // Load planets and fleets from JSON. (Planets are loaded every turn, but fleets are loaded only once)
      if (Array.isArray(json.planets)) {

        json.planets.forEach((planet, index) => {

          let colorChanged = false
          let debuggingWrapper = { enabled: false }

          if (previousTurn) {
            if (previousTurn.#planets[index]) {
              colorChanged = previousTurn.#planets[index].data.color !== planet.color
              debuggingWrapper = previousTurn.#planets[index].debuggingWrapper
            }
          }

          this.#planets.push(new Planets(planet, colorChanged, debuggingWrapper))

        });
      }

      if (Array.isArray(json.fleets)) {
        for (const fleet of json.fleets) this.#fleets.push(new Fleet(fleet, { enabled: false }))
      }

      // Getting fleets from the previous turn if they haven't landed yet
      if (previousTurn) {

          for (const prewFleet of previousTurn.#fleets) {

            if (turnIndex >= prewFleet.data.destinationTurn) continue;

            let inside = false
            for (const thisFleet of this.#fleets) if (thisFleet.data.name === prewFleet.data.name) inside = true
            if (!inside) this.#fleets.push(prewFleet)

          }

      }

    }


    draw(frameInterpolation, canvas, canvas2d, scale) {

      canvas2d.textAlign = "center"
      canvas2d.textBaseline = "middle"
      canvas2d.lineWidth = 1


      canvas2d.font = (textSize * scale.absolute * 0.6) + "px " + fontType
      for (const planet of this.#planets) planet.draw(canvas2d, scale, frameInterpolation)

      canvas2d.font = (textSize * scale.absolute * 0.4) + "px " + fontType
      for (const fleet of this.#fleets) fleet.draw(frameInterpolation, canvas2d, this.#planets, scale)

      canvas2d.font = (textSize * scale.absolute * 0.6) + "px " + fontType

      // Draw debugging

      canvas2d.textAlign = "left"
      canvas2d.textBaseline = "top"

      canvas2d.font = debuggingTextSize + "px " + fontType

      function drawDebugging(object, width) {

        canvas2d.beginPath()
        canvas2d.fillStyle = debuggingBoxColor
        canvas2d.rect(object.x - debuggingBoxPadding, object.y - debuggingBoxPadding, width + debuggingBoxPadding * 2, (debuggingTextSize) * Object.keys(object.data).length + debuggingBoxPadding * 2)
        canvas2d.stroke()
        canvas2d.fill()

        canvas2d.beginPath()
        canvas2d.fillStyle = "red"
        canvas2d.arc(object.x, object.y, 3, 0, Math.PI * 2)
        canvas2d.fill()

        canvas2d.fillStyle = debuggingBoxTextColor

        Object.entries(object.data).sort().forEach(([key, value], index) => {
          canvas2d.fillText(key + ": " + JSON.stringify(value), object.x, object.y + index++ * debuggingTextSize)
        })

      }

      for (const planet of this.#planets) if (planet.debuggingWrapper.enabled) drawDebugging(planet, 120)
      for (const fleet of this.#fleets) if (fleet.debuggingWrapper.enabled) drawDebugging(fleet, 160)

    }


    createParticles(canvas2d, scale) {
      for (const planet of this.#planets) planet.drawParticle(canvas2d, scale)
    }

    flipDebuggingOnObject(x, y) {
      for (const fleet of [...this.#fleets].reverse()) {
        if (fleet.collideForDebugging(x, y)) return;
      }
      for (const planet of [...this.#planets].reverse()) {
        if (planet.collideForDebugging(x, y)) return;
      }
    }

    clearDebugging() {
      for (const planet of this.#planets) planet.debuggingWrapper.enabled = false
      for (const fleet of this.#fleets) fleet.debuggingWrapper.enabled = false
    }

}



class Planets {

  constructor(data, colorChanged, debuggingWrapper) {
    this.data = data
    this.colorChanged = colorChanged
    this.debuggingWrapper = debuggingWrapper
  }

  collideForDebugging(x, y) {
    let collided = (this.x - x) ** 2 + (this.y - y) ** 2 <= this.size ** 2
    if(collided) this.debuggingWrapper.enabled = !this.debuggingWrapper.enabled
    return collided
  }

  draw(canvas2d, scale, frameInterpolation) {

    this.x = this.data.positionX * scale.width
    this.y = this.data.positionY * scale.height

    this.size = (1 - (1 / (this.data.planetSize / 2 + 1))) * scale.absolute
    const planetScaleSize = this.size * 3

    canvas2d.save()
    canvas2d.translate(this.x, this.y)
    canvas2d.rotate(frameInterpolation * 0.1 + this.data.planetSize)
    canvas2d.translate(-this.x, -this.y)
    canvas2d.drawImage(images.get(this.data.color), this.x - planetScaleSize / 2, this.y - planetScaleSize / 2, planetScaleSize, planetScaleSize)
    canvas2d.restore()

    canvas2d.fillStyle = planetsFontColor
    canvas2d.fillText(this.data.fleetSize, this.x, this.y)

  }


  drawParticle(canvas2d, scale) {
    if (this.colorChanged) new Particle(canvas2d,  this.data.color, this.data.positionX * scale.width,
      this.data.positionY * scale.height,  this.data.planetSize,scale)
  }

}



class Fleet {


  constructor(data, debuggingWrapper) {
    this.data = data
    this.debuggingWrapper = debuggingWrapper
  }

  collideForDebugging(x, y) {
    let collided = (this.x - x) ** 2 + (this.y - y) ** 2 <= this.fleetSize ** 2
    if(collided) this.debuggingWrapper.enabled = !this.debuggingWrapper.enabled
    return collided
  }

  draw(interpolation, canvas2d, planets, scale) {


    let originPlanet = planets[this.data.originPlanet].data
    let destinationPlanet = planets[this.data.destinationPlanet].data

    let fleetInterpolation = ((this.data.destinationTurn - interpolation) / this.data.neededTurns)

    this.x = (destinationPlanet.positionX + (originPlanet.positionX - destinationPlanet.positionX) * fleetInterpolation) * scale.width
    this.y = (destinationPlanet.positionY + (originPlanet.positionY - destinationPlanet.positionY) * fleetInterpolation) * scale.height

    this.fleetSize = (1 - (1 / ((this.data.fleetSize / 3) * 2 + 1))) * 0.3 * scale.absolute

    canvas2d.beginPath()
    canvas2d.arc(this.x, this.y, this.fleetSize, 0, 2 * Math.PI)
    canvas2d.fillStyle = this.data.color
    canvas2d.fill()
    canvas2d.strokeStyle = "black"
    canvas2d.stroke()

    canvas2d.fillStyle = planetsFontColor
    canvas2d.fillText(this.data.fleetSize, this.x, this.y)

  }

}




class Particle {


  constructor(canvas2d, color, x, y, size, scale) {

    const particles = []

    size = 1 - (1 / (size + 0.1))
    let absoluteScale = size * scale.absolute * 0.1

    for (let i = 0; i < (size * maxParticles); i++) {
      particles.push(this.#createParticle(canvas2d, color, x, y, absoluteScale))
    }

    this.#addParticles(particles)

  }


  #createParticle(canvas2d, color, x, y, absoluteScale) {

    const angle = anime.random(0, 360) * Math.PI / 180
    const radius = [-1, 1][anime.random(0, 1)] * anime.random(20, 60) * absoluteScale

    let endX = x + radius * Math.cos(angle)
    let endY = y + radius * Math.sin(angle)

    const particle = {
      x: x,
      y: y,
      color: color,
      radius: anime.random(2, 6) * absoluteScale,
      endPos: {x: endX, y: endY}
    }

    particle.draw = function () {
      canvas2d.beginPath()
      canvas2d.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI, true)
      canvas2d.fillStyle = particle.color
      canvas2d.fill()
    }

    return particle

  }

   #addParticles(particles) {

      anime.timeline().add({
          targets: particles,
          x: p => p.endPos.x,
          y: p => p.endPos.y,
          radius: 0.03,
          duration: anime.random(800, 1000),
          easing: 'easeOutExpo',
          update:  function(anim) {
            for (const animatable of anim.animatables) animatable.target.draw()
          }
      })


  }

}
