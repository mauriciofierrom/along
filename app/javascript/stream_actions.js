/* eslint-disable no-undef */

import { Animations } from "controllers/util"

Turbo.StreamActions.animated_remove = function () {
  const animation = this.getAttribute("animation") || Animations.FadeOut
  this.targetElements.forEach((element) => {
    element.addEventListener("animationend", () => element.remove(), {
      once: true,
    })
    element.classList.add(animation)
  })
}
