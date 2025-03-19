module ApplicationHelper
  def render_turbo_stream_flash_messages
    turbo_stream.prepend "flash", partial: "layouts/flash"
  end

  def present(model, presenter_class)
    presenter = presenter_class.new(model, self)
    yield(presenter) if block_given?
  end
end
