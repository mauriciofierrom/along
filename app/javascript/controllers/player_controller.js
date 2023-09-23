import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  player;
  loaded;
  static targets = [ "source", "duration" ]

  connect() {
    var tag = document.createElement('script')

    tag.src = "https://www.youtube.com/iframe_api"
    var firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag)
  }

  initialize() {
    window.onYouTubeIframeAPIReady = () => {
      this.loaded = true
      this.player = new YT.Player('player', {
        width: '640',
        height: '390',
        playerVars: {
          'controls': 0,
        },
        events: {
          'onReady': (evt) => {
            console.log("ready")
          },
          'onStateChange': (evt) => {
            if (evt.data == YT.PlayerState.PLAYING)
              this.durationTarget.value = Math.floor(this.player.getDuration())
            console.log(`state changed to: ${evt.data}. duration: ${this.player.getDuration()}`)
          },
          'onError': (evt) => {
            consolelog(`error: ${evt.data}`)
          }
        }
      })
    }
  }

  #load() {
    this.durationTarget.value = "";
    try {
      let formattedUrl = this.formatUrl(this.sourceTarget.value)
      this.player.loadVideoByUrl(formattedUrl)
      this.durationTarget.value = this.player.getDuration()
      this.element.children[0].style = "";
    }
    catch (error) {
      console.log(error)
    }
  }

  #formatUrl(url) {
    let baseUrl = "https://youtu.be/v"
    let parsedUrl = new URL(url)
    return `${baseUrl}${parsedUrl.pathname}`
  }
}
