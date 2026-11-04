import { mkDrive, tutorId, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  NewLesson: "new-lesson",
  LessonList: "lesson-list",
  LessonItem: "lesson-item",
  LessonItemTitle: "lesson-item-title",
  LessonItemDelete: "lesson-item-delete",
  Final: "final",
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

export const drive = (config) => mkDrive(config, stepSettings)
