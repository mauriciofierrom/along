import YoutubePlayer from "../../../../app/javascript/controllers/player/youtube_player"
import { PlayerRestriction } from "../../../../app/javascript/controllers/player/player"


jest.useFakeTimers()

describe("YoutubePlayer", () => {
  let threeHoursAgo

  beforeEach(() => {
    global.YT = {
      Player: jest.fn().mockImplementation(() => ({
        loadVideoById: jest.fn(),
        playVideo: jest.fn(),
        pauseVideo: jest.fn(),
        stopVideo: jest.fn(),
        getVideoUrl: () => "https://youtube.com/something" ,
        seekTo: jest.fn()
      })),
    }
    threeHoursAgo = Date.now() - (3 * 3600 * 1000)
  })

  describe("canPlay", () => {
    describe("when manual play was performed recently", () => {
      it("plays normaly and resolves", async () => {
        const ytPlayer = new YoutubePlayer({
          containerOffsetHeight: 200,
          userId: 1
        })

        localStorage.setItem("https://youtube.com/something_1", threeHoursAgo + 3600)

        await expect(ytPlayer.canPlay()).resolves
      })
    })

    describe("when manual play has not been performed recently", () => {
      it("plays normaly and resolves", async () => {
        const ytPlayer = new YoutubePlayer({
          containerOffsetHeight: 200,
          userId: 1
        })

        localStorage.setItem("https://youtube.com/something_1", threeHoursAgo - 3600)

        await expect(ytPlayer.canPlay()).rejects.toMatch(JSON.stringify({
          restriction: PlayerRestriction.UserActionRequired,
          message: "You must play manually to make it count towards the video creator's view count. <a href=\"\">Learn more</a>",
        }))
      })
    })

  })
})
