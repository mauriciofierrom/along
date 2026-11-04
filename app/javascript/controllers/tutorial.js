const TUTOR_THEME_CLASS = "tutor-theme"

export const PopoverSide = Object.freeze({
  Left: "left",
  Right: "right",
  Top: "top",
  Bottom: "bottom",
})

export const Events = Object.freeze({
  Start: "tutorial:start",
  End: "tutorial:end"
})

const commonStepSettings = {
  skipMissingElement: true,
}

const makeSteps = (translatedSteps, stepSettings) =>
  translatedSteps.map((step) => ({
    ...commonStepSettings,
    ...step,
    popover: {
      ...step.popover,
      ...stepSettings[step.element]?.popover,
    },
  }))

export const tutorId = (tourId) => `[data-tutorid='${tourId}']`

export const mkDrive = (config, stepSettings) => {
  if (window.isTutorialOngoing === "true") return

  const driver = window.driver.js.driver

  const driverObj = driver({
    showProgress: true,
    popoverClass: TUTOR_THEME_CLASS,
    ...config,
    steps: makeSteps(config.steps, stepSettings),
    onDestroyed: () => {
      window.isTutorialOngoing = false
      document.dispatchEvent(new CustomEvent(Events.End))
    }
  })

  // Set a global variable to keep track of ongoing tutorials
  window.isTutorialOngoing = true

  // Dispatch an event so that any interested party can react to this
  document.dispatchEvent(new CustomEvent(Events.Start))

  // Actually start the tutorial
  driverObj.drive()
}
