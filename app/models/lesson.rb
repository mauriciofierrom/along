require 'uri'

class Lesson < ApplicationRecord
  belongs_to :instrument
  has_many :sections, dependent: :destroy
  validates :name, :instrument_id, presence: true
  validates :duration_in_seconds,
    presence: true,
    numericality: {
      only_integer: true,
      greater_than: 0
    }
  validates :video_url, presence: true, url: { host: /(youtube\.com|youtu\.be)\Z/i }
end
