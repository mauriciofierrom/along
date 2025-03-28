import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  static targets = ["start", "end"]
  static outlets = ["zoom"]

  /*
   * Set the current range selection as the potential zoom
   */
  rangeInputUpdated({ detail: { start, end } }) {
    this.startTarget.value = start
    this.endTarget.value = end
  }

  /*
   * Set the current range selection as the potential zoom on initial range
   * input load
   */
  rangeInputReady({ detail: { start, end } }) {
    debug("range input ready with", { start, end })
    this.startTarget.value = start
    this.endTarget.value = end
  }

  zoomCancelled() {
    this.#clear()
  }

  /*
   * Clear the zoom-in form's values
   */
  #clear() {
    this.startTarget.value = ""
    this.endTarget.value = ""
  }
}
