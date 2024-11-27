import LoopManager from "../../../../app/javascript/controllers/player/loop_manager"
import YoutubePlayer from "../../../../app/javascript/controllers/player/youtube_player"

const mockPlay = jest.fn()

jest.mock("../../../../app/javascript/controllers/player/youtube_player", () => {
  return jest.fn().mockImplementation(() => {
    return {
      duration: 15,
      currentTime: 7,
      play: mockPlay,
      load: () => {},
      pause: () => {},
    }
  })
})

jest.useFakeTimers();

describe("LoopManager", () => {
  let player;

  beforeEach(() => {
    YoutubePlayer.mockClear()

    player = new YoutubePlayer({})
  })

  describe("bounded loop", () => {
    it("should be stopped after the provided max times", async () => {
      let loopManager = new LoopManager(player)

      loopManager.loop(1, 5, 3)

      // Force the event loop to move before we clear to allow the code in the
      // loop promise to run and set the intervalId used for the check of clear
      // FIXME: Extremely hacky and I don't completely understand why this works
      // nor have the time. For now and for this test I'll leave it until I read
      // more about it.
      await new Promise(jest.requireActual("timers").setImmediate);

      jest.runAllTimers()

      expect(mockPlay).toHaveBeenCalledTimes(4)
    })
  })

  describe("unrestricted loop", () => {
    it("should not stop until interrupted", async () => {
      let loopManager = new LoopManager(player)

      const loop = loopManager.loop(1, 5)

      // Force the event loop to move before we clear to allow the code in the
      // loop promise to run and set the intervalId used for the check of clear
      // FIXME: Extremely hacky and I don't completely understand why this works
      // nor have the time. For now and for this test I'll leave it until I read
      // more about it.
      await new Promise(jest.requireActual("timers").setImmediate);

      jest.advanceTimersByTime(500)
      await loopManager.clear()

      await expect(loop).rejects.toMatch("Cancelled manually")
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
          expect(LoopManager.settingRange(4.0, 7.0, 7.0)).toEqual([4.0,7.0])
        })
      })
    })
  })
})
