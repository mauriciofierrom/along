FactoryBot.define do
  factory :timeline do
    initialize_with { new(0, Faker::Number.between(from: 10.minutes.in_seconds, to: 20.minutes.in_seconds)) }

    # Relevant because it's the top value of seconds in which we can have a
    # second per tick
    trait :less_than_forty_five_seconds do
      initialize_with { new(0, Faker::Number.within(range: 10...45).minutes.in_seconds) }
    end

    trait :ten_minutes do
      initialize_with { new(0, 10.minutes.in_seconds) }
    end

    trait :more_than_ten_minutes do
      initialize_with { new(0, Faker::Number.within(range: 10.minutes.in_seconds..30.minutes.in_seconds)) }
    end

    trait :zoomed_in do
      transient do
        init { Faker::Number.within(range: 10.minutes.in_seconds..15.minutes.in_seconds) }
        final { Faker::Number.within(range: 145.minutes.in_seconds..160.minutes.in_seconds) }
      end

      initialize_with { new(init, final) }
    end
  end
end
