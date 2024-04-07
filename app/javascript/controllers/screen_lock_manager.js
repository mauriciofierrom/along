"use strict";

/** A class to encapsulate Screen Lock management */
export default class {

  /** @property {WakeLockSentinel} */
  #wakeLock;

  async acquireScreenLock () {
    console.log("hey")
    if ("wakeLock" in navigator) {
      console.log("wakeLock in navigator")
      try {
        this.#wakeLock = await navigator.wakeLock.request("screen")

        this.#wakeLock.addEventListener("release", () => {
          console.log("wake lock released")
        })

        document.addEventListener("visibilitychange", async () => {
          if (this.#wakeLock !== null && document.visibilityState === "visible") {
            console.log("reacquiring lock")
            this.#wakeLock = await navigator.wakeLock.request("screen");
          }
        });
      } catch (err) {
        console.log(err)
      }
    } else {
      console.log("no wakeLock in navigator")
    }
  }

  releaseLock() {
    if(this.#wakeLock !== null && this.#wakeLock !== undefined) {
      this.#wakeLock.release().then(() => {
        console.log("wake lock released")
      })
    }
  }
}
