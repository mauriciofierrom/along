import { Controller } from "@hotwired/stimulus";
import { debug } from "controllers/util";

export default class extends Controller {
  connect() {
    debug("Section Form controller connected")
  }

  submit(e) {
    console.log("sections controller submit")
    debug("convert fields dispatch")
    e.preventDefault()
    this.dispatch("convertFields")
  }

  submitForm(_) {
    debug("Submit form finally")
    this.element.submit()
  }
}
