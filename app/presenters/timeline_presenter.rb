class TimelinePresenter
  def initialize(section, template)
    @section = section
    @template = template
  end

  def tick(t)
    h.tag.option value: t.value, label: tick_label(t)
  end

  def timeline
    @section.timeline.ticks
  end

  private

  def h
    @template
  end

  def tick_label(tick)
    return nil unless tick.labeled?
    duration = ActiveSupport::Duration.build(tick.value).parts

    return "%02d:%02d" % [ duration.fetch(:minutes, 0),
                           duration.fetch(:seconds, 0)
    ] if tick.value.seconds.in_hours < 1

    "%02d:%02d:%02d" % [duration.fetch(:hours, 0), duration.fetch(:minutes, 0), duration.fetch(:seconds, 0)]
  end
end
