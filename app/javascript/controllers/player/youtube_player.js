import { debug } from "controllers/util";

/** A class to encapsulate the YouTube player */
export default class YoutubePlayer {
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
    this.#player = new YT.Player('player', {
        width: params.width.toString(),
        height: params.height.toString(),
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
          }
        }
      })
  }

  /**
   * Get the duration of the current loaded video
   *
   * @return {number} The duration
   */
  get duration() {
    return this.#player.getDuration()
  }

  /**
   * Get the current playback point in time
   *
   * @return {number} The current point in time
   */
  get currentTime() {
    return this.#player.getCurrentTime()
  }

  /**
   * Load a video using the provided URL
   *
   * @param {!string} url - A valid YouTube URL to load
   */
  load(url) {
    this.#player.loadVideoByUrl(url)
  }

  /**
   * Play the video starting at the provided point
   *
   * @param {!number} from - The starting point for playback
   */
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
}
