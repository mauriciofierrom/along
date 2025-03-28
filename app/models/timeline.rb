require 'tick'

class Timeline
  MIN_LABELS = 10.0

  attr_reader :ticks

  def initialize(init, final)
    @init = round_down_to_half_minute(init.seconds.in_minutes).minutes.in_seconds
    @final = final
    @duration = final - init

    @ticks = build_ticks
  end

  def step
    calculate_unlabeled_period(calculate_labeled_period)
  end

  private

  def build_ticks
    period = calculate_unlabeled_period(calculate_labeled_period).to_f

    (@init.to_f..@final.to_f).step(period).with_index.map do |value, index|
      if index == 0 || index % 5 == 0
        Tick.new(value: value.round(2), labeled: true)
      else
        Tick.new(value: value.round(2))
      end
    end.to_a
  end

  def calculate_labeled_period
    return (@duration / MIN_LABELS).ceil if @duration.seconds.in_minutes < 5.0

    div = @duration.seconds.in_minutes / MIN_LABELS

    return 0.5.minutes.in_seconds if div < 1.0

    rounded_down = round_down_to_half_minute(div).minutes.in_seconds

    @duration / rounded_down >= 10 ? rounded_down : div.floor.minutes.in_seconds
  end

  def calculate_unlabeled_period(labeled_period)
    labeled_period.seconds / 5.0
  end

  def round_down_to_half_minute(value)
    ((value / 0.5).floor * 0.5)
  end
end
