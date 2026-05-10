import { mock, describe, jest, expect, beforeEach, it } from "bun:test"

import { Application } from "@hotwired/stimulus"

import PlayerController from "controllers/player_controller"
import { PlayingState, EditingState } from "controllers/player/state"
import LoopManager from "controllers/player/loop_manager"

mock.module("controllers/player/loop_manager", () => ({
  default: class {
    loop() {
      return Promise.resolve()
    }

    // eslint-disable-next-line no-empty-function
    clear() {}
  },
}))

jest.useFakeTimers()

describe("PlayerState", () => {
  let application

  beforeEach(() => {
    document.body.innerHTML = `<div data-controller="player" id="player" data-player-video-id-value="video-id">
    </div>
    `

    application = Application.start()
    application.register("player", PlayerController)
  })

  describe("ReadyState", () => {
    describe("loop", () => {
      it("loops and transitions to playing state", () => {
        const playerElement = document.querySelector("#player")
        const playerController =
          application.getControllerForElementAndIdentifier(
            playerElement,
            "player",
          )

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.state = playerController.readyState
        playerController.loop(12, 32)

        expect(playerController.state).toBeInstanceOf(PlayingState)
        expect(mockLoop).toHaveBeenCalledWith(12, 32)
      })
    })
  })

  describe("PlayingState", () => {
    describe("loop", () => {
      it("loops without transitioning", () => {
        const playerElement = document.querySelector(
          '[data-controller="player"]',
        )
        const playerController =
          application.getControllerForElementAndIdentifier(
            playerElement,
            "player",
          )

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.state = playerController.playingState
        playerController.loop(43, 123)

        expect(playerController.state).toBeInstanceOf(PlayingState)
        expect(mockLoop).toHaveBeenCalledWith(43, 123)
      })
    })
  })

  describe("EditingState", () => {
    describe("loop", () => {
      it("loops without transitioning", () => {
        const playerElement = document.querySelector(
          '[data-controller="player"]',
        )
        const playerController =
          application.getControllerForElementAndIdentifier(
            playerElement,
            "player",
          )

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.state = playerController.editingState
        playerController.loop(43, 56)

        expect(playerController.state).toBeInstanceOf(EditingState)
        expect(mockLoop).toHaveBeenCalledWith(43, 56)
      })
    })
  })

  describe("PickingPointState", () => {
    describe("loop", () => {
      it("loops three times and then transitions back to EditingState", async () => {
        const playerElement = document.querySelector(
          '[data-controller="player"]',
        )
        const playerController =
          application.getControllerForElementAndIdentifier(
            playerElement,
            "player",
          )

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.state = playerController.pickingPointState
        await playerController.loop(1, 5)

        expect(mockLoop).toHaveBeenCalledWith(1, 5, 1)
        expect(playerController.state).toBeInstanceOf(EditingState)
      })
    })
  })
})
