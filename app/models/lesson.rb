class Lesson < ApplicationRecord
  belongs_to :instrument
  validates :name, :instrument_id, presence: true
  validates :video_url, presence: true, url: { host: /(youtube\.com|youtu\.be)\Z/i }
end
