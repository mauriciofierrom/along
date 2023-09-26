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
    this.start = this.element.dataset.start || 0.00
    this.end = this.element.dataset.end

    window.onYouTubeIframeAPIReady = () => {
      this.loaded = true
      this.player = new YT.Player('player', {
        width: '640',
        height: '390',
        videoId: this.videoId || '',
        playerVars: {
          'controls': 0,
        },
        events: {
          'onReady': (evt) => {
            console.log("ready")
          },
          'onStateChange': (evt) => {
            console.log(`state changed to: ${evt.data}. duration: ${this.player.getDuration()}`)
            switch (evt.data) {
              case YT.PlayerState.PLAYING:
                if (this.hasDurationTarget)
                  this.durationTarget.value = Math.floor(this.player.getDuration())

                this.onPlaying()

                break;
              case YT.PlayerState.ENDED:
                if (this.loop) {
                  this.player.seekTo(this.start)
                }
                break;
              case YT.PlayerState.PAUSED:
                clearInterval(this.endIntervalId)
                this.endIntervalId = null
                break;
              case YT.PlayerState.CUED:
                console.log(`Cued: ${this.player.getDuration()}`)
                break;
              case -1:
                console.log(`Unstarted: ${this.player.getDuration()}`)
                break;
              default:
                console.log("Not using this event yet")
            }
          },
          'onError': (evt) => {
            consolelog(`error: ${evt.data}`)
          }
        }
      })
    }
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
    console.log("startEndCheck")
    return setInterval(() => {
      if (this.player.getCurrentTime() >= this.end) {
        if (this.settingStart || this.settingEnd) {
          this.settingCount--
          if (this.settingCount == 0) {
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

            this.#resetSettingCount()
          }
        }
        this.player.seekTo(this.start)
      }
    }, 0.5)
  }

  // Used as a reference from other controllers. Allows overriding the start/end
  // values. Used from sections
  playFromTo(start, end) {
    console.log(`Play from: ${this.start} to: ${this.end}`)
    this.#resetPlayback()

    if (!this.settingEnd && this.start !== start) {
      console.log("start changed")
      this.settingEnd = false
      this.settingStart = true
      this.endPending = end
      this.start = start
      this.end = start + 3 // TODO: Check that the end isn't reached
    }

    if (!this.settingStart && this.end !== end) {
      console.log(`end changed: from ${this.end} to ${end}`)
      this.settingStart = false
      this.settingEnd = true
      this.startPending = start
      this.end = end
      this.start = end - 3 // TODO: Check that the value isn't negative
    }

    this.player.seekTo(this.start)
  }

  onPlaying() {
    console.log("on playing")
    // TODO: Do I have to check if its null to set it or something like that?
    // this is rather ugly
    if (this.endIntervalId != null && this.endIntervalId != undefined)
      clearInterval(this.endIntervalId)

    this.endIntervalId = this.startEndCheck(this.player, this.end)
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
    if(this.endIntervalId != null && this.endIntervalId != undefined) {
      clearInterval(this.endIntervalId)
      this.endIntervalId = null
    }

    if(this.startPending != null && this.startPending != undefined) {
      this.start = this.startPending
      this.startPending = null
      this.settingStart = false
    }

    if(this.endPending != null && this.endPending != undefined) {
      this.end = this.endPending
      this.endPending = null
      this.settingEnd = false
    }
  }
}
