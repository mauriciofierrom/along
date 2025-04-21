# frozen_string_literal: true

module ApplicationHelper
  def render_turbo_stream_flash_messages
    turbo_stream.prepend("flash", partial: "layouts/flash")
  end

  def present(model, presenter_class)
    presenter = presenter_class.new(model, self)
    yield(presenter) if block_given?
  end

  def field_error(field, errors)
    return content_tag(:div, nil, id: field) if !errors || errors.exclude?(field)

    content_tag(
      :div,
      nil,
      id: "#{field}_errors",
      data: {
        "error-target" => "error",
        message: errors[field].join(" "),
      },
    )
  end

  def error_style(field, errors)
    return "" if !errors || errors.exclude?(field)

    "invalid"
  end
end
