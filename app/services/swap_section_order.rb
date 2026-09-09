# frozen_string_literal: true

class SwapSectionOrder
  class << self
    def call(dragged:, dropped:)
      dragged_order = dragged.order

      Section.transaction do
        dragged.order = dropped.order
        dropped.order = dragged_order

        dropped.save!(validate: false)
        dragged.save!(validate: false)
      end
    end
  end
end
