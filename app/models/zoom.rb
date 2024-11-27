class Zoom < ApplicationRecord
  belongs_to :section

  default_scope { order(level: :asc) }

  def self.left_margin(zoom_start, top_duration)
    zoom_start * 100 / top_duration
  end

  def self.width(zoom_start, zoom_end, top_duration)
    ((zoom_end - zoom_start) * 100) / top_duration
  end
end
