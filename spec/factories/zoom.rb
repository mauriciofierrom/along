FactoryBot.define do
  factory :zoom do
    section
    start { Faker::Number.between(from: section.start_time, to: section.end_time / 2.0) }
    sequence(:"end") { |n| Faker::Number.between(from: section.end_time / 2.0, to: section.end_time) }
  end
end
