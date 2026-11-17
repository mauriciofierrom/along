import { mkHints, tutorId, BeaconSide, BeaconAlign, PopoverSide } from "controllers/tutorial"

const Elements = Object.freeze({
  ZoomInButton: "zoom-in-button",
  ZoomOutButton: "zoom-out-button",
  ZoomLevelIndicator: "zoom-level-indicator",
})

const hintSettings = {
  [tutorId(Elements.ZoomInButton)]: {
    id: Elements.ZoomInButton,
    popover: { side: PopoverSide.Right },
    beacon: { side: BeaconSide.Bottom, align: BeaconAlign.End },
  },
  [tutorId(Elements.ZoomOutButton)]: {
    id: Elements.ZoomOutButton,
    popover: { side: PopoverSide.Right },
    beacon: { side: BeaconSide.Bottom, align: BeaconAlign.End },
  },
  [tutorId(Elements.ZoomLevelIndicator)]: {
    id: Elements.ZoomLevelIndicator,
    popover: { side: PopoverSide.Top },
    beacon: { side: BeaconSide.Bottom, align: BeaconAlign.Center },
  },
}

export const hints = (config) => mkHints(config, hintSettings)
