/** Class driving the execution of a playback loop */
export default class LoopManager {
  /** @property {YoutubePlayer} */
  #player;
  /** @property {number} intervalId - The id to clear the interval */
  #intervalId;
  /** @property {number} times - The number of times the lopo has repeated */
  #times = 1;
  /** @property {boolean} aborted - Whether the loop has been canceled or not */
  #aborted = false;
  /** @property {AbortController} abortController - A controller to abort the
   * promise that wraps the interval that drives the loop repetition */
  #abortController;

  /**
   * Create a loop manager
   *
   * @param {YoutubePlayer} player - The player wrapper object to loop with
   */
  constructor(player) {
    this.#player = player
  }

  /**
   * Loop the player from the given points an optional maximum number of times.
   *
   * We wrap the interval in a promise that will resolve only in the case the
   * max parameter has a value, otherwise we rely on the AbortController to stop
   * it when via the clear method.
   *
   * @param {!number} from - The starting point of the loop
   * @param {!number} to - The end point of the loop
   * @param {?number} max - An optional maximum number of repetitions for the
   * loop
   */
  loop(from, to, max = null) {
    // We need to stop any previous loop before we start a new one
    this.clear()

    this.#player.play(from)

    this.#abortController = new AbortController()
    const signal = this.#abortController.signal

    return new Promise ((resolve, reject) => {
      this.#intervalId = setInterval(() => {

        if (this.#player.currentTime >= to) {
          this.#player.play(from)

          if(max !== null && max !== undefined) {
            this.#times++
          }
        }

        signal.addEventListener("abort", () => {
          if(!this.#aborted) {
            this.#aborted = true
            clearInterval(this.#intervalId)
            reject(signal.reason)
          }
        })

        if(max !== null && max !== undefined && this.#times > max) {
          this.#times = 1
          clearInterval(this.#intervalId)
          resolve()
        }
      }, 500)
    })
  }

  /**
   * Stops the loop
   *
   * If there's a loop active we use the abort controller to stop it.
   */
  clear() {
    if(this.#intervalId !== null && this.#intervalId !== undefined) {
      // this.#player.pause()
      this.#times = 1
      if(this.#abortController && !this.#abortController.signal.aborted) {
        this.#abortController.abort("LoopManager: Cancelled manually")
      }

      this.#intervalId = null
    } else {
      console.log("LoopManager: Tried to clear a non-existing loop")
    }
  }
}