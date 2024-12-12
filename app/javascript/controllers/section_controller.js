import { Controller } from "@hotwired/stimulus"
import ScreenLockManager from "controllers/screen_lock_manager"
import { debug } from "controllers/util"

export default class extends Controller {
  #screenLockManager

  initialize() {
    debug("initialize section controller")
    this.#screenLockManager = new ScreenLockManager()
  }

  connect() {
    debug("connected section controller")
    const start = parseFloat(this.element.dataset.start)
    const end = parseFloat(this.element.dataset.end)

    this.dispatch("connect", { detail: { start, end } })
    this.#screenLockManager.acquireScreenLock()
  }

  disconnect() {
    debug("section controller disconnect")
    this.dispatch("disconnect")
    this.#screenLockManager.releaseLock()
  }
}
