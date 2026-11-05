import { mkDrive, tutorId, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  SectionName: "section-name",
  SectionInfo: "section-info",
  LockIndicator: "lock-indicator",
  CancelButton: "cancel-button",
  Final: "final"
})

const stepSettings = {
  [tutorId(Elements.SectionName)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.SectionInfo)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.LockIndicator)]: {
    popover: { side: PopoverSide.Left },
  },
  [tutorId(Elements.CancelButton)]: {
    popover: { side: PopoverSide.Right },
  },
}

export const drive = (config) => mkDrive(config, stepSettings)
