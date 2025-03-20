import { Controller } from "@hotwired/stimulus"
import { debug, wrapInTurboFrame } from "controllers/util"

export default class extends Controller {
  static targets = ["zoomField", "zoomDestroy", "lastZoomField"]

  initialize() {
    debug("init zoom field controller")
  }

  // connect() {
  //   const zoomOutButton = document.querySelector("#zoom-out")
  //   zoomOutButton.addEventListener("click", () => {
  //     debug("zoom out click")
  //     if (this.hasZoomFieldTarget) {
  //       debug("has zoom field")
  //       const nonRemovedTargets = this.zoomFieldTargets.filter(
  //         (t) => t.querySelector("input[name$='[_destroy]']") === null,
  //       )

  //       if (nonRemovedTargets.length > 0) {
  //         const toRemove = nonRemovedTargets.at(-1)
  //         const isPersisted = toRemove.querySelector("input[id$='id']")

  //         if (isPersisted) {
  //           debug("Is persisted")
  //           const nameAttr = toRemove.querySelector("input").name
  //           const index = nameAttr.match(/\[(\d+)\]/)[1]
  //           const destroyInput = this.#buildDestroyInput(index)
  //           toRemove.appendChild(destroyInput)
  //         } else {
  //           toRemove.remove()
  //         }
  //       }
  //     }
  //   })
  // }

  /*
   * We do an early return for targets that are connecting that already exist
   * because this event fires even after first load so we need to not do
   * anything then.
   */
  zoomFieldTargetConnected(el) {
    const toDeleteIdField = document.querySelector("#to_delete_id")

    if (el.dataset.existing === "true") {
      const idInput = el.querySelector("input[id$='id']")
      const id = idInput.name.match(/\[(\d+)\]/)[1]

      debug("the id input", idInput)
      debug("the parsed id", id)

      toDeleteIdField.value = id

      return
    }

    toDeleteIdField.value = ""

    const start = parseFloat(el.querySelector("input[id$='start']").value)
    const end = parseFloat(el.querySelector("input[id$='end']").value)

    debug(`Start: ${start}. End: ${end}`)

    this.dispatch("zoomLevelAdded", { detail: { start, end } })
  }

  /*
   * A zoom-field target is removed from the DOM when it's a non-persisted
   * entry. That means we added the item to be saved on form submit, but decided
   * to remove it now.
   */
  zoomFieldTargetDisconnected() {
    debug("Zoom field target disconnected")
    // We wrap the last field in a turbo frame
    wrapInTurboFrame(this.#lastZoomField(), "last_zoom_field")
    this.dispatch("zoomLevelRemoved")
  }

  /*
   * We also trigger the removal of a zoom events for persisted zoom fields,
   * which means that we react to the destroy hidden input being added to the
   * fields in the form to mark the destruction of the zoom record on submit
   */
  zoomDestroyTargetConnected() {
    debug("zoom destroy connected")
    this.dispatch("zoomLevelRemoved")
  }

  #buildDestroyInput(index) {
    const destroyInput = document.createElement("input")
    destroyInput.type = "hidden"
    destroyInput.name = `section[zoom_attributes][${index}][_destroy]`
    destroyInput.value = "1"
    destroyInput.dataset.zoomFieldTarget = "zoomDestroy"

    return destroyInput
  }

  #lastZoomField() {
    const nonRemovedTargets = this.zoomFieldTargets.filter(
      (t) => t.querySelector("input[name$='[_destroy]']") === null,
    )
    return nonRemovedTargets.at(-1)
  }
}
