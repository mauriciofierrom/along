"use strict";

import { Controller } from "@hotwired/stimulus";
import YoutubePlayer from "./player/youtube_player";
import { PlayingState, ReadyState, EditingState, PickingPointState } from "./player/state";
import LoopManager from "./player/loop_manager"

/** Controller for the YouTube player custom functionality */
export default class extends Controller {
  static values = {
    start: Number,
    end: Number,
    videoId: String,
    edit: Boolean
  }

  /** @property {YoutubePlayer} */
  player;

  /**
   * Edit state definition
   *
   * @typedef {Object} EditState
   * @property {number} start
   * @property {number} end
   * @property {number=} setting
   */
  editState = { };

  /** @property {LoopManager} */
  loopManager;

  /** @property {PlayerState} */
  state;

  // States

  /** @property {ReadyState} */
  readyState;

  /** @propery {PlayingState} */
  playingState;

  /** @propery {EditingState} */
  editingState;

  /** @property {SavingState} */
  savingState;

  /** @property {PickingPointState} */
  pickingPointState;

  static targets = [ "source", "duration" ]

  connect() {
    var tag = document.createElement('script')

    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)

    window.onYouTubeIframeAPIReady = this.#onYoutubeReady

    // INFO: We do our own player-related thing despite the fact that we're
    // reacting to a section turbo-stream event.
    document.documentElement.addEventListener('turbo:submit-end', this.#onSectionSave)
    document.documentElement.addEventListener('turbo:before-fetch-request', this.#onSectionCancel)
  }

  initialize() {
    this.#initStates()
  }

  /**
   * Load a video in the youtube player. Used to override the initialization of
   * the player and to show it. Used on Lesson creation.
   */
  load() {
    try {
      let formattedUrl = this.#formatUrl(this.sourceTarget.value)
      this.player.load(formattedUrl)
      this.element.children[0].style = "";
    }
    catch (error) {
      console.log(error)
    }

    this.state = this.readyState
  }

  /**
   * Start playback in loop between the two provided points. Delegates to the
   * current state.
   *
   * @param {number} start - The starting value
   * @param {number} end - The ending value
   */
  async loop(start, end) {
    this.state.loop(start, end)
  }

  /**
   * Starts a loop between the two provided points. Meant to be called from
   * another controller to start regular playback, like in section loading.
   *
   * @param {Object} obj payload object for the event
   * @param {Object} obj.detail key that actually has the payload
   * @param {number} obj.detail.start the starting point
   * @param {number} obj.detail.end the ending point
   */
  playFromTo({ detail: { start, end } }) {
    this.state = this.playingState
    this.loop(start, end)
  }

  /**
   * Reset the player by delegating to the current state
   */
  reset () {
    this.state.reset()
  }

  /**
   * Start edition mode of a section. Meant to be called from another controller
   * via dispatch.
   *
   * @param {Object} editState payload object for the event
   * @param {Object} editState.detail key that actually has the payload
   * @param {number} editState.detail.start the starting point
   * @param {number} editState.detail.end the end point
   */
  triggerEdition({ detail: state }) {
    this.editState = state
    this.state = this.editingState
    this.loop(this.editState.start, this.editState.end)
  }

  /**
   * Updates one of the points of the section that is being edited. Meant to be
   * called via dispatch from another controller.
   *
   * @param {Object} editState payload object for the event
   * @param {Object} editState.detail key that actually has the payload
   * @param {number} editState.detail.start the starting point
   * @param {number} editState.detail.end the end point
   * @param {number} editState.detail.setting the point we're editing to be able
   * to discern between the two
   */
  updatePoints({ detail: state }) {
    this.editState = state
    this.state = this.pickingPointState

    switch(this.editState.setting) {
      case this.editState.start:
        this.loop(this.editState.start, Math.min(this.player.duration, this.editState.start + 3))
        break
      case this.editState.end:
        this.loop(Math.max(this.editState.end - 3, 0), this.editState.end)
        break
    }
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

  /**
   * Calculate the size of the player relative to the base width and height
   * values recommended for it and the current size of the container of the
   * player.
   *
   * @param {Element} The controller's element
   * @return {number[]} A tuple (a 2-element list) with the width and height
   */
  #calculateSize(container) {
    const baseWidth = 480
    const baseHeight = 270
    let targetHeight = container.offsetHeight

    return [targetHeight * baseWidth / baseHeight, targetHeight]
  }

  /**
   * The callback function to initialize the YoutubePlayer wrapper.
   */
  #onYoutubeReady = () => {
    const [width, height] = this.#calculateSize(this.element)

    this.player = new YoutubePlayer({
      width: width,
      height: height,
      videoId: this.videoIdValue,
      edit: this.editValue,
      // WARN: This might not be a good idea
      onPause: () => {},
      onPlaying: () => {
        // TODO: This is a float so check the backend
        if(this.hasDurationValue) {
          this.durationTarget.value = parseInt(this.player.duration)
        }
      }}
    )

    // Init the loop manager
    this.loopManager = new LoopManager(this.player)

    // With the Player and Loop manager initialized we're ready to rumble
    this.state = this.readyState
  }

  /**
   * Initializes the states with the controller as their context
   */
  #initStates = () => {
    // Initialize states
    this.readyState = new ReadyState(this)
    this.playingState = new PlayingState(this)
    this.editingState = new EditingState(this)
    this.pickingPointState = new PickingPointState(this)
  }

  /**
   * Callback for the event triggered when a section is saved
   */
  #onSectionSave = () => {
    this.reset()
  }

  /*
   * Callback for the event triggered when section playback/edition is cancelled
   */
  #onSectionCancel = (e) => {
    if (e.target.id === "sections") {
      this.reset()
    }
  }
}
