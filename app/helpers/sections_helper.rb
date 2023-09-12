module SectionsHelper
  def format_start_time(section)
    "#{section.start_time_hour.to_s.rjust(2, "0")}:#{section.start_time_minute.to_s.rjust(2, "0")}:#{section.start_time_second.to_s.rjust(2, "0")}"
  end

  def format_end_time(section)
    "#{section.end_time_hour.to_s.rjust(2, "0")}:#{section.end_time_minute.to_s.rjust(2, "0")}:#{section.end_time_second.to_s.rjust(2, "0")}"
  end

  def format_playback_speed(speed)
    return speed.to_i if speed % 1 == 0.0
    speed
  end
end
