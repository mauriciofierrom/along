import { debug } from "controllers/util"
import { PlaybackError, PlaybackErrorType } from "controllers/player/error"

/** Class driving the execution of a playback loop */
export default class LoopManager {
  /** @property {YoutubePlayer} */
  #player
  /** @property {number} intervalId - The id to clear the interval */
  #intervalId
  /** @property {number} times - The number of times the loop has repeated */
  #times = 1
  /** @property {boolean} aborted - Whether the loop has been canceled or not */
  #aborted = false
  /** @property {AbortController} abortController - A controller to abort the
   * promise that wraps the interval that drives the loop repetition */
  #abortController
  #element

  /**
   * Create a loop manager
   *
   * @param {YoutubePlayer} player - The player wrapper object to loop with
   */
  constructor(player, element) {
    this.#player = player
    this.#element = element
  }

  #canLoop() {
    return this.#player.canPlay()
  }

  /**
   * Play the video by looping between the points with an action to perform on
   * each loop and an exit condition predicate. In this case, the promise
   * resolves normally.
   *
   * We also rely on an AbortController to interrupt regular playback. In this
   * case, the promise rejects with a PlaybackError.
   *
   *
   * @param {!number} from - The starting point of the loop
   * @param {!number} to - The end point of the loop
   * @param {Function} [onLoop] - A callback to execute on each loop
   * @param {Function} [exitCondition] - A predicate to exit regular playback
   */
  async #play(from, to, onLoop, exitCondition = () => false) {
    await this.#canLoop()

    // We need to stop any previous loop before we start a new one
    this.clear()

    this.#player.play(from)

    this.#abortController = new AbortController()
    const signal = this.#abortController.signal

    return new Promise((resolve, reject) => {
      signal.addEventListener("abort", () => {
        if (this.#aborted) {
          return
        }

        this.#aborted = true
        clearInterval(this.#intervalId)
        reject(new PlaybackError(PlaybackErrorType.LoopClear, signal.reason))
      })

      this.#intervalId = setInterval(() => {
        if (this.#player.currentTime >= to) {
          if (exitCondition()) {
            this.#times = 1
            clearInterval(this.#intervalId)
            resolve()
            return
          }

          this.#player.play(from)

          onLoop?.()
        }

        this.#element.dispatch("reportProgress", {
          detail: { from, end: this.#player.currentTime },
        })
      }, 200)
    })
  }

  /**
   * Loop the player from the given points
   *
   * @param {!number} from - The starting point of the loop
   * @param {!number} to - The end point of the loop
   */
  loop(from, to) {
    return this.#play(from, to)
  }

  /**
   * Play the loop between the given points the provided number of times
   *
   * @param {!number} from - The starting point of the loop
   * @param {!number} to - The end point of the loop
   * @param {!number} times - The number of times to loop
   */
  playTimes(from, to, times) {
    return this.#play(
      from,
      to,
      () => this.#times++,
      () => this.#times >= times,
    )
  }

  /**
   * Stops the loop
   *
   * If there's a loop active we use the abort controller to stop it.
   */
  clear() {
    debug("Clearing loop: ", {
      invervalId: this.#intervalId,
      times: this.#times,
    })
    this.#times = 1
    if (this.#intervalId) {
      if (this.#abortController && !this.#abortController.signal.aborted) {
        debug("Aborting")
        this.#abortController.abort("Cancelled manually")
      } else {
        debug("Already aborted")
      }
      this.#intervalId = null
      this.#aborted = false
    } else {
      debug("No interval")
    }
  }

  /*
   * Returns a tuple of start and end values to loop based on the value we're
   * setting for looping when updating a point. If it's the starting point we
   * loop from it to 3 seconds from it. If it's the end point we do it 3 seconds
   * before it or zero if there's not enough time before
   *
   * @summary Return a two-tuple of start and end values to loop when setting a
   * point of a section
   *
   * @param {!number} start - The start point of the section
   * @param {!number} end - The end point of the section
   * @param {?number} setting - The value being set (either start or end)
   * @returns {number[]} 2-Tuple [start,end]
   */
  static settingRange(start, end, setting) {
    let finalEnd
    let finalStart

    switch (setting) {
      case start:
        finalStart = start
        finalEnd = start + 3
        break
      case end:
        finalEnd = end
        finalStart = Math.max(end - 3, 0)

        if (finalStart < start) {
          finalStart = start
        }
        break
      default:
        finalStart = start
        finalEnd = end
    }

    return [finalStart, finalEnd]
  }
}
