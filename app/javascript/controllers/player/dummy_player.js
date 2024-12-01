import Player from "controllers/player/player";
import { debug, randomBetween } from "controllers/util";

/** Dummy Player to use in tests */
export default class extends Player {
  #intervalId;
  #currentTime;
  #loaded;
  #duration;
  #onPlaying;
  #onLoadError;

  constructor({ currentTime = 0, duration = randomBetween(300, 600), onPlaying = () => {}, onLoadError = () => {} }) {
    super()

    this.#currentTime = currentTime
    this.#duration = duration
    this.#onPlaying = onPlaying
    this.#onLoadError = onLoadError
  }

  get duration() {
    return this.#duration
  }

  get currentTime() {
    return this.#currentTime
  }

  get isLoaded() {
    return this.#loaded
  }

  load(_url) {
    const playerElement = document.querySelector("#player")

    if(playerElement.dataset.error !== undefined) {
      this.#simulateError(playerElement.dataset.error)
    } else {
      this.#onPlaying()
      this.#loaded = true
    }
  }

  play(from) {
    this.#currentTime = from
    this.pause()
    this.#intervalId = setInterval(() => {
      this.#currentTime += 1
    }, 1000)
  }

  pause() {
    clearInterval(this.#intervalId)
  }

  static async create(params) {
    return new Promise(resolve => {
      debug("Dummy needs no preparation")
      resolve(new this(params))
    })
  }

  #simulateError(error) {
    switch(error) {
      case "load":
        this.#onLoadError()
      break
    }
  }
}
