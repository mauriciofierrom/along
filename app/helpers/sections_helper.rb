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

  def field_error(field, errors)
    return content_tag(:div, nil, id: field) if !errors || errors.exclude?(field)

    content_tag(
      :div,
      nil,
      id: "#{field}_errors",
      data: {
        "section-form-target" => "error",
        message: errors[field].join(" "),
      },
    )
  end

  def error_style(field, errors)
    return "" if !errors || errors.exclude?(field)

    "invalid"
  end

  private

  def pad_time(time)
    time
      .to_s
      .rjust(2, "0")
  end

  def inline_validate
    [:name, :range]
  end
end
