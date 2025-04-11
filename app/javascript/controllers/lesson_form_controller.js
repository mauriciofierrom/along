import { Controller } from "@hotwired/stimulus"
import { show, hide, enable, disable } from "controllers/util"

export default class extends Controller {
  static targets = ["field", "url", "errorContainer", "errorList"]

  connect() {
    this.urlTarget.focus()
  }

  videoLoadFailed() {
    // Remove previous errors
    this.errorListTarget.innerHTML = ""

    // Create error list item
    const li = document.createElement("li")
    li.innerHTML = "This video is restricted from being embedded"

    // Add error to error list
    this.errorListTarget.append(li)

    // Disable all relevant fields
    this.fieldTargets.forEach(disable)

    // Show the error list
    show(this.errorContainerTarget)
  }

  videoLoaded() {
    this.errorListTarget.innerHTML = ""
    hide(this.errorContainerTarget)
    this.fieldTargets.forEach(enable)

    this.fieldTargets[0].focus()
  }

  load() {
    this.dispatch("videoUrlChanged", { detail: { url: this.urlTarget.value } })
  }
}
