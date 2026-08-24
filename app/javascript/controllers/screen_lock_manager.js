import { debug } from "controllers/util"

/** A class to encapsulate Screen Lock management */
export default class {
  /** @property {WakeLockSentinel} */
  #wakeLock

  /*
   * Handler for the visibility change handler
   *
   */
  #visibilityChangeHandler = async () => {
    if (this.#wakeLock && document.visibilityState !== "visible") return

    this.#wakeLock = await navigator.wakeLock.request("screen")
  }

  async acquireScreenLock() {
    if ("wakeLock" in navigator) {
      debug("wakeLock in navigator")
      try {
        this.#wakeLock = await navigator.wakeLock.request("screen")

        this.#wakeLock.addEventListener("release", () => {
          debug("wake lock released")
        })

        document.addEventListener(
          "visibilitychange",
          this.#visibilityChangeHandler,
        )
      } catch (err) {
        console.error(err)
      }
    } else {
      debug("no wakeLock in navigator")
    }
  }

  releaseLock() {
    if (!this.#wakeLock) return

    this.#wakeLock
      .release()
      .then(() => {
        debug("wake lock released")
      })
      .finally(() => {
        document.removeEventListener(
          "visibilitychange",
          this.#visibilityChangeHandler,
        )
      })
      .catch((error) => console.error("Wake Lock failed to release", error))
  }
}
