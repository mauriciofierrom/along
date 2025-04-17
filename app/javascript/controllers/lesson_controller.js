import { Controller } from "@hotwired/stimulus"
import { debug, enable } from "controllers/util"

export default class extends Controller {
  static targets = ["newSection"]
  static values = {
    playerLoaded: Boolean,
  }

  connect() {
    debug("we're on")
  }

  newSectionTargetConnected(element) {
    debug("new section button connected")
    if (this.playerLoadedValue) enable(element)
  }

  playerInitialized() {
    debug("We're ready to rumble")
    this.playerLoadedValue = true
    enable(this.newSectionTarget)
  }
}
