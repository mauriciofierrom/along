import Player from "controllers/player/player"
import { debug } from "controllers/util"

export default class extends Player {
  static #addPlayerPreview() {
    const template = document.querySelector("#player-preview-template")
    const clone = document.importNode(template.content, true)

    const playerContainer = document.querySelector(".player")
    playerContainer.prepend(clone)
  }

  get duration() {
    return 182
  }

  get currentTime() {
    return 6
  }

  load(url) {
    debug(`Attempting to load ${url}`)
  }

  play(from) {
    debug(`Attempling to play from ${from}`)
  }

  pause() {
    debug("Pausing")
  }

  canPlay() {
    return Promise.reject()
  }

  setPlaybackSpeed(speed) {
    debug(`Attempting to set playbackspeed ${speed}`)
  }

  dispose() {
    debug("Disposing")
    const playerPreview = document.querySelector("#player-preview")
    playerPreview.remove()
  }

  static create() {
    this.#addPlayerPreview()
    return Promise.resolve(new this())
  }
}
