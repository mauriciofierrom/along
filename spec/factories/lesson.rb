FactoryBot.define do
  factory :lesson do
    name do
      "#{Faker::Music::RockBand.song} - #{Faker::Music::RockBand.name}"
    end
    video_url { Faker::Internet.url(host: "youtu.be", scheme: "https") }
    duration_in_seconds do
      Faker::Number.between(from: 5.minutes.seconds, to: 10.minutes.seconds)
    end
    instrument
    user
  end
end
