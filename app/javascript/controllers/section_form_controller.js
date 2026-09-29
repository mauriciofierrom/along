import { Controller } from "@hotwired/stimulus"

import { Events as RangeEvents } from "controllers/range_controller"
import { TurboEvent } from "controllers/util"

export default class extends Controller {
  static targets = ["error"]

  #toRestore
  #submissionErrorHandler

  /**
   * Bind the submission error handler once as a stable reference to
   * remove it on disconnect
   */
  initialize() {
    this.#submissionErrorHandler = this.#handleSubmissionError.bind(this)
  }

  /**
   * We attach an event that allows us to react to turbo form submission to
   * check if we need to talk back to the range controller to signal that they
   * should restore the form to before-submission-state
   */
  connect() {
    document.addEventListener(
      TurboEvent.SubmitEnd,
      this.#submissionErrorHandler,
    )
  }

  /*
   * On disconnection we remove the event handler for submission
   *
   */
  disconnect() {
    document.removeEventListener(
      TurboEvent.SubmitEnd,
      this.#submissionErrorHandler,
    )
  }

  /**
   * On submission we tell the RangeController to prepare
   * the form for submission
   */
  submit() {
    this.dispatch(RangeEvents.ConvertFields)
  }

  /**
   * To actually perform the submission we use Turbo and after submission we use
   * the restore object to dispatch to the range controller to make sure that it
   * restore any previous state in case
   */
  submitForm({ detail: { restore } }) {
    this.#toRestore = restore
    window.Turbo.navigator.submitForm(this.element)
  }

  #handleSubmissionError(event) {
    if (event.detail.formSubmission.fromElement !== this.element) return

    if (!event.detail.success && this.#toRestore) {
      this.dispatch(RangeEvents.Restore, {
        detail: { restore: this.#toRestore },
      })
      this.#toRestore = null
    }
  }
}
