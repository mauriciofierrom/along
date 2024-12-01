import { debug } from "controllers/util";
import Player from "controllers/player/player";

/** A class to encapsulate the YouTube player */
export default class extends Player {
  /** @property {Player} player - The Youtube player */
  #player;

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
   * @property {OnPlayerPause} onPause - Callback when the player is paused
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

    this.#player = new YT.Player('player', {
      width: width.toString(),
      height: height.toString(),
      videoId: params.videoId || '',
      playerVars: {
        'autoplay': params.edit,
        'disablekb': 1,
        'controls': 0,
        'startValue': 0
      },
      events: {
        'onReady': params.onReady,
        'onStateChange': (evt) => {
          debug(`Youtube state: ${evt.data}`)
          switch (evt.data) {
            case YT.PlayerState.PAUSED:
              params.onPause()
              break
            case YT.PlayerState.PLAYING:
              params.onPlaying()
              break
          }
        },
        'onError': (evt) => {
          console.error(`error: ${evt.data}`)
          switch(evt.data) {
            case 101:
              params.onLoadError()
            break
            case 150:
              params.onLoadError()
            break
            default:
              debug(`Unprocessed error: ${evt.data}`)
          }
        }
      }
    })
 }

  get duration() {
    return this.#player.getDuration()
  }

  get currentTime() {
    return this.#player.getCurrentTime()
  }

  /**
   * Load a video using the provided URL
   *
   * @param {!string} url - A valid YouTube URL to load
   */
  load(url) {
    const formattedUrl = this.#formatUrl(url)
    this.#player.loadVideoByUrl(formattedUrl)
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

  static async create(params) {
    return new Promise(resolve => {
      var tag = document.createElement('script')
      let player
      let newParams = params
      newParams.onReady = () => {
        resolve(player)
      }

      tag.src = "https://www.youtube.com/iframe_api"
      var firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

      if(window && window.YT) {
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
    let targetHeight = containerOffsetHeight

    return [targetHeight * baseWidth / baseHeight, targetHeight]
  }

  /**
   * Format a YouTube url (probably from the URL in the browser) to create a url
   * to use to load a video in the player
   *
   * @param {string} url The url to format
   * @return {string} The formatted url
   */
  #formatUrl(url) {
    let baseUrl = "https://youtu.be/v"
    let parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }
}
