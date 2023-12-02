require 'uri'

class Lesson < ApplicationRecord
  default_scope { order(created_at: :desc) }
  paginates_per 10

  belongs_to :instrument
  belongs_to :user
  has_many :sections, dependent: :destroy

  validates :name, :instrument_id, presence: true
  validates :duration_in_seconds,
    presence: true,
    numericality: {
      only_integer: true,
      greater_than: 0
    }
  validates :video_url, presence: true, url: { host: /(youtube\.com|youtu\.be)\Z/i }

  def current_objective
    self.sections.filter { |s| s.current = true }.first
  end
end
