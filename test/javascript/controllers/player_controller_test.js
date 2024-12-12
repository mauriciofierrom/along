import { Application } from "@hotwired/stimulus"

import { ReadyState, PlayingState, EditingState } from "../../../app/javascript/controllers/player/state"
import PlayerController from "../../../app/javascript/controllers/player_controller"
import LoopManager from "../../../app/javascript/controllers/player/loop_manager"

jest.mock("../../../app/javascript/controllers/player/loop_manager", () => {
  return jest.fn().mockImplementation(() => {
    return {
      loop: jest.fn(),
    }
  })
})

jest.useFakeTimers();

describe("PlayerController", () => {
  let application;

  // TODO: There seems to be an error with jest-dom or whatever that prevents me
  // from creating and sharing the playerController/Element from the beforeEach.
  // That would help simplify the tests.
  beforeEach(() => {
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

    expect(playerController.state).toBeInstanceOf(ReadyState)
  })

  describe("playFromTo", () => {
    it("sets the state to playing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      playerController.playFromTo({detail: {start: 13, end: 43}})

      expect(playerController.state).toBeInstanceOf(PlayingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.playFromTo({detail: {start: 13, end: 43}})

      expect(mockLoop).toHaveBeenCalledWith(13, 43)
    })
  })

  describe("triggerEdition", () => {
    it("sets the state to editing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      playerController.triggerEdition({detail: { start: 34, end: 56 }})

      expect(playerController.state).toBeInstanceOf(EditingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.triggerEdition({detail: { start: 43, end: 65 }})

      expect(mockLoop).toHaveBeenCalledWith(43, 65)
    })
  })
})
