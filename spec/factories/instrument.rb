FactoryBot.define do
  factory :instrument do
    name { Faker::Music.instrument }
  end
end
