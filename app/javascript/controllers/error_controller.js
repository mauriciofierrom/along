import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  static targets = ["error"]

  connect() {
    debug("error controller connected")
  }

  /**
   * Once an error target (an element that is the next sibling to input
   * elements) is connected we set a custom validity for it and make the form
   * report the validity to show the related validation message
   */
  errorTargetConnected(el) {
    debug("connected", el)
    const input = el.previousElementSibling
    const errorMessage = el.dataset.message

    input.classList.add("invalid")
    input.setCustomValidity(errorMessage)
    this.element.reportValidity()
  }

  /**
   * Once the error target is disconnected we restore the validity
   */
  errorTargetDisconnected(el) {
    debug("disconnected", el)
    const input = el.previousElementSibling
    input.classList.remove("invalid")
    input.setCustomValidity("")
  }
}
