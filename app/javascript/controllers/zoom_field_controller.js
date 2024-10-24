import { Controller } from "@hotwired/stimulus";
import { debug } from "controllers/util";

export default class extends Controller {
  static targets = [ "zoomField" ]

  initialize() {
    console.log("init zoom field controller")
  }

  connect() {
    const zoomOutButton = document.querySelector("#zoom-out")
    zoomOutButton.addEventListener("click", (_e) => {
      if(this.hasZoomFieldTarget) {
        let nonRemovedTargets = this.zoomFieldTargets.filter(t =>
          t.querySelector("input[name$='[_destroy]']") === null
        )

        if(nonRemovedTargets.length > 0) {
          let toRemove = nonRemovedTargets[nonRemovedTargets.length - 1]
          const isPersisted = toRemove.querySelector("input[id$='id']")

          if(isPersisted !== null) {
            const nameAttr = toRemove.querySelector('input').name
            const index = nameAttr.match(/\[(\d+)\]/)[1]
            const destroyInput = this.#buildDestroyInput(index)
            toRemove.appendChild(destroyInput)
          } else {
            toRemove.remove()
          }
        }
      }
    })
  }

  zoomFieldTargetConnected(el) {
    debug("zoom field connected?")

    const start = parseFloat(el.querySelector("input[id$='start']").value)
    const end = parseFloat(el.querySelector("input[id$='end']").value)

    this.dispatch("addZoomLevel", { detail: { start, end } })
  }

  zoomFieldTargetDisconnected(_el) {
    this.dispatch("removeZoomLevel")
    this.dispatch("removeZoomIndicator")
  }

  #buildDestroyInput(index){
    const destroyInput = document.createElement("input")
    destroyInput.type = "hidden"
    destroyInput.name = `section[zoom_attributes][${index}][_destroy]`
    destroyInput.value = "1"

    return destroyInput
  }
}
