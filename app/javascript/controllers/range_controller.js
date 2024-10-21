import { Controller } from "@hotwired/stimulus";
import { debounce, debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "min", "max" ]
  static outlets = [ "player" ]

  zoomLevels = [];

  connect() {
    debug("RangeController: connected range controller")
    this.dispatch("connect", { detail: {
      start: parseFloat(this.minTarget.value),
      end: parseFloat(this.maxTarget.value)
    }})
    // TODO: Set the duration in the zoom form
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

    const detail = { start: parseFloat(this.minTarget.value), end: parseFloat(this.maxTarget.value), setting: setting }
    debug(`RangeController: dispatch wth ${setting}`)

    // Start the player again
    this.dispatch("update", { detail })

    // TODO: Update the zoom level values
  }

  addZoomLevel(zoom) {
    zoomLevels.push(zoom)
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

  #convert(start, end) {
  }
}
