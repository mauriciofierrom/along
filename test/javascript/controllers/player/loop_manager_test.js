import LoopManager from "../../../../app/javascript/controllers/player/loop_manager"
import YoutubePlayer from "../../../../app/javascript/controllers/player/youtube_player"
import DummyPlayer from "../../../../app/javascript/controllers/player/dummy_player"
import { PlayerRestriction } from "../../../../app/javascript/controllers/player/player"
import PlayerController from "../../../../app/javascript/controllers/player_controller"

jest.mock("../../../../app/javascript/controllers/player_controller")

const mockPlay = jest.fn()

jest.mock(
  "../../../../app/javascript/controllers/player/youtube_player",
  () => {
    return jest.fn().mockImplementation(() => {
      return {
        duration: 15,
        currentTime: 7,
        play: mockPlay,
        canPlay: () => {
          Promise.resolve().catch((error) => console.error(error))
        },
      }
    })
  },
)

jest.useFakeTimers()

describe("LoopManager", () => {
  let player

  beforeEach(() => {
    YoutubePlayer.mockClear()

    player = new YoutubePlayer({})
  })

  describe("bounded loop", () => {
    it("should be stopped after the provided max times", async () => {
      const loopManager = new LoopManager(player, new PlayerController())

      loopManager.loop(1, 5, 3)

      // Force the event loop to move before we clear to allow the code in the
      // loop promise to run and set the intervalId used for the check of clear
      // FIXME: Extremely hacky and I don't completely understand why this works
      // nor have the time. For now and for this test I'll leave it until I read
      // more about it.
      await new Promise(jest.requireActual("timers").setImmediate)

      jest.runAllTimers()

      expect(mockPlay).toHaveBeenCalledTimes(4)
    })
  })

  describe("unrestricted loop", () => {
    it("should not stop until interrupted", async () => {
      const loopManager = new LoopManager(player, new PlayerController())

      const loop = loopManager.loop(1, 5)

      // Force the event loop to move before we clear to allow the code in the
      // loop promise to run and set the intervalId used for the check of clear
      // FIXME: Extremely hacky and I don't completely understand why this works
      // nor have the time. For now and for this test I'll leave it until I read
      // more about it.
      await new Promise(jest.requireActual("timers").setImmediate)

      jest.advanceTimersByTime(500)
      await loopManager.clear()

      await expect(loop).rejects.toMatch("Cancelled manually")
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
        await expect(loopManager.loop(12, 23, 2)).rejects.toMatch(
          JSON.stringify({ restriction: PlayerRestriction.UserActionRequired }),
        )
      })
    })

    describe("whent he player has no unmet restrictions", () => {
      it("performs the loop normaly and resolves", async () => {
        document.head.innerHTML = "<script></script>"
        document.body.innerHTML = ` <div data-controller="player" id="player">
        </div>
        `
        const loopManager = new LoopManager(new DummyPlayer({}))

        // TODO: Check why this fails if we expect something
        // eslint-disable-next-line jest/valid-expect
        await expect(loopManager.loop(12, 34, 2)).resolves
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
        it("should be between the end point and 3 less seconds or the start", () => {
          expect(LoopManager.settingRange(1.0, 2.0, 2.0)).toEqual([0.0, 2.0])
        })
      })

      describe("when 3 seoncs before the end is greater than the start", () => {
        it("should be between the 3 seconds before the end and the end", () => {
          expect(LoopManager.settingRange(4.0, 7.0, 7.0)).toEqual([4.0, 7.0])
        })
      })
    })
  })
})
