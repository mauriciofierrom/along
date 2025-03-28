import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  static targets = ["zoomIndicator"]

  zoomIndicatorTargetDisconnected() {
    const lastZoomIndicator = this.zoomIndicatorTargets.at(-1)
    debug("last zoom indicator after disconnecting one", lastZoomIndicator)

    if (lastZoomIndicator) lastZoomIndicator.id = "last_zoom_indicator"
  }

  zoomIndicatorTargetConnected(newIndicator) {
    debug("new zoom indicator connected, updating last")
    const penultimateZoomIndicator = this.zoomIndicatorTargets.at(-2)
    if (penultimateZoomIndicator) penultimateZoomIndicator.id = ""
    newIndicator.id = "last_zoom_indicator"
  }
}
