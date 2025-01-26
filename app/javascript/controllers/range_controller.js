import { Controller } from "@hotwired/stimulus"
import { debounce, debug } from "controllers/util"
import { ZoomType } from "controllers/zoom/zoom"

export default class extends Controller {
  static targets = ["min", "max", "slider"]
  static outlets = ["zoom"]
  static values = {
    minDefault: Number,
    maxDefault: Number,
  }

  #activeZoom
  #duration

  connect() {
    debug("setting styles")
    // Set initial style for the slider range
    const minRange = parseFloat(this.minTarget.value)
    const maxRange = parseFloat(this.maxTarget.value)

    this.#setSliderStyles(minRange, maxRange)
  }

  initialize() {
    this.update = debounce(this.update.bind(this), 100)
    this.zoomOutlet.updateZoomState()
    this.#activeZoom = this.zoomOutlet.activeZoom
    this.#duration = parseFloat(this.maxTarget.max)

    const start = parseFloat(this.minTarget.value)
    const end = parseFloat(this.maxTarget.value)

    const isEdit = this.hasMinDefaultValue && this.hasMaxDefaultValue

    debug("active zoom", this.#activeZoom)

    // INFO: Initial connection requires loading the correct zoom value if any
    if (this.#isZoomed()) {
      debug(`we're zoomed-in ${isEdit}. Start: ${start}. End: ${end}`)
      debug("active zoom", this.#activeZoom)
      const restored = this.#activeZoom.restore(start, end)
      debug("restore", restored)

      this.minTarget.value = restored.start
      this.maxTarget.value = restored.end

      debug(`The restored values: ${restored.start}-${restored.end}`)

      this.#setSliderStyles(restored.start, restored.end)
    }

    // Let the zoom controller know the range input is ready
    this.dispatch("rangeInputReady", {
      detail: {
        isEdit: this.hasMinDefaultValue && this.hasMaxDefaultValue,
        start,
        end,
      },
    })
  }

  update(event) {
    const rangeMin = 0
    const minRange = parseFloat(this.minTarget.value)
    const maxRange = parseFloat(this.maxTarget.value)

    if (maxRange - minRange < rangeMin) {
      if (event.target.className === "min") {
        this.minTarget.value = maxRange - rangeMin
      } else {
        this.maxTarget.value = minRange + rangeMin
      }
    } else {
      this.#setSliderStyles(minRange, maxRange)
    }

    const setting = parseFloat(
      event.target.className === "min"
        ? this.minTarget.value
        : this.maxTarget.value,
    )

    // We dispatch to the player controller to do its looping stuff
    const preparedPoints = this.#preparePoints(setting)

    this.dispatch("rangeInputUpdated", {
      detail: { ...preparedPoints },
    })
  }

  updateZoomLevel({ detail: { zoom } }) {
    // If we're adding a zoom and we're not already zoomed we're in the first zoom
    const firstZoom = zoom.isZoomed && !this.#isZoomed()

    // Reset the active zoom
    this.#activeZoom = zoom

    // Dispatch the event that the range values have been updated
    this.dispatch("rangeInputUpdated", {
      detail: {
        ...(firstZoom
          ? { start: this.#activeZoom.start, end: this.#activeZoom.end }
          : this.#preparePoints()),
        ...(firstZoom ? { zoom: ZoomType.In } : {}),
      },
    })

    // If we're zoomed-in we need to reset the range regardless of whether we're
    // first zooming in or not
    if (this.#isZoomed()) {
      debug("resetting range")
      this.resetRange()
    }

    // If we're not zoomed-in and we're in edit mode we need to update the slider styles
    if (!this.#isZoomed() && this.#isEditMode()) {
      this.resetRange()
      const minRange = parseFloat(this.minTarget.value)
      const maxRange = parseFloat(this.maxTarget.value)
      this.#setSliderStyles(minRange, maxRange)
    }
  }

  /*
   * Reset the slider styles and values
   */
  resetRange() {
    debug(`Min: ${this.minTarget.value}. Max: ${this.maxTarget.value}`)
    const range = this.element.querySelector(".range-selected")
    range.style.left = "0%"
    range.style.right = "0%"

    this.minTarget.value = 0
    this.maxTarget.value = this.maxTarget.max
  }

  convertFields() {
    if (this.#isZoomed()) {
      const { start, end } = this.#activeZoom.convert(
        parseFloat(this.minTarget.value),
        parseFloat(this.maxTarget.value),
      )
      this.minTarget.value = start
      this.maxTarget.value = end
      debug("Zoom convertion pre-submission", {
        start: this.minTarget.value,
        end: this.maxTarget.value,
      })
    }

    this.dispatch("submitForm")
  }

  #setSliderStyles(min, max) {
    this.sliderTarget.style.left = `${(min / this.minTarget.max) * 100}%`
    this.sliderTarget.style.right = `${100 - (max / this.maxTarget.max) * 100}%`
  }

  #preparePoints(pointToSet) {
    const start = parseFloat(this.minTarget.value)
    const end = parseFloat(this.maxTarget.value)

    return {
      ...this.#activeZoom.convert(start, end),
      ...(pointToSet
        ? { setting: this.#activeZoom.convertPoint(pointToSet) }
        : {}),
    }
  }

  #isEditMode() {
    return this.hasMinDefaultValue && this.hasMaxDefaultValue
  }

  #isZoomed() {
    return this.#activeZoom.isZoomed
  }
}
