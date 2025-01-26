import { debug } from "controllers/util"

export default class Zoom {
  start
  end
  duration

  constructor(start, end, duration) {
    this.start = start
    this.end = end
    this.duration = duration
  }

  /*
   *
   * Convert a point ina sub range to the full range
   *
   * @param {number} point - The point in time to convert
   */
  convertPoint(point) {
    // eslint-disable-next-line no-implicit-coercion
    return +(
      (point / this.duration) * (this.end - this.start) +
      this.start
    ).toFixed(2)
  }

  /*
   * Restore a point from a sub range to the full range
   *
   * @param {number} point - The point in time to restore
   */
  restorePoint(point) {
    // eslint-disable-next-line no-implicit-coercion
    return +(
      ((point - this.start) * this.duration) /
      (this.end - this.start)
    ).toFixed(2)
  }

  /*
   * Convert a point based on the current zoom range
   *
   * @param {number} start - The start value of the point
   * @param {number} end - The end value of the point
   * @param {number} duration - The duration of the video
   *
   * @return {Object} - The start/end values converted
   */
  convert(start, end) {
    return {
      // eslint-disable-next-line no-implicit-coercion
      start: +this.convertPoint(start).toFixed(2),
      // eslint-disable-next-line no-implicit-coercion
      end: +this.convertPoint(end).toFixed(2),
    }
  }

  // INFO: This unary plus operator hack is fun and we don't really need
  // precision here. I don't know how performant it is but when we need it
  // we can easily add a function to do the actual rounding of positive numbers
  // to the utils module and use it here (and in convert).
  restore(start, end) {
    debug(`Start: ${start}, Converted start: ${this.restorePoint(start)}`)
    debug(`End: ${end}, Converted end: ${this.restorePoint(end)}`)
    return {
      // eslint-disable-next-line no-implicit-coercion
      start: +this.restorePoint(start).toFixed(2),
      // eslint-disable-next-line no-implicit-coercion
      end: +this.restorePoint(end).toFixed(2),
    }
  }

  get isZoomed() {
    return true
  }
}

/*
 * Enum for zoom values.
 *
 * @readonly
 * @enum {string}
 */
export const ZoomType = {
  /** We're working at a zoomed-in level (there are zoom*/
  In: "zoom-in",
  /** There are no zooms in play */
  Out: "zoom-out",
}

export class NoZoom extends Zoom {
  restore(start, end) {
    return { start, end }
  }

  convert(start, end) {
    return { start, end }
  }

  convertPoint(point) {
    return point
  }

  restorePoint(point) {
    return point
  }

  get isZoomed() {
    return false
  }
}
