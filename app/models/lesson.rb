# frozen_string_literal: true

require "uri"

class Lesson < ApplicationRecord
  default_scope { order(created_at: :desc) }
  paginates_per 10

  belongs_to :instrument
  belongs_to :user
  has_many :sections, -> { order(order: :asc) }, dependent: :destroy, inverse_of: :lesson

  include InlineValidatable

  validates :name, presence: true, uniqueness: { scope: :user_id }
  validates :duration_in_seconds,
    presence: true,
    numericality: {
      only_integer: true,
      greater_than: 0,
    }
  validates :video_url, presence: true, url: { host: /(youtube\.com|youtu\.be)\Z/i }

  def current_objective
    sections.find { |s| s.current = true }
  end

  def inline_validation_fields
    [:name]
  end
end
