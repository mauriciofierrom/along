/* global global */
import YoutubePlayer from "controllers/player/youtube_player"
import { PlayerRestriction } from "controllers/player/player"
import { PlaybackErrorType } from "controllers/player/error"

jest.useFakeTimers()

describe("YoutubePlayer", () => {
  let threeHoursAgo
  let cueVideoByUrlSpy

  beforeEach(() => {
    cueVideoByUrlSpy = jest.fn()
    global.YT = {
      Player: jest.fn().mockImplementation(() => ({
        loadVideoById: jest.fn(),
        playVideo: jest.fn(),
        pauseVideo: jest.fn(),
        stopVideo: jest.fn(),
        getVideoUrl: () => "https://youtube.com/?v=wwwww12",
        seekTo: jest.fn(),
        cueVideoByUrl: cueVideoByUrlSpy,
      })),
    }
    threeHoursAgo = Date.now() - 3 * 3600 * 1000
  })

  describe("load", () => {
    let ytPlayer
    beforeEach(() => {
      ytPlayer = new YoutubePlayer({
        containerOffsetHeight: 200,
        userId: 1,
      })
    })

    describe("when the URL is malformed", () => {
      it("throws an exception", () => {
        expect(() => ytPlayer.load("/some-thing/path")).toThrow(/Invalid URL/)
      })
    })

    describe("when the URL is valid but not a YouTube share URL", () => {
      it("throws an exception", () => {
        expect(() => ytPlayer.load("https://some.com")).toThrow(
          /Invalid YouTube URL/,
        )
      })
    })

    describe("when the URL is valid and a YouTube share URL", () => {
      it("returns the formatted URL", () => {
        expect(() =>
          ytPlayer.load("https://youtu.be/dQw4w9WgXcQ?si=iGATlB1XD5Y8UME4"),
        ).not.toThrow()
        expect(cueVideoByUrlSpy).toHaveBeenCalledWith(
          "https://youtu.be/v/dQw4w9WgXcQ",
        )
      })
    })
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
