import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["error"]

  #toRestore

  /**
   * We attach an event that allows us to react to turbo form submission to
   * check if we need to talk back to the range controller to signal that they
   * should restore the form to before-submission-state
   */
  connect() {
    document.addEventListener(
      "turbo:submit-end",
      this.#handleSubmissionError.bind(this),
    )
  }

  /*
   * On disconnection we remove the event handler for submission
   *
   */
  disconnect() {
    document.removeEventListener(
      "turbo:submit-end",
      this.#handleSubmissionError.bind(this),
    )
  }

  /**
   * On submission we tell the RangeController to prepare
   * the form for submission
   */
  submit() {
    this.dispatch("convertFields")
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

  /**
   * Once an error target (an element that is the next sibling to input
   * elements) is connected we set a custom validity for it and make the form
   * report the validity to show the related validation message
   */
  errorTargetConnected(el) {
    const input = el.previousElementSibling
    const errorMessage = el.dataset.message

    input.classList.add("invalid")
    input.setCustomValidity(errorMessage)
    this.element.reportValidity()
  }

  errorTargetDisconnected(el) {
    const input = el.previousElementSibling
    input.classList.remove("invalid")
    input.setCustomValidity("")
  }

  #handleSubmissionError(event) {
    if (!event.detail.formSubmission.fromElement === this.element) return

    if (!event.detail.success && this.#toRestore) {
      this.dispatch("restoreRange", { detail: { restore: this.#toRestore } })
      this.#toRestore = null
    }
  }
}
