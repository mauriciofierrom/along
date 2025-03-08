/* eslint-disable no-unused-vars, require-await */

import { debug } from "controllers/util"

/** Abstract class for a PlayerState */
class PlayerState {
  /**
   * Constructs a PlayerState
   *
   * @param {PlayerController} context - The context the states operates on
   */
  constructor(context) {
    if (this.constructor === PlayerState) {
      throw new Error("Abstract class PlayerState cannot be instantiated")
    }

    this.context = context
  }

  /**
   * Resets the player
   */
  reset() {
    throw new Error("Abstract method reset must be implemented")
  }

  /**
   * Starts a loop between the provided points
   *
   * @param {!number} start - The starting point of the loop
   * @param {!number} end - The ending of the loop
   */
  async loop(_start, _end) {
    throw new Error("Abstract method loop must be implemented")
  }

  /**
   * What to do when the player starts playing
   */
  onPlaying() {
    throw new Error("Abstract method onPlaying must be implemented")
  }
}

/**
 *
 * Class for the Ready state
 * @extends PlayerState
 */
export class ReadyState extends PlayerState {
  async loop(from, to) {
    this.context.state = this.context.playingState
    return this.context.loopManager.loop(from, to)
  }

  reset() {
    debug("ReadyState: Nothing to reset")
  }

  onPlaying() {
    this.context.player.pause()
    this.context.loop(0, this.context.player.duration)
  }
}

export class PlayingState extends PlayerState {
  async loop(from, to) {
    return this.context.loopManager.loop(from, to)
  }

  reset() {
    this.context.loopManager.clear()
    this.context.player.pause()
    this.context.state = this.context.readyState
  }

  onPlaying() {
    debug("Already playing")
  }
}

export class EditingState extends PlayerState {
  async loop(from, to) {
    return this.context.loopManager.loop(from, to)
  }

  reset() {
    this.context.loopManager.clear()
    this.context.player.pause()
    this.context.state = this.context.readyState
  }

  onPlaying() {
    debug("Alrady playing in edit state")
  }
}

export class PickingPointState extends PlayerState {
  async loop(from, to) {
    debug("PickingPointState: Looping 3 times", {
      state: this.constructor.name,
      from,
      to,
    })
    await this.context.loopManager.loop(from, to, 1)
    debug(
      "PickingPointState: Done point looping. Doing editing loop:",
      this.context.editState,
    )
    this.context.state = this.context.editingState
    this.context.editState = { ...this.context.editState, setting: null }
    return this.context.loop(
      this.context.editState.start,
      this.context.editState.end,
    )
  }

  reset() {
    this.context.loopManager.clear()
    this.context.player.pause()
    this.context.state = this.context.readyState
  }

  onPlaying() {
    debug("Already playing in picking point state")
  }
}

export class UserActionRequiredState extends PlayerState {
  async loop(from, to) {
    await this.context.loopManager.loop(from, to)
    this.context.state = this.context.playingState
  }

  reset() {
    this.context.loopManager.clear()
    this.context.player.pause()
    this.context.state = this.context.readyState
  }

  onPlaying() {
    this.context.player.pause()
    this.context.loop(
      this.context.pendingLoop.start,
      this.context.pendingLoop.end,
    )
    this.context.pendingLoop = null
    this.context.state = this.context.playingState
  }
}
