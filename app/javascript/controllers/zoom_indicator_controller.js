import { Controller } from "@hotwired/stimulus";
import { debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "zoomIndicator" ]

  /*
   * Event to be dispatched from other controllers to trigger removal of a zoom
   * indicator, if any.
   */
  removeZoomIndicator(_) {
    debug("Remove field indicator")
    if(this.hasZoomIndicatorTarget) {
      let toRemove = this.zoomIndicatorTargets[this.zoomIndicatorTargets.length - 1]
      toRemove.remove()
    }
  }
}
