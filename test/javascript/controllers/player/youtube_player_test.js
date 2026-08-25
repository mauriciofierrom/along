/* global global */
import YoutubePlayer from "controllers/player/youtube_player"
import { PlayerRestriction } from "controllers/player/player"
import { PlaybackErrorType } from "controllers/player/error"

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
        getVideoUrl: () => "https://youtube.com/?v=wwwww12",
        seekTo: jest.fn(),
      })),
    }
    threeHoursAgo = Date.now() - 3 * 3600 * 1000
  })

  describe("canPlay", () => {
    describe("when manual play was performed recently", () => {
      it("plays normaly and resolves", async () => {
        const ytPlayer = new YoutubePlayer({
          containerOffsetHeight: 200,
          userId: 1,
        })

        localStorage.setItem("wwwww12_1", threeHoursAgo + 3600)

        await expect(ytPlayer.canPlay()).resolves.toBe(undefined)
      })
    })

    describe("when manual play has not been performed recently", () => {
      it("plays normaly and resolves", async () => {
        const ytPlayer = new YoutubePlayer({
          containerOffsetHeight: 200,
          userId: 1,
        })

        localStorage.setItem("wwwww12_1", threeHoursAgo - 3600)

        await expect(ytPlayer.canPlay()).rejects.toMatchObject({
          name: "PlaybackError",
          type: PlaybackErrorType.PlayerRestriction,
          message: "Player restriction",
          details: {
            restriction: PlayerRestriction.UserActionRequired,
          },
        })
      })
    })
  })
})
