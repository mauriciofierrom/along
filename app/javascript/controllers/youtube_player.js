export default class YoutubePlayer {
  player;

  constructor(params) {
    this.player = new YT.Player('player', {
        width: params.width.toString(),
        height: params.height.toString(),
        videoId: params.videoId || '',
        playerVars: {
          'autoplay': params.edit,
          'disablekb': 1,
          'controls': 0,
          'startValue': 0
        },
        events: {
          'onReady': (evt) => {
          },
          'onStateChange': (evt) => {
            console.log(`Youtube state: ${evt.data}`)
            switch (evt.data) {
              case YT.PlayerState.PLAYING:
                console.log("YoutubePlayer: PLAYING")
                params.onPlaying()
                break;
              case YT.PlayerState.PAUSED:
                params.onPause()
                break;
              default:
            }
          },
          'onError': (evt) => {
            console.log(`error: ${evt.data}`)
          }
        }
      })
  }

  get duration() {
    return this.player.getDuration()
  }

  get currentTime() {
    return this.player.getCurrentTime()
  }

  load(url) {
    this.player.loadVideoByUrl(url)
  }

  play(from) {
    this.player.seekTo(from, true)
    this.player.playVideo()
  }

  pause() {
    this.player.pauseVideo()
    this.player.seekTo(0)
  }
}
