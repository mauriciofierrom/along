import { Controller } from "@hotwired/stimulus";
import { debounce } from "controllers/util";

export default class extends Controller {
  static targets = [ "min", "max" ]
  static outlets = [ "player" ]

  connect() {
    console.log("connected range controller")
  }

  initialize() {
    this.update = debounce(this.update.bind(this), 100)
  }

  update(e) {
    const rangeMin = 0
    console.log("update")
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
      this.minTarget.value = minRange;
      this.maxTarget.value = maxRange;
      range.style.left = (minRange / this.minTarget.max) * 100 + "%";
      range.style.right = 100 - (maxRange / this.maxTarget.max) * 100 + "%";
    }

    // Start the player again
    this.playerOutlet.playFromTo(parseFloat(this.minTarget.value), parseFloat(this.maxTarget.value))
  }
}
