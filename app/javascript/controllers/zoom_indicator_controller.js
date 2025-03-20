import { Controller } from "@hotwired/stimulus"
import { debug, wrapInTurboFrame } from "controllers/util"

export default class extends Controller {
  static targets = ["zoomIndicator"]

  zoomIndicatorTargetDisconnected() {
    const lastZoomIndicator = this.zoomIndicatorTargets.at(-1)
    if (lastZoomIndicator)
      wrapInTurboFrame(lastZoomIndicator, "last_zoom_indicator")
  }

  /*
   * Event to be dispatched from other controllers to trigger removal of a zoom
   * indicator, if any.
   */
  removeZoomIndicator() {
    debug("Remove field indicator")
    if (this.hasZoomIndicatorTarget) {
      const toRemove = this.zoomIndicatorTargets.at(-1)
      toRemove.remove()
    }
  }
}
