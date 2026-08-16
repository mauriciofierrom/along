# frozen_string_literal: true

FactoryBot.define do
  factory :lesson do
    name do
      "#{Faker::Music::RockBand.song} - #{Faker::Music::RockBand.name}"
    end
    video_url do
      Faker::Internet.url(
        host: "www.youtu.be",
        scheme: "https",
        path: "/#{Faker::Alphanumeric.alphanumeric(number: 11).upcase}",
      )
    end
    duration_in_seconds do
      Faker::Number.between(from: 5.minutes.seconds, to: 10.minutes.seconds)
    end
    instrument
    user
  end
end
