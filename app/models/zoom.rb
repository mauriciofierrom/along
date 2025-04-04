# frozen_string_literal: true

class Zoom < ApplicationRecord
  belongs_to :section

  default_scope { order(level: :asc) }

  class << self
    def left_margin(zoom_start, top_duration)
      zoom_start * 100 / top_duration
    end

    def width(zoom_start, zoom_end, top_duration)
      ((zoom_end - zoom_start) * 100) / top_duration
    end
  end
end
