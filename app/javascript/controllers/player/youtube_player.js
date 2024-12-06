import { debug } from "controllers/util";
import Player, { PlayerRestriction } from "controllers/player/player";

/** A class to encapsulate the YouTube player */
export default class extends Player {
  /** @property {Player} player - The Youtube player */
  #player;
  #userId;

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
    this.#userId = params.userId

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
            case YT.PlayerState.CUED:
              debug(evt.data)
              debug("duration", this.#player.getDuration())
              params.onCue()
              break
            case YT.PlayerState.PAUSED:
              params.onPause()
              break
            case YT.PlayerState.PLAYING:
              // INFO: If we got to playing that means we went past the
              // restriction to play dynamically, so we set the value in local
              // storage to setup subsequent checks
              if(!this.#hasPlayedManually()) {
                debug("setting the played manually value")
                localStorage.setItem(this.#manualPlayKey(), Date.now())
              }
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

  async canPlay(from) {
    debug("can it play", this.#hasPlayedManually())
    return new Promise((resolve, reject) => {
      if(this.#hasPlayedManually()) {
        debug("Has played manually")
        resolve()
      } else {
        debug("hasn't played manually, rejecting")
        // We seek to the right value so that manual playback for the user still
        // starts at the desired point
        this.#player.seekTo(from, true)
        reject(JSON.stringify({
          restriction: PlayerRestriction.UserActionRequired,
          message: `You must play manually to make it count towards the video creator's view count. <a href="">Learn more</a>`
        }))
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

  async play(from) {
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

  #manualPlayKey = () => `${this.#player.getVideoUrl()}_${this.#userId}`

  #hasPlayedManually() {
    debug(this.#manualPlayKey())
    const manualPlayRecord =
      localStorage.getItem(this.#manualPlayKey())

    debug("Manual play record", manualPlayRecord)

    if(!manualPlayRecord) {
      debug("no manual play record")
      return false
    } else {
      const manuallyPlayedAt = parseInt(manualPlayRecord)
      debug("last played manually at", manuallyPlayedAt)
      const now = Date.now()

      return now - manuallyPlayedAt < 3600*3*1000
    }
  }
}
