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

describe("PlayerController", () => {
  let application;

  // TODO: There seems to be an error with jest-dom or whatever that prevents me
  // from creating and sharing the playerController/Element from the beforeEach.
  // That would help simplify the tests.
  beforeEach(async () => {
    YoutubePlayer.mockClear()

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

      const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

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

      const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

      playerController.triggerEdition({detail: { start: 43, end: 65 }})

      expect(mockLoop).toHaveBeenCalledWith(43, 65)
    })
  })

  describe("updatePoints", () => {
    it("sets the state to picking point", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      window.onYouTubeIframeAPIReady()

      playerController.updatePoints({detail: { start: 34, end: 56, setting: 56 }})

      expect(playerController.state).toBeInstanceOf(PickingPointState)
    })

    // TODO: The cases where either point are close to the end or the beginning
    // don't make much sense in most cases. Tests pending.
    describe("when setting start", () => {
      it("calls the loop manager with start and start + 3", () => {
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

        window.onYouTubeIframeAPIReady()

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.updatePoints({detail: { start: 22, end: 77, setting: 22 }})

        expect(mockLoop).toHaveBeenCalledWith(22, 25, 1)
      })
    })

    describe("when setting end", () => {
      it("calls the loop manager with start and start + 3", () => {
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

        window.onYouTubeIframeAPIReady()

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.updatePoints({detail: { start: 22, end: 77, setting: 22 }})

        expect(mockLoop).toHaveBeenCalledWith(22, 25, 1)
      })
    })
  })
})
