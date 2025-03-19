class Section < ApplicationRecord
  belongs_to :lesson, counter_cache: true
  has_many :zoom
  accepts_nested_attributes_for :zoom, allow_destroy: true
  delegate :duration_in_seconds, to: :lesson, prefix: true

  composed_of :start_time,
    class_name: "VideoPoint",
    mapping: [ %w(start_time_hour hour), %w(start_time_minute minute), %w(start_time_second second) ]
  composed_of :end_time,
    class_name: "VideoPoint",
    mapping: [ %w(end_time_hour hour), %w(end_time_minute minute), %w(end_time_second second) ]

  validates :name, presence: true, uniqueness: { scope: :lesson_id }

  validates :start_time_hour, :start_time_minute, :start_time_second,
    presence: true,
    numericality: {
      only_integer: true,
      greater_than_or_equal_to: 0
    }

  validates :end_time_hour,
    presence: true,
    numericality: {
      only_integer: true,
    }

  validates :end_time_minute, :end_time_second,
    presence: true,
    numericality: {
      only_integer: true,
      less_than_or_equal_to: 59
    }

  # Due to this issue in shoulda matchers library we'll have to add a default max value
  # https://github.com/thoughtbot/shoulda-matchers/issues/1435
  validates :start_time,
    numericality: {
      less_than:  -> (section) { section.lesson&.duration_in_seconds || 9999.0 },
      message: -> (object, data) { "must be less than #{object.lesson.duration_in_seconds}" },
      allow_nil: true
    }

  # Due to this issue in shoulda matchers library we'll have to add a default max value
  # https://github.com/thoughtbot/shoulda-matchers/issues/1435
  validates :end_time,
    numericality: {
      less_than_or_equal_to: -> (section) { section.lesson&.duration_in_seconds || 9999.0 },
      message: -> (object, data) { "must be less than #{object.lesson.duration_in_seconds}" },
    }

  validates :end_time,
    numericality: {
      greater_than: :start_time
    }

  validates :playback_speed,
    presence: true,
    inclusion: { in: 0.5.step(by: 0.5, to: 2.0) }

  def zoom_level
    @section.zoom.maximum(:level)
  end

  def timeline
    @timeline ||= Timeline.new(*operation_range)
  end

  def operation_range
    zoom.present? ? [zoom.last.start, zoom.last.end] : [0, lesson_duration_in_seconds]
  end
end
