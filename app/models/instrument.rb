# frozen_string_literal: true

class Instrument < ApplicationRecord
  validates :name, presence: true
end
