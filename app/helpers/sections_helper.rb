module SectionsHelper
  def format_start_time(section)
    "#{pad_time(section.start_time_hour)}:#{pad_time(section.start_time_minute)}:#{pad_time(section.start_time_second)}"
  end

  def format_end_time(section)
    "#{pad_time(section.end_time_hour)}:#{pad_time(section.end_time_minute)}:#{pad_time(section.end_time_second)}"
  end

  def format_time(time)
    return time.to_s if time.hour > 0
    "#{pad_time(time.minute)}:#{pad_time(time.second)}"
  end

  def format_playback_speed(speed)
    return speed.to_i if speed % 1 == 0.0
    speed
  end

  def loop_img(section)
    return "repeat.svg" if section.loop
    "once.png"
  end

  private

  def pad_time(time)
    time
      .to_s
      .rjust(2, "0")
  end
end
