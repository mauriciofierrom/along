import { mkDrive, tutorId, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  NameField: "name-field",
  VideoLinkField: "video-link-field",
  VideoPasteButton: "video-paste-button",
  InstrumentSelector: "instrument-selector",
  CreateButton: "create-button",
  CancelButton: "cancel-button",
  Final: "final",
})

const Events = Object.freeze({
  VideoLinkNext: "videoLinkNext"
})

const stepSettings = {
  [tutorId(Elements.NameField)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.VideoLinkField)]: {
    popover: {
      side: PopoverSide.Right,
      onNextClick: (_element, _step, { driver }) => {
        // dispatch an event
        document.dispatchEvent(new CustomEvent(Events.VideoLinkNext))
        driver.moveNext()
      }
    },
  },
  [tutorId(Elements.VideoPasteButton)]: {
    popover: { side: PopoverSide.Right },
  },
  [tutorId(Elements.CreateButton)]: {
    popover: { side: PopoverSide.Left },
  },
  [tutorId(Elements.CancelButton)]: {
    popover: { side: PopoverSide.Right },
  },
}

export const drive = (config) => mkDrive(config, stepSettings)
