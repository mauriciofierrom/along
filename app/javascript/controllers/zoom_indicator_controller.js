import { Controller } from "@hotwired/stimulus";
import { debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "zoomIndicator" ]

  connect() {
    debug("ZoomIndicator: connect")
  }

  removeZoomIndicator(_) {
    debug("ZoomIndicator: Remove field indicator")
    if(this.hasZoomIndicatorTarget) {
      let toRemove = this.zoomIndicatorTargets[this.zoomIndicatorTargets.length - 1]
      debug("To remove", toRemove)
      toRemove.remove()
    }
  }
}
