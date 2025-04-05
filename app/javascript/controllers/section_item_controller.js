import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

/**
 * Controller for Section Items
 *
 * - Drag and drop
 *
 *   Every Section item is both a draggable element and a drop zone, which
 *   allows us to swap them in place
 */
export default class extends Controller {
  /**
   * The handler for the section item's dragstart event
   *
   * We set the data to the section id of the section item being dragged to be
   * able to fetch it later in the drop event of the receiving section item by
   * using the element's dataset
   */
  dragStart(event) {
    debug("starting?")
    event.dataTransfer.setData(
      "application/section-id",
      event.target.dataset.sectionId,
    )
    event.dataTransfer.dropEffect = "move"
  }

  /**
   * The handler for the section item's `drop` event
   *
   * We retrieve the dragged item Section's id from the data set in `dragstart`
   * and the dropped-into item Section's id from the event's current target and
   * use both ids as payload to an endpoint to perform the swap of the orders.
   *
   * If it succeeds, both elements are swaped in place visually as well.
   */
  onDrop(event) {
    debug("dropped?", event.target)
    const draggedSectionItemId = parseInt(
      event.dataTransfer.getData("application/section-id"),
      10,
    )
    const droppedSectionItemId = parseInt(
      event.currentTarget.dataset.sectionId,
      10,
    )

    const droppedElement = event.currentTarget

    fetch(`/section/swap_order/`, {
      method: "POST",
      body: JSON.stringify({
        swap_params: {
          dragged_id: draggedSectionItemId,
          dropped_id: droppedSectionItemId,
        },
      }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": document.querySelector('meta[name="csrf-token"]')
          .content,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("It failed. What a drag!")
        const draggedElement = document.querySelector(
          `[data-section-id="${draggedSectionItemId}"]`,
        )
        this.#swap(draggedElement, droppedElement)
      })
      .catch((error) => console.error(error))
  }

  onDragOver(event) {
    debug("dragged over?", event.target)
  }

  onDragEnd() {
    debug("finished?")
  }

  #swap(sectionItem, otherSectionItem) {
    const firstSection = sectionItem.parentNode
    const secondSection = otherSectionItem.parentNode

    const parent = firstSection.parentNode
    const next = firstSection.nextSibling
    const otherNext = secondSection.nextSibling

    parent.insertBefore(firstSection, otherNext)
    parent.insertBefore(secondSection, next)
  }
}
