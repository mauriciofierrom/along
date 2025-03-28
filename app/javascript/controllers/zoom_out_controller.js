import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  static targets = ["start", "end", "id"]
  static outlets = ["zoom"]

  zoomUpdated() {
    this.#updateForm()
  }

  #updateForm() {
    const penultimateZoom = this.zoomOutlet.zoomLevels.at(-2)

    debug("penultimate", penultimateZoom)
    debug("active zoo", this.zooOutlet.activeZoom)

    if (penultimateZoom) {
      this.startTarget.value = penultimateZoom.start
      this.endTarget.value = penultimateZoom.end
    } else {
      this.startTarget.value = ""
      this.endTarget.value = ""
      this.IdTarget.value = ""
    }

    if (this.zoomOutlet.isZoomed) {
      this.idTarget.value = this.zoomOutlet.activeZoom.id
    } else {
      this.idTarget.value = ""
    }
  }

  zoomsLoaded() {
    this.#updateForm()
  }
}
