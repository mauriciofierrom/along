const TUTOR_THEME_CLASS = "tutor-theme"

export const PopoverSide = Object.freeze({
  Left: "left",
  Right: "right",
  Top: "top",
  Bottom: "bottom",
})

export const BeaconSide = Object.freeze({
  Left: "left",
  Right: "right",
  Top: "top",
  Bottom: "bottom",
})

export const BeaconAlign = Object.freeze({
  Start: "start",
  Center: "center",
  End: "end",
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

const makeHints = (translatedHints, hintSettings) =>
  translatedHints.map((hint) => ({
    ...hint,
    id: hintSettings[hint.element]?.id,
    beacon: hintSettings[hint.element]?.beacon,
    popover: {
      ...hint.popover,
      ...hintSettings[hint.element]?.popover,
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

export const mkHints = (config, hintSettings) => {
  const hints = window.driverHints.hints
  const leHints = makeHints(config.hints, hintSettings).filter((hint) => !localStorage.getItem(hint.id))

  return hints({
    overlay: true,
    overlayOpacity: 0.5,
    popoverClass: "tutor-theme",
    buttonText: config.dismissButtonText,
    hints: leHints,
    onDismiss: (_element, hint) => {
      localStorage.setItem(hint.id, "dismissed")
    },
  })
}
