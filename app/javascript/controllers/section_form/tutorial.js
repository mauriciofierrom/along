import { mkDrive, tutorId, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  Timeline: "timeline",
  StartPoint: "start-point",
  EndPoint: "end-point",
  NameField: "name-field",
  PlaybackSpeedField: "playback-speed-field",
  Loop: "loop",
  Create: "create",
  CancelButton: "cancel-button",
  Final: "final",
})


const stepSettings = {
  [tutorId(Elements.Timeline)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.StartPoint)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.EndPoint)]: {
    popover: { side: PopoverSide.Left },
  },
  [tutorId(Elements.NameField)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.PlaybackSpeedField)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.Loop)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.Create)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.CancelButton)]: {
    popover: { side: PopoverSide.Top },
  },
  [tutorId(Elements.LessonTitle)]: {
    popover: { side: PopoverSide.Bottom },
  },
}

export const drive = (config) => mkDrive(config, stepSettings)
