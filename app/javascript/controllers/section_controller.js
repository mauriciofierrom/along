import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  connect() {
    console.log(`Section load start: ${this.element.dataset.start}`)
    console.log(`Section load end: ${this.element.dataset.end}`)
    const start = parseFloat(this.element.dataset.start)
    const end = parseFloat(this.element.dataset.end)

    this.dispatch("connect", { detail: {start: start, end: end}})
  }

  disconnect() {
    console.log("section disconnect")
    this.dispatch("disconnect")
  }
}
