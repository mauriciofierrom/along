import { mkDrive, tutorId, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  LessonTitle: "lesson-title",
  LessonTitleEditButton: "lesson-title-edit-button",
  Player: "player",
  NewSectionLink: "new-section-link",
  SectionItemList: "section-item-list",
  SectionItem: "section-item",
  SectionItemEditButton: "section-item-edit-button",
  SectionItemDeleteButton: "section-item-delete-button",
})

const stepSettings = {
  [tutorId(Elements.LessonTitle)]: {
    popover: { side: PopoverSide.Bottom },
  },
  [tutorId(Elements.LessonTitleEditButton)]: {
    popover: { side: PopoverSide.Bottom },
  },
  [tutorId(Elements.Player)]: {
    popover: { side: PopoverSide.Bottom },
  },
  [tutorId(Elements.NewSectionLink)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.SectionItemList)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.SectionItem)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.SectionItemEditButton)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.SecionItemDeleteButton)]: {
    popover: { side: PopoverSide.Right },
  },
}

export const drive = (config) => mkDrive(config, stepSettings)
