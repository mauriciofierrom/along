import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  player;
  loaded;
  start;
  end;
  loop;
  videoId;
  endIntervalId;

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
    this.start = this.element.dataset.start || 0.00;
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
                if (this.end == null || this.end == undefined)
                  this.end = this.element.dataset.end || this.player.getDuration()

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
      if (this.player.getCurrentTime() >= this.end)
        this.player.seekTo(this.start)
    }, 0.5)
  }

  // Used as a reference from other controllers. Allows overriding the start/end
  // values. Used from sections
  playFromTo(start, end) {
    this.start = start
    this.end = end

    this.player.seekTo(start)
    this.onPlaying()
  }

  onPlaying() {
    // TODO: Do I have to check if its null to set it or something like that?
    // this is rather ugly
    this.endIntervalId = this.startEndCheck(this.player, this.end)
  }

  #formatUrl(url) {
    let baseUrl = "https://youtu.be/v"
    let parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }
}
