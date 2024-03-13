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

      jest.runAllTimers()

      expect(mockPlay).toHaveBeenCalledTimes(4)
    })
  })

  describe("unrestricted loop", () => {
    it("should not stop until interrupted", async () => {
      let loopManager = new LoopManager(player)

      const loop = loopManager.loop(1, 5)

      jest.advanceTimersByTime(2500)
      loopManager.clear()
      jest.advanceTimersByTime(1000)

      await expect(loop).rejects.toMatch("LoopManager: Cancelled manually")
    })
  })
})
