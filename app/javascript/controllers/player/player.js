/* eslint-disable no-unused-vars, require-await */
/** A class to abstract over video players */
export default class Player {
  constructor() {
    if (this.constructor === "Player") {
      throw new Error("Abstract class Player cannot be instantiated")
    }
  }

  /**
   * Get the duration of the current loaded video
   *
   * @return {number} The duration
   */
  get duration() {
    throw new Error("Abstract field duration must be implemented")
  }

  /**
   * Get the current playback point in time
   *
   * @return {number} The current point in time
   */
  get currentTime() {
    throw new Error("Abstract field currentTime must be implemented")
  }

  /**
   * Get information on whether the player has finished loading
   *
   * @return {boolean}
   */
  get isLoaded() {
    throw new Error("Abstract field isLoaded must be implemented")
  }

  /*
   * Load a video in the player from an URL
   *
   * @param {!string} - The url pointing to the video
   *
   */
  load(_url) {
    throw new Error("Abstract method load must be implemented")
  }

  /*
   * Play the video starting from the specified point
   *
   * @param {!number} - The point in the video from which to start to play the
   * video. It must me < than the duration of the video.
   */
  play(_from) {
    throw new Error("Abstract method play must be implemented")
  }

  /*
   * Pause the video
   */
  pause() {
    throw new Error("Abstract method pause must be implemented")
  }

  /*
   * Can play
   *
   */
  async canPlay() {
    throw new Error("Abstract method canPlay must be implemented")
  }

  /*
   * A factory function to create the player based on the params
   *
   * @param {Object}
   * @return {Promise<Player>}
   */
  static async create(_params) {
    throw new Error("Abstract method prepare must be implemented")
  }
}

export const PlayerRestriction = {
  UserActionRequired: "user_action_required",
}
