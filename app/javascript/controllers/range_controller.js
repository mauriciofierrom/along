import { Controller } from "@hotwired/stimulus";
import { debounce } from "controllers/util";

export default class extends Controller {
  static targets = [ "min", "max" ]
  static outlets = [ "player" ]

  connect() {
    console.log("connected range controller")
    // When the player is set to edit we automatically start playing the section
    if (this.playerOutlet.edit) {
      this.playerOutlet.playFromTo(parseFloat(this.minTarget.value),
        parseFloat(this.maxTarget.value))
    }
  }

  initialize() {
    this.update = debounce(this.update.bind(this), 100)

    // Set initial style for the slider range
    const range = document.querySelector(".range-selected")
    let minRange = parseFloat(this.minTarget.value)
    let maxRange = parseFloat(this.maxTarget.value)
    range.style.left = (minRange / this.minTarget.max) * 100 + "%";
    range.style.right = 100 - (maxRange / this.maxTarget.max) * 100 + "%";
  }

  update(e) {
    const rangeMin = 0
    const range = document.querySelector(".range-selected")
    let minRange = parseFloat(this.minTarget.value)
    let maxRange = parseFloat(this.maxTarget.value)

    if (maxRange - minRange < rangeMin) {
      if (e.target.className === "min") {
        this.minTarget.value = maxRange - rangeMin;
      } else {
        this.maxTarget.value = minRange + rangeMin;
      }
    } else {
      range.style.left = (minRange / this.minTarget.max) * 100 + "%";
      range.style.right = 100 - (maxRange / this.maxTarget.max) * 100 + "%";
    }

    // Start the player again
    this.playerOutlet.playFromTo(parseFloat(this.minTarget.value), parseFloat(this.maxTarget.value))
  }
}
