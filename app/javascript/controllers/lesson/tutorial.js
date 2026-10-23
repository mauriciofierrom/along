import { debug, tutorId } from "controllers/util"

const TUTOR_THEME_CLASS = "tutor-theme"

const Elements = Object.freeze({
  NewLesson: "new-lesson",
  LessonList: "lesson-list",
  LessonItem: "lesson-item",
  LessonItemTitle: "lesson-item-title",
  LessonItemDelete: "lesson-item-delete",
  Final: "final",
})

const PopoverSide = Object.freeze({
  Left: "left",
  Right: "right",
  Top: "top",
  Bottom: "bottom",
})

const stepSettings = {
  [tutorId(Elements.NewLesson)]: {
    popover: { side: PopoverSide.Left },
  },
  [tutorId(Elements.LessonList)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.LessonItem)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.LessonItemTitle)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.LessonItemDelete)]: {
    popover: { side: PopoverSide.Right },
  },
}

const commonStepSettings = {
  skipMissingElement: true,
}

const makeSteps = (translatedSteps) =>
  translatedSteps.map((step) => ({
    ...commonStepSettings,
    ...step,
    popover: {
      ...step.popover,
      ...stepSettings[step.element]?.popover,
    },
  }))

export const drive = (config) => {
  const driver = window.driver.js.driver

  const driverObj = driver({
    showProgress: true,
    popoverClass: TUTOR_THEME_CLASS,
    ...config,
    steps: makeSteps(config.steps),
  })

  driverObj.drive()
}
