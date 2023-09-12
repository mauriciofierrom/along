class VideoPoint < Numeric

  attr_reader :hour, :minute, :second

  def initialize(hour=0, minute, second)
    @hour, @minute, @second = hour, minute, second
  end

  def <=>(other)
    to_i <=> other.to_i
  end

  def to_i
    @hour*3600 + @minute*60 + @second
  end

  def coerce(other)
    duration = ActiveSupport::Duration.build(other.to_i)
    hour = duration[:hours] || 0
    minute = duration[:minutes] || 0
    second = duration[:seconds] || 0

    self.class.new(hour, minute, second)
  end

  def to_s
    "#{@hour.to_s.rjust(2, "0")}:#{@minute.to_s.rjust(2, "0")}:#{@second.to_s.rjust(2, "0")}"
  end
end
