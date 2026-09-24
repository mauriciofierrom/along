import { debug } from "controllers/util"

/** A class to encapsulate Screen Lock management */
export default class {
  /** @property {WakeLockSentinel} */
  #wakeLock

  /** @property {Promise<WakeLockSentinel} */
  #wakeLockRequest

  /** @property  {Promise} */
  #wakeLockRelease

  /** @property {AbortController} */
  #abortController

  /**
   * Handler for the visibility change handler
   */
  #visibilityChangeHandler = async () => {
    if (
      (this.#wakeLock && !this.#wakeLock.released) ||
      document.visibilityState !== "visible"
    )
      return

    debug("Visibility restored. Re-acquiring lock.")
    await this.acquireScreenLock()
  }

  get #pendingLock() {
    return !this.#wakeLock && this.#wakeLockRequest
  }

  get #lockAcquired() {
    return this.#wakeLock?.released === false
  }

  releaseScreenLock() {
    this.#abortController?.abort()
    document.removeEventListener(
      "visibilitychange",
      this.#visibilityChangeHandler,
    )

    if (this.#wakeLockRelease) return this.#wakeLockRelease
    if (!this.#wakeLockRequest) return Promise.resolve()

    this.#wakeLockRelease = new Promise((resolve, reject) => {
      const lockRequest = this.#wakeLockRequest

      lockRequest
        ?.then((wakeLock) => wakeLock.release())
        .finally(() => {
          this.#wakeLockRequest = null
          this.#wakeLockRelease = null
          this.#wakeLock = null
        })
        .catch((err) => console.error(err))
        .then(resolve, reject)
    })

    return this.#wakeLockRelease
  }

  async acquireScreenLock() {
    if (!this.#abortController || this.#abortController.signal.aborted) {
      this.#abortController = new AbortController()
    }
    const signal = this.#abortController.signal
    if (!("wakeLock" in navigator)) throw new Error("No wake lock support")
    if (this.#wakeLockRelease) {
      await this.#wakeLockRelease
      if (signal.aborted) return
    }
    if (this.#lockAcquired || this.#pendingLock) return

    try {
      this.#wakeLockRequest = navigator.wakeLock.request("screen")
      document.addEventListener(
        "visibilitychange",
        this.#visibilityChangeHandler,
      )
      const wakeLock = await this.#wakeLockRequest
      if (signal.aborted) return
      this.#wakeLock = wakeLock
      this.#wakeLock.addEventListener(
        "release",
        () => {
          this.#wakeLock = null
          this.#wakeLockRequest = null
          debug("wake lock released")
        },
        { once: true },
      )
      debug("wakeLock acquired")
    } catch (err) {
      this.#wakeLockRequest = null
      console.error(err)
    }

    debug("wakeLock in navigator")
  }
}
