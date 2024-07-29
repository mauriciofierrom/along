FactoryBot.define do
  factory :instrument do
    sequence(:name) { |n| "#{Faker::Music.instrument}-#{n}" }
  end
end
