"use strict";

import { Controller } from "@hotwired/stimulus";
import { PlayingState, ReadyState, EditingState, PickingPointState } from "controllers/player/state";
import LoopManager from "controllers/player/loop_manager"
import YoutubePlayer from "controllers/player/youtube_player";
import DummyPlayer from "controllers/player/dummy_player";
import { debug, debounce, show, Env } from "controllers/util";
import { ZoomType } from "controllers/zoom"

/** Controller for the YouTube player custom functionality */
export default class extends Controller {
  static values = {
    start: Number,
    end: Number,
    videoId: String,
    edit: Boolean
  }

  /** @property {YoutubePlayer} PlayerController.player */
  player;

  /**
   * Edit state definition
   *
   * @typedef {Object} EditState
   * @property {!number} start
   * @property {!number} end
   * @property {?number} setting
   * @property {?boolean} zooming
   */

  /** @type {EditState} */
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
    debug("Connect")
    this.#initPlayer().then(player => {
      debug("init player", player)
      // Set the player
      this.player = player

      // Init the loop manager
      this.loopManager = new LoopManager(this.player)

      // With the Player and Loop manager initialized we're ready to rumble
      this.state = this.readyState
    })

    // INFO: We do our own player-related thing despite the fact that we're
    // reacting to a section turbo-stream event.
    document.documentElement.addEventListener('turbo:submit-end', this.#onSectionSave)
    document.documentElement.addEventListener('turbo:before-fetch-request', this.#onSectionCancel)
  }

  initialize() {
    this.updatePoints = debounce(this.updatePoints.bind(this), 1000)
    this.#initStates()
  }

  /**
   * Load a video in the youtube player. Used to override the initialization of
   * the player and to show it. Used on Lesson creation.
   */
  load({detail: { url }}) {
    try {
      this.player.load(url)
      show(this.element.children[0])
      this.state = this.readyState
    }
    catch (error) {
      console.error(error)
    }
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

    // Disable the fields here and enable them after the clear
    this.loopManager.clear().then(() => {
      switch(this.state.zoom) {
        case ZoomType.In:
          this.state = this.editingState
        break;
        case ZoomType.Out:
          this.state = this.pickingPointState
        break;
        default:
          this.state = this.pickingPointState
      }
      const [start, end] =
        LoopManager.settingRange(this.editState.start, this.editState.end, this.editState.setting)

      this.loop(start, end)
    })
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
  #onSectionSave = (e) => {
    switch(e.target.dataset.name) {
      case "section":
        debug("Section event")
        this.dispatch("zoomCancelled")
        this.reset()
      break
      case "zoom-in":
        this.dispatch("resetRange")
      break;
    }
  }

  /*
   * Callback for the event triggered when section playback/edition is cancelled
   */
  #onSectionCancel = (e) => {
    debug("cancelled", e)
    if (e.target.id === "sections") {
      debug("section cancelled")
      const r = this.#isSectionEditPath(e.detail.url.pathname)
      debug("is the path?", r)

      if(!this.#isSectionEditPath(e.detail.url.pathname) && !this.#isSectionNewPath(e.detail.url.pathname)) {
        debug("onSectionCancel is being fired and resetting everything", e)
        this.reset()
        this.dispatch("zoomCancelled")
      }
    }
  }

  /*
   * Initialize the adequate player based on the environment
   *
   * Checks the rails_env and is_cypress properties in the Window object to
   * determine which player to use. These properties are set on load in the
   * practice layout.
   *
   * @return {Promise<Player>} The player Promise
   *
   */
  #initPlayer() {
    debug("env", window.rails_env)
    switch(window.rails_env) {
      case Env.Prod:
        return YoutubePlayer.create(this.#mkYTPlayerParams())
      case Env.Dev:
        if(window.is_cypress === "true") {
          return DummyPlayer.create(this.#mkDummyParams())
        } else {
          return YoutubePlayer.create(this.#mkYTPlayerParams())
        }
      case Env.Test:
        return DummyPlayer.create(this.#mkDummyParams())
      default:
        return DummyPlayer.create(this.#mkDummyParams())
    }
  }

  /*
   * The paramateres to initialize the Youtube Player
   */
  #mkYTPlayerParams() {
    return {
      videoId: this.videoIdValue,
      edit: this.editValue,
      containerOffsetHeight: this.element.offsetHeight,
      // WARN: This might not be a good idea
      onPause: () => {},
      // FIXME: This should be fired only once but it's firing every time the
      // youtube player starts replaying/looping. Duration is only guaranteed
      // to be available when video metadata is loaded, which happens on first
      // play only.
      onPlaying: () => {
        // Dispatch to the lesson controller (if connected) that we've
        // successfully loaded and played the video
        this.dispatch("videoLoaded")

        if(this.hasDurationTarget) {
          this.durationTarget.value = parseInt(this.player.duration)
        }
      },
      onLoadError: () => {
        this.dispatch("videoLoadFailed")
      },
    }
  }

  /*
   * The parameters to initialize the Dummy Player
   */
  #mkDummyParams() {
    return {
      currentTime: 0,
      duration: 500,
      onPlaying: () => {
        this.dispatch("videoLoaded")
        if(this.hasDurationTarget) {
          this.durationTarget.value = parseFloat(this.player.duration)
        }
      },
      onLoadError: () => {
        this.dispatch("videoLoadFailed")
      },
    }
  }

  /*
   * Check if an URL path matches the section edit route
   *
   * @param {!string} - The url path
   * @return {boolean}
   */
  #isSectionEditPath = (urlPath) => {
    debug("path", urlPath)
    const r = /\/sections\/\d+\/edit$/
    return r.test(urlPath)
  }

  /*
   * Check if an URL path matches the section new route
   *
   * @param {!string} - The url path
   * @return {boolean}
   */
  #isSectionNewPath = (urlPath) => {
    debug("path", urlPath)
    const r = /\/sections\/new$/
    return r.test(urlPath)
  }
}
