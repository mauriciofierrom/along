import { Controller } from "@hotwired/stimulus";
import { debounce, debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "min", "max" ]
  static outlets = [ "player" ]

  /**
   * @typedef {Object} Zoom
   * @property {number} start - The start of the zoom range
   * @property {number} end - The end of the zoom range
   */
  zoomLevels = [];

  connect() {
    debug("RangeController: connected range controller")
    this.dispatch("connect", { detail: {
      start: parseFloat(this.minTarget.value),
      end: parseFloat(this.maxTarget.value)
    }})

    // TODO: Fetch the initial zoomLevel state
    // WARN: Is there a chance for race conditions? this is rendered at the same
    // time as the form for the section so the form elements should already be
    // there but still, beware
    this.zoomLevels = this.#initZoomLevels()
    debug("zoom levels after init", this.zoomLevels)
  }

  initialize() {
    this.update = debounce(this.update.bind(this), 100)

    // Set initial style for the slider range
    const range = document.querySelector(".range-selected")
    let minRange = parseFloat(this.minTarget.value)
    let maxRange = parseFloat(this.maxTarget.value)
    range.style.left = (minRange / this.minTarget.max) * 100 + "%";
    range.style.right = 100 - (maxRange / this.maxTarget.max) * 100 + "%";
  }

  update(e) {
    const rangeMin = 0
    const range = document.querySelector(".range-selected")
    let minRange = parseFloat(this.minTarget.value)
    let maxRange = parseFloat(this.maxTarget.value)
    var setting = null
    var detail = null

    if (maxRange - minRange < rangeMin) {
      if (e.target.className === "min") {
        this.minTarget.value = maxRange - rangeMin;
      } else {
        this.maxTarget.value = minRange + rangeMin;
      }
    } else {
      range.style.left = (minRange / this.minTarget.max) * 100 + "%";
      range.style.right = 100 - (maxRange / this.maxTarget.max) * 100 + "%";
    }

    if (e.target.className ==="min") {
      setting = parseFloat(this.minTarget.value)
    } else {
      setting = parseFloat(this.maxTarget.value)
    }

    if(this.zoomLevels.length > 0) {
      detail = { ...this.convert(parseFloat(this.minTarget.value), parseFloat(this.maxTarget.value)), setting: setting }
    } else {
      detail = { start: parseFloat(this.minTarget.value), end: parseFloat(this.maxTarget.value), setting: setting }
    }

    debug(`RangeController: dispatch wth ${setting}`)

    // Start the player again
    this.dispatch("update", { detail })
  }

  /*
   * Add a new zoom level to the end of the list
   *
   * @param {Zoom} zoom
   *
   */
  addZoomLevel({detail: zoom}) {
    debug("Range: addZoomLevel")
    this.zoomLevels.push(zoom)
  }

  /*
   * Removal of zoom levels will always be a pop
   *
   * TODO: Unless there's some possible race conditions?
   */
  removeZoomLevel(_) {
    debug("Range: removeZoomLevel")
    this.zoomLevels.pop()
  }

  /*
   *
   * Convert a point from an original range to a sub range
   *
   * @param {number} point - The point in time to convert
   */
  #convertPoint(originalRange, newRange, point) {
    return ((point / originalRange.max) * (newRange.max - newRange.min)) + newRange.min
  }

  #initZoomLevels() {
    const prefix = "section_zoom_attributes"
    const starts =
      Array.from(document.querySelectorAll(`input[id^='${prefix}'][id$='start']`))
        .sort()
        .map((e) => parseFloat(e.value))
    const ends =
      Array.from(document.querySelectorAll(`input[id^='${prefix}'][id$='end']`))
        .sort()
        .map((e) => parseFloat(e.value))
    return starts.map((s, i) => ({ start: s, end: ends[i]}))
  }

  /*
   * Convert a point based on the current zoom range
   *
   * @param {number} start - The start value of the point
   * @param {number} end - The end value of the point
   *
   * @return {Object} - The start/end values converted
   */
  convert(start, end) {
    const zoomLevel = this.zoomLevels[this.zoomLevels.length - 1]
    const originalRange = { min: 0, max: this.duration }
    const newRange = { min: zoomLevel.start, max: zoomLevel.end }

    return {
      start: this.#convertPoint(originalRange, newRange, parseFloat(start)),
      end: this.#convertPoint(originalRange, newRange, parseFloat(end))
    }
  }
}
