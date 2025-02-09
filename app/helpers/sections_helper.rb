module SectionsHelper
  LOOP_IMG = "repeat.svg".freeze
  PLAY_ONCE_IMG = "once.png".freeze
  MAX_LABELS = 10

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
    return LOOP_IMG if section.loop
    PLAY_ONCE_IMG
  end

  def tick_tag(tick_tuple)
    tick, should_label = tick_tuple
    return tag.option value: tick unless should_label

    tag.option value: tick, label: format_tick(tick)
  end

  def ticks(lesson)
    tick_enum = tick_period(lesson.duration_in_seconds)
    label_period = (tick_enum.size.to_f / MAX_LABELS).ceil

    tick_enum.with_index.map {|n, idx| idx % label_period == 0 ? [n, true] : [n, false]}
  end

  private

  def pad_time(time)
    time
      .to_s
      .rjust(2, "0")
  end

  def tick_period(duration)    
    step = round_period(duration / 60)

    (0..duration).step(step)
  end

  def round_period(period)
    to_half_minute = (period / 30.0).ceil * 30.0
    to_full_minute = (period / 60.0).ceil * 60.0

    return to_half_minute if period - to_half_minute < period - to_full_minute

    to_full_minute
  end

  def format_tick(tick)
    duration = ActiveSupport::Duration.build(tick).parts

    return "%02d:%02d" % [ duration.fetch(:minutes, 0),
                         duration.fetch(:seconds, 0)
                       ] if tick.seconds.in_hours < 1
    
    "%02d:%02d:%02d" % [duration.fetch(:hours, 0), duration.fetch(:minutes, 0), duration.fetch(:seconds, 0)]
  end  
end
