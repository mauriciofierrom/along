import { Controller } from "@hotwired/stimulus"

import { debug, enable } from "controllers/util"

export default class extends Controller {
  static targets = ["newSection"]
  static outlets = ["player"]
  static values = {
    playerLoaded: Boolean,
  }

  connect() {
    debug("we're on")
  }

  playerOutletConnected(player) {
    if (!player.isPlayerInitialized) return
    this.playerLoadedValue = true
    if (this.hasNewSectionTarget) {
      enable(this.newSectionTarget)
    }
  }

  newSectionTargetConnected(element) {
    if (this.playerLoadedValue) enable(element)
  }

  playerInitialized() {
    debug("We're ready to rumble")
    this.playerLoadedValue = true
    enable(this.newSectionTarget)
  }
}
