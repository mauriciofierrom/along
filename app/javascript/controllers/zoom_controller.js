import { Controller } from "@hotwired/stimulus"
import { debug, show, hide, disable, enable } from "controllers/util"

/** Controller for zoom actions */
export default class extends Controller {
  static targets = ["zoomIn", "zoomOut", "zoomStart", "zoomEnd", "zoomDuration"]

  /**
   * Sets up the initial state when a zoom level exists
   */
  ready({ detail: { duration, currentZoomLevel, isEdit } }) {
    this.#setDuration(duration)

    if (isEdit) {
      show(this.zoomInTarget)
    }

    if (currentZoomLevel > 0) {
      show(this.zoomOutTarget)
    }
  }

  /*
   * Actions when we finish with section edition
   */
  zoomCancelled() {
    debug("cancelled")
    hide(this.zoomInTarget)
    hide(this.zoomOutTarget)
    this.#clear()
  }

  /*
   * Set the current range selection as the potential zoom
   */
  rangeUpdated({ detail: { start, end, max } }) {
    debug("Setting point", start, end)
    this.zoomStartTarget.value = start
    this.zoomEndTarget.value = end

    if (start !== 0 || end !== max) {
      enable(this.zoomInTarget)
      show(this.zoomInTarget)
    }
  }

  /*
   * Event when a zoom level has been added
   *
   * The first time this happens we show the button for zooming out (basically
   * to allow undoing zooming in. We also disable the zoom-in button because
   * when we add a new zoom, we reset the range's values to 0 - duration, thus
   * it would be redundant to zoom-into the already zoomed-into portion of the
   * video.
   */
  zoomLevelAdded({ detail: { zoomLevel } }) {
    debug("zoom level added")
    if (zoomLevel === 1) {
      show(this.zoomOutTarget)
    }
    disable(this.zoomInTarget)
  }

  /*
   * Event when a zoom level has been removed
   *
   * We have a maximum of 3 zoom levels and we have to cover what happens when
   * we zoomed-out of all of them. On section creation we default to the
   * original duration of the video. On section edition we fallback to the
   * original section's value
   */
  zoomLevelRemoved({ detail: { zoomLevel, isEdit } }) {
    debug(`ZoomLevel: ${zoomLevel}. isEdit: ${isEdit}`)
    if (zoomLevel > 0 && zoomLevel < 3) {
      show(this.zoomOutTarget)
    }

    if (zoomLevel === 0) {
      hide(this.zoomOutTarget)
      if (isEdit) {
        show(this.zoomInTarget)
        enable(this.zoomInTarget)
      } else {
        disable(this.zoomInTarget)
      }
    }
  }

  /*
   * The duration of the video to calculate various
   * zoom related translations. To be called via dispatch
   *
   * @param {number} duration - The duration in seconds
   */
  #setDuration(duration) {
    if (this.hasZoomDurationTarget) {
      this.zoomDurationTarget.value = duration
    }
  }

  /*
   * Clear the zoom-in form's values
   */
  #clear() {
    this.zoomStartTarget.value = ""
    this.zoomEndTarget.value = ""
  }
}
