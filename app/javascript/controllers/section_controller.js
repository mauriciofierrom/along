import { Controller } from "@hotwired/stimulus"
import ScreenLockManager from "controllers/screen_lock_manager"
import { debug } from "controllers/util"

export default class extends Controller {
  static values = {
    start: Number,
    end: Number,
    loop: Boolean,
    speed: Number,
  }

  #screenLockManager

  initialize() {
    debug("initialize section controller")
    this.#screenLockManager = new ScreenLockManager()
  }

  connect() {
    debug("connected section controller")

    this.dispatch("connect", {
      detail: {
        start: this.startValue,
        end: this.endValue,
        speed: this.speedValue,
      },
    })

    this.#screenLockManager.acquireScreenLock()
  }

  disconnect() {
    debug("section controller disconnect")
    this.dispatch("disconnect")
    this.#screenLockManager.releaseLock()
  }
}
