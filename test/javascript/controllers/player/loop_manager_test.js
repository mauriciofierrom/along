import LoopManager from "controllers/player/loop_manager"
import DummyPlayer from "controllers/player/dummy_player"
import { PlayerRestriction } from "controllers/player/player"
import { PlaybackErrorType } from "controllers/player/error"

jest.useFakeTimers()

describe("LoopManager", () => {
  let player
  const mockElement = { dispatch: jest.fn() }

  beforeEach(() => {
    jest.clearAllMocks()

    player = new DummyPlayer({})
  })

  describe("bounded loop", () => {
    it("should be stopped after the provided max times", async () => {
      const loopManager = new LoopManager(player, mockElement)
      const mockPlay = jest.spyOn(player, "play")

      const loop = loopManager.playTimes(1, 5, 3)

      await Promise.resolve()

      jest.advanceTimersByTime(600)

      await expect(loop).resolves.toBeUndefined()
      expect(mockPlay).toHaveBeenCalledTimes(3)
    })
  })

  describe("unrestricted loop", () => {
    it("should not stop until interrupted", async () => {
      const loopManager = new LoopManager(player, mockElement)
      const mockPlay = jest.spyOn(player, "play")

      const loop = loopManager.loop(1, 5)

      await Promise.resolve()

      jest.advanceTimersByTime(400)

      expect(mockPlay).toHaveBeenCalledTimes(3)

      loopManager.clear()

      await expect(loop).rejects.toMatchObject({
        name: "PlaybackError",
        type: PlaybackErrorType.LoopClear,
        message: "Cancelled manually",
      })

      expect(mockPlay).toHaveBeenCalledTimes(3)
    })
  })

  describe("play times followed by loop", () => {
    it("should start fresh", async () => {
      const loopManager = new LoopManager(player, mockElement)
      const mockPlay = jest.spyOn(player, "play")

      loopManager.playTimes(1, 5, 3)
      await Promise.resolve()

      jest.advanceTimersByTime(600)

      expect(mockPlay).toHaveBeenCalledTimes(3)

      const loop = loopManager.loop(1, 5)

      await Promise.resolve()

      jest.advanceTimersByTime(400)

      expect(mockPlay).toHaveBeenCalledTimes(6)

      loopManager.clear()

      await expect(loop).rejects.toMatchObject({
        name: "PlaybackError",
        type: PlaybackErrorType.LoopClear,
        message: "Cancelled manually",
      })

      expect(mockPlay).toHaveBeenCalledTimes(6)
    })
  })

  describe("loop followed by play times", () => {
    it("should start fresh", async () => {
      const loopManager = new LoopManager(player, mockElement)
      const mockPlay = jest.spyOn(player, "play")

      const loop = loopManager.loop(1, 5)

      await Promise.resolve()

      jest.advanceTimersByTime(600)

      expect(mockPlay).toHaveBeenCalledTimes(4)

      loopManager.clear()

      await expect(loop).rejects.toMatchObject({
        name: "PlaybackError",
        type: PlaybackErrorType.LoopClear,
        message: "Cancelled manually",
      })

      expect(mockPlay).toHaveBeenCalledTimes(4)

      loopManager.playTimes(1, 5, 3)

      jest.advanceTimersByTime(600)

      expect(mockPlay).toHaveBeenCalledTimes(7)
    })
  })

  describe("canLoop", () => {
    describe("when the player has an unmet restriction", () => {
      it("returns a reject promise with the reason playback was restricted", async () => {
        document.head.innerHTML = "<script></script>"
        document.body.innerHTML = ` <div data-controller="player" id="player" data-restriction="user_action_required">
        </div>
        `

        const loopManager = new LoopManager(new DummyPlayer({}))
        await expect(loopManager.playTimes(12, 23, 2)).rejects.toMatchObject({
          name: "PlaybackError",
          type: PlaybackErrorType.PlayerRestriction,
          message: "Player restriction",
          details: { restriction: PlayerRestriction.UserActionRequired },
        })
      })
    })

    describe("whent he player has no unmet restrictions", () => {
      it("performs the loop normaly and resolves", async () => {
        document.head.innerHTML = "<script></script>"
        document.body.innerHTML = ` <div data-controller="player" id="player">
        </div>
        `
        const loopManager = new LoopManager(new DummyPlayer({}), mockElement)

        const playTimes = loopManager.playTimes(12, 34, 2)
        await Promise.resolve()
        jest.advanceTimersByTime(400)

        await expect(playTimes).resolves.toBeUndefined()
      })
    })
  })

  describe("setting range", () => {
    describe("when setting the start point", () => {
      it("should be between the start point and 3 more seconds", () => {
        expect(LoopManager.settingRange(3.0, 14.0, 3.0)).toEqual([3.0, 6.0])
      })
    })

    describe("when setting the end point", () => {
      describe("when 3 seconds before the end is less than the start", () => {
        it("should be between the end point and 3 less seconds or the end", () => {
          expect(LoopManager.settingRange(1.0, 2.0, 2.0)).toEqual([1.0, 2.0])
        })
      })

      describe("when 3 seconds before the end is greater than the start", () => {
        it("should be between the 3 seconds before the end and the end", () => {
          expect(LoopManager.settingRange(4.0, 7.0, 7.0)).toEqual([4.0, 7.0])
        })
      })
    })
  })
})
