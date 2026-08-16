# frozen_string_literal: true

require "uri"

class Lesson < ApplicationRecord
  VIDEO_URL_PATTERNS = {
    host: /\A(?:www\.)?youtu\.be\z/,
    path: %r{\A/[\w-]{11}\z},
  }.freeze

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
  validates :video_url, presence: true, url: VIDEO_URL_PATTERNS

  def current_objective
    sections.find(&:current)
  end

  def inline_validation_fields
    [:name]
  end
end
