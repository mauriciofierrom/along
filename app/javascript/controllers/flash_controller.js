/* eslint-disable import/no-anonymous-default-export */
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  remove() {
    this.element.remove()
  }
}
