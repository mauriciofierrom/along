FactoryBot.define do
  factory :lesson do
    name do
      "#{Faker::Music::RockBand.song} - #{Faker::Music::RockBand.name}"
    end
    video_url { Faker::Internel.url(host: 'youtu.be') }
    duration_in_seconds do
      Faker::Number.between(from: 0.0, to: 5.minutes.seconds.to_f)
    end
    instrument
  end
end
