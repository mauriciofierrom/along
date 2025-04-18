# frozen_string_literal: true

FactoryBot.define do
  factory :section do
    lesson
    sequence(:name) { |n| "Section #{n}" }

    start_time { 1.0 }

    end_time { Faker::Number.between(from: 10.0, to: [lesson.duration_in_seconds, 50.0].min) }

    playback_speed { 0.5.step(by: 0.5, to: 2.0).to_a.sample }
  end
end
