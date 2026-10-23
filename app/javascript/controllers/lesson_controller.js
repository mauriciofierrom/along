import { Controller } from "@hotwired/stimulus"

import { drive } from "controllers/lesson/tutorial"

export default class extends Controller {
  static values = {
    tutorialConfig: Object,
  }

  showTutorial() {
    if (this.hasTutorialConfigValue) drive(this.tutorialConfigValue)
  }
}
