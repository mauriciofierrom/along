class Section < ApplicationRecord
  belongs_to :lesson, counter_cache: true

  composed_of :start_time,
    class_name: "VideoPoint",
    mapping: [ %w(start_time_hour hour), %w(start_time_minute minute), %w(start_time_second second) ]
  composed_of :end_time,
    class_name: "VideoPoint",
    mapping: [ %w(end_time_hour hour), %w(end_time_minute minute), %w(end_time_second second) ]

  validates :name, presence: true
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

  validates :start_time,
    numericality: {
      less_than:  -> (section) { section.lesson.duration_in_seconds },
      message: -> (object, data) { "must be less than #{object.lesson.duration_in_seconds}" }
    }

  validates :end_time,
    numericality: {
      less_than_or_equal_to: -> (section) { section.lesson.duration_in_seconds },
      message: -> (object, data) { "must be less than #{object.lesson.duration_in_seconds}" }
    }

  validates :end_time,
    numericality: {
      greater_than: :start_time
    }

  validates :playback_speed,
    presence: true,
    inclusion: { in: 0.5.step(by: 0.5, to: 2.0) }
end
