FactoryBot.define do
  factory :zoom do
    section
    start { Faker::Number.between(from: section.start_time.to_i, to: section.end_time.to_i.to_f / 2) }
    sequence(:"end") { |n| Faker::Number.between(from: section.end_time.to_i.to_f / 2, to: section.end_time.to_i.to_f) }
  end
end
