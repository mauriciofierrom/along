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

      await expect(loop).rejects.toMatch("LoopManager: Cancelled manually")
    })
  })
})
