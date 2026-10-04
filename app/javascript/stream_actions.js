/* eslint-disable no-undef */

Turbo.StreamActions.animated_remove = function () {
  const animation = this.getAttribute("animation") || "fade-out"
  this.targetElements.forEach((element) => {
    element.addEventListener("animationend", () => element.remove(), {
      once: true,
    })
    element.classList.add(animation)
  })
}
