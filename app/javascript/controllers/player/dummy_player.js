/* eslint-disable no-empty-function, no-unused-vars */
import Player from "controllers/player/player"
import { debug, randomBetween } from "controllers/util"

/** Dummy Player to use in tests */
export default class extends Player {
  #intervalId
  #currentTime
  #loaded
  #duration
  #onPlaying
  #onLoadError

  constructor({
    currentTime = 0,
    duration = randomBetween(300, 600),
    onPlaying = () => {},
    onLoadError = () => {},
  }) {
    super()

    debug("dummy player is created")

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

    if (playerElement.dataset.error) {
      this.#simulateError(playerElement.dataset.error)
    } else {
      this.#onPlaying()
      this.#loaded = true
    }
  }

  play(from) {
    setTimeout(() => {
      this.#onPlaying()
      this.#currentTime = from
      this.pause()
      this.#intervalId = setInterval(() => {
        this.#currentTime += 1
      }, 1000)
    }, 1000)
  }

  pause() {
    clearInterval(this.#intervalId)
  }

  canPlay(_from) {
    debug("Can the dummy play?")

    const playerElement = document.querySelector("#player")

    if (playerElement.dataset.restriction) {
      return Promise.reject(playerElement.dataset.restrictionMessage)
    } else {
      return Promise.resolve()
    }
  }

  static create(params) {
    return new Promise((resolve) => {
      const simulateLoad = window.localStorage.getItem("simulateLoad")

      if (simulateLoad) {
        setTimeout(() => {
          resolve(new this(params))
        }, 1000)
      } else {
        resolve(new this(params))
      }
    })
  }

  #simulateError(error) {
    switch (error) {
      case "load":
        this.#onLoadError()
        break
    }
  }
}
