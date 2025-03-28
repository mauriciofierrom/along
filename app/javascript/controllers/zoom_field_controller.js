import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  static targets = ["zoomField"]

  initialize() {
    debug("init zoom field controller")
  }

  /*
   * We do an early return for targets that are connecting that already exist
   * because this event fires even after first load so we need to not do
   * anything then.
   */
  zoomFieldTargetConnected(el) {
    debug("connected field", el)

    if (el.dataset.existing === "true") return

    const start = parseFloat(el.querySelector("input[id$='start']").value)
    const end = parseFloat(el.querySelector("input[id$='end']").value)

    debug(`Start: ${start}. End: ${end}`)

    const penultimateZoomField = this.zoomFieldTargets.at(-2)

    // eslint-disable-next-line no-warning-comments
    // TODO: Check enabling the optional chaining operator in eslint
    if (penultimateZoomField) penultimateZoomField.id = ""
    el.id = "last_zoom_field"

    this.dispatch("zoomLevelAdded", { detail: { start, end } })
  }

  /*
   * A zoom-field target is removed from the DOM when it's a non-persisted
   * entry. That means we added the item to be saved on form submit, but decided
   * to remove it now.
   */
  zoomFieldTargetDisconnected() {
    debug("Zoom field target disconnected")

    const lastZoomField = this.#lastZoomField()

    if (lastZoomField) {
      lastZoomField.id = "last_zoom_field"
    }

    this.dispatch("zoomLevelRemoved")
  }

  #activeZoomFields() {
    return this.zoomFieldTargets.filter(
      (t) => t.querySelector("input[name$='[_destroy]']") === null,
    )
  }

  #lastZoomField() {
    return this.#activeZoomFields().at(-1)
  }
}
