import { Controller } from "@hotwired/stimulus"
import { debounce, debug } from "controllers/util"
import Zoom, { ZoomType } from "controllers/zoom"

export default class extends Controller {
  static targets = ["min", "max", "slider"]
  static outlets = ["player"]
  static values = {
    minDefault: Number,
    maxDefault: Number,
  }

  /**
   * @typedef {Object} Zoom
   * @property {number} start - The start of the zoom range
   * @property {number} end - The end of the zoom range
   */
  zoomLevels = []

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

    let detail
    debug("connected range controller")
    this.#duration = parseFloat(this.maxTarget.max)
    this.zoomLevels = this.#initZoomLevels()
    debug("Duration", this.#duration)

    // INFO: Initial connection requires loading the correct zoom value if any
    if (this.zoomLevel > 0) {
      const start = parseFloat(this.minTarget.value)
      const end = parseFloat(this.maxTarget.value)
      const restored = this.activeZoomLevel.restore(start, end)

      this.minTarget.value = restored.start
      this.maxTarget.value = restored.end

      debug("Restored", restored)
      detail = {
        start,
        end,
        zoom: ZoomType.In,
        max: parseFloat(this.maxTarget.max),
      }
    } else {
      debug("detail", detail)
      detail = {
        start: parseFloat(this.minTarget.value),
        end: parseFloat(this.maxTarget.value),
        max: parseFloat(this.maxTarget.max),
      }
    }

    debug("Detail", detail)
    this.dispatch("connect", { detail })
    this.dispatch("setPoint", { detail })

    // Initialize the zoom controllers
    this.dispatch("ready", {
      detail: {
        duration: parseFloat(this.maxTarget.max),
        currentZoomLevel: this.zoomLevel,
        isEdit: this.hasMinDefaultValue && this.hasMaxDefaultValue,
      },
    })

    debug("zoom levels after init", this.zoomLevels)
  }

  update(event) {
    debug(`Min: ${this.minTarget.value} - Max: ${this.maxTarget.value}`)
    const rangeMin = 0
    const minRange = parseFloat(this.minTarget.value)
    const maxRange = parseFloat(this.maxTarget.value)
    let setting = null
    let detail = null

    debug(`Min: ${minRange} - Max: ${maxRange}`)

    this.dispatch("rangeUpdated", {
      detail: {
        start: minRange,
        end: maxRange,
        max: parseFloat(this.maxTarget.max),
      },
    })

    if (maxRange - minRange < rangeMin) {
      if (event.target.className === "min") {
        this.minTarget.value = maxRange - rangeMin
      } else {
        this.maxTarget.value = minRange + rangeMin
      }
    } else {
      this.#setSliderStyles(minRange, maxRange)
    }

    if (event.target.className === "min") {
      setting = parseFloat(this.minTarget.value)
    } else {
      setting = parseFloat(this.maxTarget.value)
    }

    debug(`dispatch wth ${setting}`)

    // Start the player's loop again
    detail = this.#dispatchDetail(setting)

    // We dispatch to the player controller to do its looping stuff
    this.dispatch("update", { detail })
  }

  /*
   * Add a new zoom level to the end of the list
   *
   * To both dispatch to PlayerController and to add the new zoom level we cover
   * the following cases:
   *
   * - When we're zoomed-in already we need to convert the raw values received in
   * the event to the current zoom level.
   *
   * - On first zoom we use the values as they are.
   *
   * @param {Object} obj payload object for the event
   * @param {Object} obj.detail key that actually has the payload
   * @param {number} obj.detail.start the starting point directly from the input
   * @param {number} obj.detail.end the ending point directly from the input
   *
   */
  addZoomLevel({ detail: { start, end } }) {
    let detail

    if (this.zoomLevel > 0) {
      const { start: convertedStart, end: convertedEnd } =
        this.activeZoomLevel.convert(start, end)

      detail = {
        start: convertedStart,
        end: convertedEnd,
        zoom: ZoomType.In,
      }

      this.zoomLevels.push(
        new Zoom(convertedStart, convertedEnd, parseFloat(this.maxTarget.max)),
      )
    } else {
      detail = {
        start: parseFloat(this.minTarget.value),
        end: parseFloat(this.maxTarget.value),
        zoom: ZoomType.In,
      }

      this.zoomLevels.push(new Zoom(start, end, parseFloat(this.maxTarget.max)))
    }

    this.dispatch("zoomLevelAdded", { detail: { zoomLevel: this.zoomLevel } })
    this.resetRange()
    this.dispatch("update", { detail })
  }

  /*
   * Removal of zoom levels will always be a pop
   */
  removeZoomLevel() {
    let isEdit = false
    this.zoomLevels.pop()
    debug("remove zoom level", this.zoomLevels)

    if (this.zoomLevel > 0) {
      this.resetRange()
    } else if (this.hasMinDefaultValue && this.hasMaxDefaultValue) {
      this.minTarget.value = this.minDefaultValue
      this.maxTarget.value = this.maxDefaultValue

      this.#setSliderStyles(this.minDefaultValue, this.maxDefaultValue)
      isEdit = true
    }

    this.dispatch("zoomLevelRemoved", {
      detail: { zoomLevel: this.zoomLevel, isEdit },
    })

    // Dispatch with the newly set values to restart loop playing in the
    // controller
    const detail = this.#dispatchDetail()
    debug("detail on remove zoom level", detail)
    this.dispatch("update", { detail })
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
    if (this.zoomLevel > 0) {
      const { start, end } = this.activeZoomLevel.convert(
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

  #initZoomLevels() {
    const prefix = "section_zoom_attributes"

    const starts = Array.from(
      document.querySelectorAll(`input[id^='${prefix}'][id$='start']`),
    )
      .sort()
      .map((element) => parseFloat(element.value))

    const ends = Array.from(
      document.querySelectorAll(`input[id^='${prefix}'][id$='end']`),
    )
      .sort()
      .map((element) => parseFloat(element.value))

    return starts.map((start, i) => new Zoom(start, ends[i], this.#duration))
  }

  #setSliderStyles(min, max) {
    this.sliderTarget.style.left = `${(min / this.minTarget.max) * 100}%`
    this.sliderTarget.style.right = `${100 - (max / this.maxTarget.max) * 100}%`
  }

  #dispatchDetail(setting) {
    debug(
      `Setting: ${setting}. Min: ${this.minTarget.value}. Max: ${this.maxTarget.value}`,
    )

    if (this.zoomLevel > 0) {
      const converted = this.activeZoomLevel.convert(
        parseFloat(this.minTarget.value),
        parseFloat(this.maxTarget.value),
      )

      debug(
        `Min: ${this.minTarget.value}. Max: ${this.maxTarget.value}`,
        converted,
      )

      const convertedSetting = this.activeZoomLevel.convertPoint(setting)

      debug(`Setting: ${setting}. Converted setting: ${convertedSetting}`)
      return {
        ...converted,
        setting: convertedSetting,
      }
    } else {
      const detail = {
        start: parseFloat(this.minTarget.value),
        end: parseFloat(this.maxTarget.value),
        setting,
      }

      return detail
    }
  }

  get activeZoomLevel() {
    return this.zoomLevels[this.zoomLevels.length - 1]
  }

  get zoomLevel() {
    return this.zoomLevels.length
  }
}
