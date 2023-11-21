import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static outlets = [ "player" ]

  connect() {
    const start = parseFloat(this.element.dataset.start)
    const end = parseFloat(this.element.dataset.end)


    this.playerOutlet.playFromTo(start, end)
  }

  disconnect() {
    this.playerOutlet.resetPlayer()
  }
}
