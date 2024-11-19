import { Application } from "@hotwired/stimulus"
import PlayerController from "../../../../app/javascript/controllers/player_controller"
import { PlayingState, EditingState } from "../../../../app/javascript/controllers/player/state"
import LoopManager from "../../../../app/javascript/controllers/player/loop_manager"

jest.mock("../../../../app/javascript/controllers/player/loop_manager")
jest.useFakeTimers();

describe("PlayerState", () => {
  let application;

  beforeEach(async () => {
    document.head.innerHTML = "<script></script>"
    document.body.innerHTML = ` <div data-controller="player" data-player-video-id-value="video-id">
    </div>
    `

    application = Application.start()
    application.register("player", PlayerController)
  })

  describe("ReadyState", () => {
    describe("loop", () => {
      it("loops and transitions to playing state", async () => {
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

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
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

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
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

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
        const playerElement = document.querySelector('[data-controller="player"]')
        const playerController = application.getControllerForElementAndIdentifier(playerElement, "player")

        const mockLoop = jest.spyOn(LoopManager.prototype, "loop")

        playerController.state = playerController.pickingPointState
        await playerController.loop(1, 5)

        expect(mockLoop).toHaveBeenCalledWith(1, 5, 1)
        expect(playerController.state).toBeInstanceOf(EditingState)
      })
    })
  })
})
