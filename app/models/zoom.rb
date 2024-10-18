class Zoom < ApplicationRecord
  belongs_to :section

  def self.left_margin(zoom_start, top_duration)
    time_before = top_duraton - zoom_start
    time_before * 100 / top_duration
  end

  def self.width(zoom_start, zoom_end, top_duration)
    ((zoom_end - zoom_start) * 100) / top_duration
  end
end
