import Zoom, { NoZoom } from "controllers/zoom/zoom"

export default class ZoomManager {
  zoomLevels = []
  #duration

  constructor(zoomLevels, duration) {
    this.zoomLevels = zoomLevels
    this.#duration = duration
  }

  zoomIn(start, end) {
    this.zoomLevels.push(new Zoom(start, end, this.#duration))
  }

  zoomOut() {
    this.zoomLevels.pop()
  }

  get activeZoom() {
    if (this.isZoomed) {
      return this.zoomLevels[this.zoomLevels.length - 1]
    } else {
      return new NoZoom()
    }
  }

  get zoomLevel() {
    return this.zoomLevels.length
  }

  get isZoomed() {
    return this.zoomLevel > 0
  }
}
