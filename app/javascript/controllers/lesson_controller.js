import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static outlets = [ "player" ]

  connect() {
    console.log("connected lesson controller")
  }

  loadSection(evt) {
    // console.log(`Section: ${evt.target.parentElement.dataset.start} - ${evt.target.parentElement.dataset.end}`)
    const start = parseFloat(evt.target.parentElement.dataset.start)
    const end = parseFloat(evt.target.parentElement.dataset.end)


    this.playerOutlet.playFromTo(start, end)
  }
}
