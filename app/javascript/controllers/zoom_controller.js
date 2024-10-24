import { Controller } from "@hotwired/stimulus";
import { debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "zoomIn", "zoomField", "zoomStart", "zoomEnd", "zoomDuration" ]

  // 1. Set the values
  // 2. Set the controls visible if the section picked is different to the
  // original value
  // This should happen on point selection actually. Point selection will
  // always be different from originl points so we should do it on first point
  // selection
  // Should there be a minimum value to be able to zoom into a section? at least
  // half or a quarter of the whole duration? what %?
  // Perhaps on connect we can set the duration and wait for the other events to
  // set the other values
  //

  ready({duration, start, end}) {
    this.#setDuration(duration)
    this.element.style = ""

    if(start !== null && start !== undefined && end !== null && end !== undefined) {
      this.setPoint(start, end)
    }
  }

  zoomFieldTargetConnected(el) {
    const start = parseFloat(el.querySelector("input[$=start]").value)
    const end = parseFloat(el.querySelector("input[$=end]").value)

    this.dispatch("addZoomLevel", { detail: { start, end } })
  }

  zoomFieldTargetDisconnected(_el) {
    this.dispatch("removeZoomLevel")
  }

  cancel() {
    this.element.style = "display: none"
    this.#clear()
  }

  setPoint(start, end) {
    this.zoomStartTarget.value = start
    this.zoomEndTarget.value = end
  }

  /*
   * The duration of the video to calculate various
   * zoom related translations. To be called via dispatch
   *
   * @param {number} duration - The duration in seconds
   */
  #setDuration(duration) {
    if(this.hasZoomDurationTarget) {
      this.zoomDurationTarget.value = duration
    }
  }

  #clear() {
    document.querySelector('#start').value = ""
    document.querySelector('#end').value = ""
  }
}
