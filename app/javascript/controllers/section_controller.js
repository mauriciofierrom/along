import { Controller } from "@hotwired/stimulus";
import ScreenLockManager from "controllers/screen_lock_manager"

export default class extends Controller {
  #screenLockManager;

  initialize () {
    debug("initialize section controller")
    this.#screenLockManager = new ScreenLockManager()
  }
  connect() {
    debug("connected section controller")
    debug(`Section load start: ${this.element.dataset.start}`)
    debug(`Section load end: ${this.element.dataset.end}`)
    const start = parseFloat(this.element.dataset.start)
    const end = parseFloat(this.element.dataset.end)

    this.dispatch("connect", { detail: {start: start, end: end}})
    this.#screenLockManager.acquireScreenLock()
  }

  disconnect() {
    debug("section controller disconnect")
    this.dispatch("disconnect")
    this.#screenLockManager.releaseLock()
  }
}
