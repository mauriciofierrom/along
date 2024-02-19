import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static outlets = [ "player" ]

  connect() {
    console.log(this.element.dataset)
    console.log(`Section load start: ${this.element.dataset.start}`)
    console.log(`Section load end: ${this.element.dataset.end}`)
    const start = parseFloat(this.element.dataset.start)
    const end = parseFloat(this.element.dataset.end)

    this.playerOutlet.playFromTo(start, end)
  }

  disconnect() {
    console.log("section disconnect")
    this.playerOutlet.resetPlayer()
  }
}
