class Section < ApplicationRecord
  belongs_to :lesson

  validate :name, presence: true
  validate :start_time_hour, :start_time_minute, :start_time_second, presence: true
  validate :end_time_hour, :end_time_minute, :end_time_second, presence: true
end
