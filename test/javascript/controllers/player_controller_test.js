import { Application } from "@hotwired/stimulus"
import PlayerController from "../../../app/javascript/controllers/player_controller"
import LoopManager from "../../../app/javascript/controllers/player/loop_manager"
import YoutubePlayer from "../../../app/javascript/controllers/player/youtube_player"
import { ReadyState, PlayingState, EditingState, PickingPointState } from "../../../app/javascript/controllers/player/state"

jest.mock("../../../app/javascript/controllers/player/youtube_player", () => {
  return jest.fn().mockImplementation(() => {
    return {
      duration: 222,
      currentTime: 7,
      play: () => {},
      load: () => {},
      pause: () => {},
    }
  })
})

jest.mock("../../../app/javascript/controllers/player/loop_manager", () => {
  return jest.fn().mockImplementation(() => {
    return {
      loop: jest.fn(),
      clear: async () => {}
    }
  })
})

jest.useFakeTimers();

describe("PlayerController", () => {
  let application;

  // TODO: There seems to be an error with jest-dom or whatever that prevents me
  // from creating and sharing the playerController/Element from the beforeEach.
  // That would help simplify the tests.
  beforeEach(async () => {
    YoutubePlayer.mockClear()
    LoopManager.mockClear()

    document.head.innerHTML = "<script></script>"
    document.body.innerHTML = ` <div data-controller="player" data-player-video-id-value="video-id">
    </div>
    `

    application = Application.start()
    application.register("player", PlayerController)
  })

  it("initialized", () => {
    const playerElement = document.querySelector('[data-controller="player"]')
    const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

    window.onYouTubeIframeAPIReady()

    expect(playerController.state).toBeInstanceOf(ReadyState)
  })

  describe("playFromTo", () => {
    it("sets the state to playing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      window.onYouTubeIframeAPIReady()

      playerController.playFromTo({detail: {start: 13, end: 43}})

      expect(playerController.state).toBeInstanceOf(PlayingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      window.onYouTubeIframeAPIReady()

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.playFromTo({detail: {start: 13, end: 43}})

      expect(mockLoop).toHaveBeenCalledWith(13, 43)
    })
  })

  describe("triggerEdition", () => {
    it("sets the state to editing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      window.onYouTubeIframeAPIReady()

      playerController.triggerEdition({detail: { start: 34, end: 56 }})

      expect(playerController.state).toBeInstanceOf(EditingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      window.onYouTubeIframeAPIReady()

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.triggerEdition({detail: { start: 43, end: 65 }})

      expect(mockLoop).toHaveBeenCalledWith(43, 65)
    })
  })
})
