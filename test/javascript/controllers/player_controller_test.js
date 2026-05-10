import { mock, jest, describe, it, beforeEach, expect } from "bun:test"

import { Application } from "@hotwired/stimulus"

import PlayerController from "controllers/player_controller"
import {
  ReadyState,
  PlayingState,
  EditingState,
} from "controllers/player/state"

jest.useFakeTimers()

mock.module("controllers/player/loop_manager", () => {
  return { loop: jest.fn(), clear: jest.fn(), settingRange: jest.fn() }
})

describe("PlayerController", () => {
  let application

  // TODO: Sharing the playerController/Element from the beforeEach.
  // That would help simplify the tests.
  beforeEach(() => {
    jest.clearAllMocks()

    window.rails_env = "test"

    document.head.innerHTML = "<script></script>"
    document.body.innerHTML = ` <div data-controller="player" data-player-video-id-value="video-id">
    </div>
    `

    application = Application.start()
    application.register("player", PlayerController)
  })

  it("initialized", () => {
    const playerElement = document.querySelector('[data-controller="player"]')
    const playerController = application.getControllerForElementAndIdentifier(
      playerElement,
      "player",
    )

    expect(playerController.state).toBeInstanceOf(ReadyState)
  })

  describe("playFromTo", () => {
    it("sets the state to playing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(
        playerElement,
        "player",
      )

      playerController.playFromTo({ detail: { start: 13, end: 43 } })

      expect(playerController.state).toBeInstanceOf(PlayingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(
        playerElement,
        "player",
      )

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.playFromTo({ detail: { start: 13, end: 43 } })

      expect(mockLoop).toHaveBeenCalledWith(13, 43)
    })
  })

  describe("triggerEdition", () => {
    it("sets the state to editing", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(
        playerElement,
        "player",
      )

      playerController.triggerEdition({ detail: { start: 34, end: 56 } })

      expect(playerController.state).toBeInstanceOf(EditingState)
    })

    it("calls the loop manager with the right parameters", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(
        playerElement,
        "player",
      )

      const mockLoop = jest.spyOn(playerController, "loop")

      playerController.triggerEdition({ detail: { start: 43, end: 65 } })

      expect(mockLoop).toHaveBeenCalledWith(43, 65)
    })
  })

  describe("updatePoints", () => {
    it("dispatches to enable/disable range inputs around clear method", () => {
      const playerElement = document.querySelector('[data-controller="player"]')
      const playerController = application.getControllerForElementAndIdentifier(
        playerElement,
        "player",
      )

      const mockDispatch = jest.spyOn(playerController, "dispatch")

      playerController.updatePoints({
        detail: { start: 43, end: 65 },
      })

      jest.runOnlyPendingTimers()

      expect(mockDispatch.mock.calls[0][0]).toBe("loopClearStarted")
      expect(mockDispatch.mock.calls[1][0]).toBe("loopClearFinished")
    })
  })
})
