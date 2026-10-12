import { Controller } from "@hotwired/stimulus"

import ScreenLockManager from "controllers/screen_lock_manager"
import {
  Animations,
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

  static targets = ["screenLockIndicator"]

  #screenLockManager

  #onScreenLockAcquisition() {
    if (!this.hasScreenLockIndicatorTarget) return
    debug("acquisition")

    this.screenLockIndicatorTarget.classList.remove("fa-unlock")
    this.screenLockIndicatorTarget.classList.add("fa-lock")
  }

  #onScreenLockRelease() {
    if (!this.hasScreenLockIndicatorTarget) return
    debug("release")

    this.screenLockIndicatorTarget.classList.remove("fa-lock")
    this.screenLockIndicatorTarget.classList.add("fa-unlock")
  }

  initialize() {
    debug("initialize section controller")
    this.#screenLockManager = new ScreenLockManager(
      this.#onScreenLockAcquisition.bind(this),
      this.#onScreenLockRelease.bind(this),
    )
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
      this.element.classList.remove(Animations.FlipInX)
      this.element.classList.add(Animations.FlipOutX)
    })
  }
}
