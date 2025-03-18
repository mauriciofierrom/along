/* global YT */
import { debug } from "controllers/util"
import Player, { PlayerRestriction } from "controllers/player/player"

/** A class to encapsulate the YouTube player */
export default class extends Player {
  /** @property {Player} player - The Youtube player */
  #player
  #userId

  /**
   * @callback OnPlayerReady
   */

  /**
   * @callback OnPlayerPause
   */

  /**
   * @callback OnPlayerPlaying
   */

  /**
   * @typedef {Object} YoutubePlayerParams
   * @property {number} width - The width of the player
   * @property {number} height - The height of the player
   * @property {string} videoId - The id of the YouTube video
   * @property {boolean} edit - Whether we're in edition mode
   * @property {OnPlayerReady} onReady - Callback when the player is ready
   * @property {OnPlayerPlaying} onPlaying - Callback when the player is playing
   */

  /**
   * Creates a YoutubePlayer wrapper
   *
   * @param {YoutubePlayerParams} params - The parameters to configure the
   * player with
   */
  constructor(params) {
    super()

    const [width, height] = this.#calculateSize(params.containerOffsetHeight)
    this.onLoadError = params.onLoadError
    this.#userId = params.userId

    this.#player = new YT.Player("player", {
      width: width.toString(),
      height: height.toString(),
      videoId: params.videoId || "",
      playerVars: {
        autoplay: false,
        disablekb: 1,
        controls: 0,
        startValue: 0,
      },
      events: {
        onReady: params.onReady,
        onStateChange: (evt) => {
          debug(`Youtube state: ${evt.data}`)
          switch (evt.data) {
            case YT.PlayerState.CUED:
              debug(evt.data)
              debug("duration", this.#player.getDuration())
              params.onCue()
              break
            case YT.PlayerState.PLAYING:
              // INFO: If we got to playing that means we went past the
              // restriction to play dynamically, so we set the value in local
              // storage to setup subsequent checks
              if (!this.#hasPlayedManually()) {
                debug("setting the played manually value")
                localStorage.setItem(this.#manualPlayKey(), Date.now())
                params.onRestrictionLifted()
              }

              params.onPlaying()
              break
          }
        },
        onError: (evt) => {
          console.error(`error: ${evt.data}`)
          switch (evt.data) {
            case 101:
              params.onLoadError()
              break
            case 150:
              params.onLoadError()
              break
            default:
              debug(`Unprocessed error: ${evt.data}`)
          }
        },
      },
    })
  }

  get duration() {
    return this.#player.getDuration()
  }

  get currentTime() {
    return this.#player.getCurrentTime()
  }

  canPlay() {
    debug("can it play", this.#hasPlayedManually())
    return new Promise((resolve, reject) => {
      if (this.#hasPlayedManually()) {
        debug("Has played manually")
        resolve()
      } else {
        reject(
          JSON.stringify({
            restriction: PlayerRestriction.UserActionRequired,
            message: `You must play manually to make it count towards the video creator's view count. <a href="">Learn more</a>`,
          }),
        )
      }
    })
  }

  /**
   * Load a video using the provided URL
   *
   * @param {!string} url - A valid YouTube URL to load
   */
  load(url) {
    const formattedUrl = this.#formatUrl(url)
    this.#player.cueVideoByUrl(formattedUrl)
  }

  play(from) {
    this.#player.seekTo(from, true)
    this.#player.playVideo()
  }

  /**
   * Pause the video
   *
   * Stopping is documented as being a state that's rather final so it should be
   * avoided. We use the pause function to stop playback and we seek to the
   * beginning of the video to try and simulate a stop.
   *
   */
  pause() {
    this.#player.pauseVideo()
    this.#player.seekTo(0)
  }

  static create(params) {
    return new Promise((resolve) => {
      const tag = document.createElement("script")
      let player
      const newParams = params
      newParams.onReady = () => {
        resolve(player)
      }

      tag.src = "https://www.youtube.com/iframe_api"
      const firstScriptTag = document.getElementsByTagName("script")[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      if (window && window.YT) {
        player = new this(newParams)
      } else {
        window.onYouTubeIframeAPIReady = () => {
          player = new this(newParams)
        }
      }
    })
  }

  /**
   * Calculate the size of the player relative to the base width and height
   * values recommended for it and the current size of the container of the
   * player.
   *
   * @param {Element} The controller's element
   * @return {number[]} A tuple (a 2-element list) with the width and height
   */
  #calculateSize(containerOffsetHeight) {
    const baseWidth = 480
    const baseHeight = 270
    const targetHeight = containerOffsetHeight

    return [(targetHeight * baseWidth) / baseHeight, targetHeight]
  }

  /**
   * Format a YouTube url (probably from the URL in the browser) to create a url
   * to use to load a video in the player
   *
   * As per the docs it requires "A fully qualified YouTube player URL in the format
   * http://www.youtube.com/v/VIDEO_ID?version=3". We skip the last part until
   * it is actually required.
   *
   * @param {string} url The url to format
   * @return {string} The formatted url
   */
  #formatUrl(url) {
    const baseUrl = "https://youtu.be/v"
    const parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }

  /**
   * The key to store to indicate the restriction for the video and the user.
   * It's formed from the videoId and the user id concatenated to ensure this
   * check works only for this particular video and this particular user.
   *
   * Since the URL is taken from the youtube player we adhere to its format:
   *
   * https://www.youtube.com/watch?t=1&v=dQw4w9WgXcQ
   *
   * @return {string} An unique identifier for a video and a user
   */
  #manualPlayKey() {
    const videoId = new URL(this.#player.getVideoUrl()).searchParams.get("v")

    return `${videoId}_${this.#userId}`
  }

  #hasPlayedManually() {
    debug(this.#manualPlayKey())
    const manualPlayRecord = localStorage.getItem(this.#manualPlayKey())

    debug("Manual play record", manualPlayRecord)

    if (manualPlayRecord) {
      const manuallyPlayedAt = parseInt(manualPlayRecord, 10)
      debug("last played manually at", manuallyPlayedAt)
      const now = Date.now()

      return now - manuallyPlayedAt < 3600 * 3 * 1000
    } else {
      debug("no manual play record")
      return false
    }
  }
}
