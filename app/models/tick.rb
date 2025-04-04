# frozen_string_literal: true

class Tick
  attr_accessor :value

  def initialize(value:, labeled: false)
    @value = value
    @labeled = labeled
  end

  def labeled?
    @labeled
  end
end
