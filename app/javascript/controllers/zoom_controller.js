import { Controller } from "@hotwired/stimulus"
import { debug, show, hide, disable, enable } from "controllers/util"
import ZoomManager from "controllers/zoom/zoom_manager"
import Zoom from "controllers/zoom/zoom"

/** Controller for zoom actions */
export default class extends Controller {
  static targets = ["zoomIn", "zoomOut", "zoomStart", "zoomEnd", "zoomDuration"]

  static values = {
    duration: Number,
  }

  #zoomManager

  /**
   * @typedef {Object} Zoom
   * @property {number} start - The start of the zoom range
   * @property {number} end - The end of the zoom range
   */

  initialize() {
    debug(`Duration: ${this.durationValue}`)
    this.#zoomManager = new ZoomManager([], this.durationValue)
  }

  updateZoomState() {
    debug("updated the zoom state")
    const zoomLevels = this.#initZoomLevels()
    debug("zoomLevels", zoomLevels)
    this.#zoomManager.zoomLevels = zoomLevels
    this.dispatch("zoomsLoaded")
  }

  /**
   * Sets up the initial state when a zoom level exists
   */
  rangeInputReady({ detail: { isEdit } }) {
    if (isEdit) {
      show(this.zoomInTarget)
    }

    if (this.isZoomed) {
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
  }

  /*
   * Set the current range selection as the potential zoom
   */
  rangeInputUpdated({ detail: { start, end } }) {
    let actualStart
    let actualEnd

    if (this.isZoomed) {
      const restored = this.activeZoom.restore(start, end)

      actualStart = restored.start
      actualEnd = restored.end
    } else {
      actualStart = start
      actualEnd = end
    }

    if (actualStart !== 0 || actualEnd !== this.durationValue) {
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
  zoomLevelAdded({ detail: { start, end } }) {
    this.#zoomManager.zoomIn(start, end)

    if (this.#zoomManager.zoomLevel === 1) {
      show(this.zoomOutTarget)
    }

    disable(this.zoomInTarget)

    // Dispatch the active zoom to the range controller
    this.dispatch("zoomUpdated", {
      detail: {
        zoom: this.#zoomManager.activeZoom,
      },
    })
  }

  /*
   * Event when a zoom level has been removed
   *
   * We have a maximum of 3 zoom levels and we have to cover what happens when
   * we zoomed-out of all of them. On section creation we default to the
   * original duration of the video. On section edition we fallback to the
   * original section's value
   */
  zoomLevelRemoved() {
    this.#zoomManager.zoomOut()

    if (this.isZoomed) {
      show(this.zoomOutTarget)
      hide(this.zoomInTarget)
    } else {
      hide(this.zoomOutTarget)
      hide(this.zoomInTarget)
    }

    this.dispatch("zoomUpdated", {
      detail: { zoom: this.#zoomManager.activeZoom },
    })
  }

  get isZoomed() {
    return this.#zoomManager.isZoomed
  }

  get activeZoom() {
    return this.#zoomManager.activeZoom
  }

  get zoomLevels() {
    return this.#zoomManager.zoomLevels
  }

  #initZoomLevels() {
    const prefix = "section_zoom_attributes"

    const starts = Array.from(
      document.querySelectorAll(`input[id^='${prefix}'][id$='start']`),
    )
      .sort()
      .map((element) => parseFloat(element.value))

    const ends = Array.from(
      document.querySelectorAll(`input[id^='${prefix}'][id$='end']`),
    )
      .sort()
      .map((element) => parseFloat(element.value))

    const ids = Array.from(
      document.querySelectorAll(`input[id^='${prefix}'][id$='id']`),
    )
      .sort()
      .map((element) => parseInt(element.value, 10))

    return starts.map(
      (start, i) => new Zoom(start, ends[i], this.durationValue, ids[i]),
    )
  }
}
