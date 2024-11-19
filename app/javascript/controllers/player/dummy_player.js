import Player from "controllers/player/player";
import { debug } from "controllers/util";

/** Dummy Player to use in tests */
export default class extends Player {
  #intervalId;
  #currentTime;
  #loaded;
  #duration;
  #onPlaying;

  constructor({ currentTime = 0, duration = 10, onPlaying = () => {} }) {
    super()
    this.#currentTime = currentTime
    this.#duration = duration
    this.#onPlaying = onPlaying
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
    debug("Loaded")
    this.#onPlaying()
    this.#loaded = true
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
}
