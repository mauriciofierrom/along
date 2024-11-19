FactoryBot.define do
  factory :section do
    lesson
    sequence(:name) { |n| "Section #{n}" }

    start_time_hour { 0 }
    start_time_minute { 0 }
    start_time_second { 1 }

    end_time_hour { 0 }
    end_time_minute { 0 }
    end_time_second { Faker::Number.between(from: 2, to: [lesson.duration_in_seconds, 50].min ) }

    playback_speed { 0.5.step(by: 0.5, to: 2.0).to_a.sample }
  end
end