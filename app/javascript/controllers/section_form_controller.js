import { Controller } from "@hotwired/stimulus"
import { debug } from "controllers/util"

export default class extends Controller {
  connect() {
    debug("Section Form controller connected")
  }

  submit(event) {
    debug("sections controller submit")
    event.preventDefault()
    this.dispatch("convertFields")
  }

  submitForm() {
    debug("Submit form finally")
    this.element.submit()
  }
}
