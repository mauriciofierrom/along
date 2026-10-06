import { Controller } from "@hotwired/stimulus"

import ScreenLockManager from "controllers/screen_lock_manager"
import {
  debug,
  onTurboCancel,
  isLessonTarget,
  SECTIONS_ID,
} from "controllers/util"

export const Events = Object.freeze({
  Connected: "connect",
  Cancelled: "cancelled",
})

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

    this.dispatch(Events.Connected, {
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
    this.#screenLockManager.releaseScreenLock()
  }

  onCancel(event) {
    const isCancel =
      event.target.id === SECTIONS_ID &&
      isLessonTarget(event.detail.url.pathname)

    onTurboCancel(event, this.element, isCancel, () => {
      this.dispatch(Events.Cancelled)
      this.element.classList.remove("flip-in-x")
      this.element.classList.add("flip-out-x")
    })
  }
}
