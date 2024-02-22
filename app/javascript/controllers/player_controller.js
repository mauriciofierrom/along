import { Controller } from "@hotwired/stimulus";
import YoutubePlayer from "controllers/youtube_player";

export default class extends Controller {
  static values = {
    start: Number,
    end: Number,
    loop: Boolean,
    videoId: String,
    edit: Boolean
  }

  player;
  loaded;
  endIntervalId;
  startPending;
  endPending;
  settingCount = 3;
  resetting = false;
  setting = false;
  startLoaded = false;
  endLoaded = false;
  editState = { };

  static targets = [ "source", "duration" ]

  connect() {
    var tag = document.createElement('script')

    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  initialize() {
    const [width, height] = this.#calculateSize(this.element)

    window.onYouTubeIframeAPIReady = () => {
      this.loaded = true
      this.player = new YoutubePlayer({
        width: width,
        height: height,
        videoId: this.videoIdValue,
        edit: this.editValue,
        onPause: () => {
          clearInterval(this.endIntervalId)
          this.endIntervalId = null
        }
      })
    }

    document.documentElement.addEventListener('turbo:submit-end', (e) => {
      this.editValue = false
      this.resetPlayer()
    })

    document.documentElement.addEventListener('turbo:before-fetch-request', (e) => {
      console.log(`turbo:before-fetch-request target: ${e.srcElement.id}`)

      if (e.srcElement.id === "sections") {
        console.log(`turbo:before-fetch-request sections in -${this.edit ? "edit" : "playback"} mode-`)
        this.edit = false;
        console.log(`Edition mode after sections request ${this.edit}`)
        this.resetPlayer()
        // if (!this.edit) {
        //   this.resetPlayer()
        // }
      }
    })
  }

  load() {
    this.durationTarget.value = "";
    try {
      let formattedUrl = this.#formatUrl(this.sourceTarget.value)
      this.player.load(formattedUrl)
      this.durationTarget.value = this.player.duration
      this.element.children[0].style = "";
    }
    catch (error) {
      console.log(error)
    }
  }

  loop() {
    this.endIntervalId = setInterval(() => {
      if (this.editValue) {
        console.log(this.setting)

        console.log(`loop editing: ${this.editState.start} ${this.editState.end}`)
        if (this.player.currentTime >= this.editState.end) {
          // If we're setting a value we check the 3-time counter and
          // we reset it and the pending values
          if(this.setting) {
            this.settingCount--
            if (this.settingCount <= 0) {
              switch (this.editState.setting) {
                case this.editState.start:
                  console.log("restoring edit end")
                  this.editState.end = this.editState.pending
                  break
                case this.editState.end:
                  console.log("restoring edit start")
                  this.editState.start = this.editState.pending
                  break
              }
              this.#resetSettingCount()
              this.setting = false
            }
          }

          this.player.play(this.editState.start)

          }
      } else {
        if (this.player.currentTime >= this.endValue) {
          this.player.play(this.startValue)
        }
      }
    }, 500)
  }

  // Used as a reference from other controllers. Allows overriding the startValue/endValue
  // values. Used from sections
  playFromTo({ detail: { start, end } }) {
    console.log("playFromTo")

    this.startValue = start
    this.endValue = end

    // Play
    this.play(this.startValue)
  }

  resetPlayer(_e) {
    console.log("resetPlayer")
    this.player.pause()

    // Besides cleaning all intervals when starting playing, we clear the
    // interval when the player is reset externally to protect against external
    // mutations
    if(this.endIntervalId != null && this.endIntervalId != undefined) {
      console.log(`Clearing interval ${this.endIntervalId}`)
      clearInterval(this.endIntervalId)
      console.log(`Cleared interval ${this.endIntervalId}`)
      this.endIntervalId = null
    }

    this.#resetSettingCount()

    this.endValue = parseFloat(this.element.dataset.endValue)

    console.log(`on reset player startValue: ${this.startValue} endValue: ${this.endValue}`)
  }

  #formatUrl(url) {
    let baseUrl = "https://youtu.be/v"
    let parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }

  #resetSettingCount() {
    // this.setting = false
    this.settingCount = 3;
  }

  #reset () {
    this.resetting = true

    // Reset the loop if there's one ongoing
    if(this.endIntervalId != null && this.endIntervalId != undefined) {
      console.log(`Clearing interval ${this.endIntervalId}`)
      clearInterval(this.endIntervalId)
      console.log(`Cleared interval ${this.endIntervalId}`)
      this.endIntervalId = null
    }

    // Reset the setting count
    this.#resetSettingCount()

    // We restore the original start/end values

    this.resetting = false
  }

  #calculateSize(container) {
    const baseWidth = 480
    const baseHeight = 270
    let targetHeight = container.offsetHeight

    return [targetHeight * baseWidth / baseHeight, targetHeight]
  }

  editValueChanged () {
    if (this.editValue) {
      this.player.play(this.editState.start)
    }
  }

  // On range connect we trigger edition by setting the editValue to true and
  // feeding the initial values to edit.
  // This will not include the 'setting' key in the state object
  triggerEdition({ detail: state }) {
    this.editValue = true
    this.editState = state

    // Loop will start after play
    this.play(this.editState.start)
  }

  // Triggered by the range controller when a value is changed
  updatePoints({ detail: state }) {
    console.log(`Player: update points: ${this.editState.start} - ${this.editState.end}. Setting: ${this.editState.setting}`)

    this.editState = state
    console.log(this.editState)
    this.setting = true

    switch(this.editState.setting) {
      case this.editState.start:
        console.log("setting start")
        this.editState.pending = this.editState.end
        this.editState.end = Math.max(this.player.duration, this.editState.start + 3)
        break
      case this.editState.end:
        console.log("setting end")
        this.editState.pending = this.editState.start
        this.editState.start = Math.max(this.editState.end - 3, 0)
        break
    }

    console.log(`Playing with: ${this.editState.start} - ${this.editState.end}`)
    this.play(this.editState.start)
  }

  play(start) {
    this.#reset()
    this.player.play(start)
    this.loop()
  }
}
