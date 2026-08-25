export const PlaybackErrorType = Object.freeze({
  LoopClear: "loop_clear",
  PlayerRestriction: "player_restriction",
})

export class PlaybackError extends Error {
  constructor(type, message, details = {}) {
    super(message)
    this.name = "PlaybackError"
    this.type = type
    this.details = details
  }
}
