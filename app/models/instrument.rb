class Instrument < ApplicationRecord
  validates :name, presence: true
end
