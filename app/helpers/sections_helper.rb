# frozen_string_literal: true

module SectionsHelper
  LOOP_IMG = "repeat.svg"
  PLAY_ONCE_IMG = "once.png"

  def format_time(time_in_seconds)
    time = Time.at(time_in_seconds).utc
    return time.strftime("%H:%M:%S") if time_in_seconds.seconds.in_hours > 1

    time.strftime("%M:%S")
  end

  def format_playback_speed(speed)
    return speed.to_i if speed % 1 == 0.0

    speed
  end

  def loop_img(section)
    return LOOP_IMG if section.loop

    PLAY_ONCE_IMG
  end

  private

  def pad_time(time)
    time
      .to_s
      .rjust(2, "0")
  end
end
