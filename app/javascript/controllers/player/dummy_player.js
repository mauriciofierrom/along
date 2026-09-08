/* eslint-disable no-empty-function, no-unused-vars */
import Player, { PlayerRestriction } from "controllers/player/player"
import { debug, randomBetween } from "controllers/util"
import { PlaybackErrorType, PlaybackError } from "controllers/player/error"

const SimulatedError = {
  Load: "load",
  Init: "init",
}

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

  #simulateError(error) {
    switch (error) {
      case SimulatedError.Load:
        this.#onLoadError()
        throw new Error("Load error details")
      case SimulatedError.Init:
        throw new Error("Init error details")
    }
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
    if (window.is_cypress === "true") {
      setTimeout(() => {
        this.#onPlaying()
        this.#currentTime = from
        this.pause()
        this.#intervalId = setInterval(() => {
          this.#currentTime += 1
        }, 1000)
      }, 1000)
    } else {
      this.#currentTime = Infinity
    }
  }

  pause() {
    clearInterval(this.#intervalId)
  }

  canPlay() {
    const playerElement = document.querySelector("#player")

    if (playerElement?.dataset.restriction) {
      return Promise.reject(
        new PlaybackError(
          PlaybackErrorType.PlayerRestriction,
          "Player restriction",
          {
            restriction: PlayerRestriction.UserActionRequired,
          },
        ),
      )
    } else {
      return Promise.resolve()
    }
  }

  setPlaybackSpeed() {}

  static create(params) {
    return new Promise((resolve) => {
      const simulateLoad = window.localStorage.getItem("simulateLoad")

      if (simulateLoad) {
        setTimeout(() => {
          resolve(new this(params))
        }, 1000)
      } else {
        const error = window.sessionStorage.getItem("simulateError")
        if (error) throw new Error("Init error details")
        resolve(new this(params))
      }
    })
  }

  dispose() {
    clearInterval(this.#intervalId)
  }
}
