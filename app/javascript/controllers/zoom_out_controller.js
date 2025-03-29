import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["start", "end", "id"]
  static outlets = ["zoom"]

  zoomUpdated() {
    this.#updateForm()
  }

  #updateForm() {
    const penultimateZoom = this.zoomOutlet.zoomLevels.at(-2)

    if (penultimateZoom) {
      this.startTarget.value = penultimateZoom.start
      this.endTarget.value = penultimateZoom.end
    } else {
      this.startTarget.value = ""
      this.endTarget.value = ""
      this.idTarget.value = ""
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
