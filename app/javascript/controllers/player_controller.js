import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  player;
  loaded;
  start;
  end;
  loop;
  videoId;
  endIntervalId;
  settingEnd;
  settingStart;
  startPending;
  endPending;
  settingCount = 3;
  edit = false;

  static targets = [ "source", "duration" ]

  connect() {
    var tag = document.createElement('script')

    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  initialize() {
    this.videoId = this.element.dataset.videoId
    this.loop = this.element.dataset.loop === "true" ? true : false
    this.start = parseFloat(this.element.dataset.start) || 0.00
    this.end = parseFloat(this.element.dataset.end)
    this.edit = this.element.dataset.edit === "true" ? true : false
    const [width, height] = this.#calculateSize(this.element)

    window.onYouTubeIframeAPIReady = () => {
      this.loaded = true
      this.player = new YT.Player('player', {
        width: width.toString(),
        height: height.toString(),
        videoId: this.videoId || '',
        playerVars: {
          'autoplay': this.edit,
          'disablekb': 1,
          'controls': 0,
          'start': this.start || 0
        },
        events: {
          'onReady': (evt) => {
          },
          'onStateChange': (evt) => {
            console.log(`Youtube state: ${evt.data}`)
            switch (evt.data) {
              case YT.PlayerState.PLAYING:
                if (this.hasDurationTarget)
                  this.durationTarget.value = Math.floor(this.player.getDuration())
                this.onPlaying()
                break;
              case YT.PlayerState.ENDED:
                console.log("player ended")
                if (this.loop) {
                  this.player.seekTo(this.start, true)
                  this.player.playVideo()
                }
                break;
              case YT.PlayerState.PAUSED:
                clearInterval(this.endIntervalId)
                this.endIntervalId = null
                break;
              default:
            }
          },
          'onError': (evt) => {
            consolelog(`error: ${evt.data}`)
          }
        }
      })
    }

    document.documentElement.addEventListener('turbo:before-fetch-request', (e) => {
      console.log(`turbo:before-fetch-request target: ${e.srcElement.id}`)

      // if (e.srcElement.id === "sections") {
      //   console.log(`turbo:before-fetch-request sections in -${this.edit ? "edit" : "playback"} mode-`)
      //   this.edit = false;
      //   console.log(`Edition mode after sections request ${this.edit}`)
      //   // this.resetPlayer()
      //   // if (!this.edit) {
      //   //   this.resetPlayer()
      //   // }
      // }
    })

    document.documentElement.addEventListener('turbo:submit-end', (e) => {
      console.log("turbo:submit-end")
      this.edit = !this.edit
      this.resetPlayer()
    })
  }

  load() {
    this.durationTarget.value = "";
    try {
      let formattedUrl = this.#formatUrl(this.sourceTarget.value)
      this.player.loadVideoByUrl(formattedUrl)
      this.durationTarget.value = this.player.getDuration()
      this.element.children[0].style = "";
    }
    catch (error) {
      console.log(error)
    }
  }

  startEndCheck(player, endTime) {
    console.log(`startEndCheck loop`)
    return setInterval(() => {
      console.log(`Loop with start: ${this.start} end: ${this.end}`)
      if (this.player.getCurrentTime() >= this.end) {
        if (this.edit) {
          this.settingCount--
          if (this.settingCount === 0) {
            this.#resetSettingCount()
            this.settingStart = false
            this.settingEnd = false

            if (this.endPending != null && this.endPending != undefined) {
              this.end = this.endPending
              this.endPending = null
            }

            if (this.startPending != null && this.startPending != undefined) {
              this.start = this.startPending
              this.startPending = null
            }

          }
        }

        // This triggers a PLAYING event in the Youtube player again, which
        // re-triggers the onPlaying event which re-creates the interval without
        // clearing it first.
        console.log("seekTo from the loop (interval)")
        this.player.seekTo(this.start, true)
        this.player.playVideo()
      }
    }, 500)
  }

  // Used as a reference from other controllers. Allows overriding the start/end
  // values. Used from sections
  playFromTo(start, end) {
    console.log(`Play from: ${start} to: ${end}`)
    console.log(`Mode: ${ this.edit ? "edit" : "playback" }`)
    this.#resetPlayback()

    if (this.edit)
    {
      console.log("Setting start/end in edit mode")
      if (this.start !== start) {
        console.log(`Start changed: from ${this.start} to ${start}`)
        this.settingEnd = false
        this.settingStart = true
        this.endPending = end
        this.start = start
        this.end = start + 3 // TODO: Check that the end isn't reached
      }

      if (!this.settingStart && this.end !== end) {
        console.log(`End changed: from ${this.end} to ${end}`)
        this.settingStart = false
        this.settingEnd = true
        this.startPending = start
        this.end = end
        this.start = end - 3 // TODO: Check that the value isn't negative
      }
    } else {
      console.log(`Setting start not in edit mode: ${start} end: ${end}`)
      this.start = start
      this.end = end
    }

    console.log("seekTo from the playFromTo method")
    this.player.seekTo(this.start, true)
    this.player.playVideo()
  }

  onPlaying() {
    console.log(`on playing start: ${this.start} end: ${this.end}`)

    if(this.endIntervalId != null && this.endIntervalId != undefined) {
      console.log(`Clearing interval ${this.endIntervalId}`)
      clearInterval(this.endIntervalId)
      this.endIntervalId = null
      console.log(`Cleared interval`)
    }

    this.#resetSettingCount()

    this.endIntervalId = this.startEndCheck(this.player, this.end)
    console.log(`Starting interval ${this.endIntervalId}`)
  }

  resetPlayer() {
    this.player.pauseVideo()
    this.player.seekTo(0)

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

    this.start = 54.0
    // this.start = parseFloat(this.element.dataset.start) || 0.00
    this.end = parseFloat(this.element.dataset.end)

    console.log(`on reset player start: ${this.start} end: ${this.end}`)
  }

  #formatUrl(url) {
    let baseUrl = "https://youtu.be/v"
    let parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }

  #resetSettingCount() {
    this.settingCount = 3;
  }

  #resetPlayback() {
    console.log("Reset playback")
    console.log(`Start pending: ${this.startPending}`)
    console.log(`End pending: ${this.endPending}`)

    if(this.startPending != null && this.startPending != undefined) {
      console.log("start pending")
      this.start = this.startPending
      this.startPending = null
      this.settingStart = false
    }

    if(this.endPending != null && this.endPending != undefined) {
      console.log("end pending")
      this.end = this.endPending
      this.endPending = null
      this.settingEnd = false
    }
  }

  #calculateSize(container) {
    const baseWidth = 480
    const baseHeight = 270
    let targetHeight = container.offsetHeight

    return [targetHeight * baseWidth / baseHeight, targetHeight]
  }
}
