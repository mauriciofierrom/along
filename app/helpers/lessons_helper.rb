# frozen_string_literal: true

module LessonsHelper
  def video_id(lesson)
    uri = URI.parse(lesson.video_url)
    path = uri.path
    path[1..path.length]
  end

  # We default to the first thumbnail for now
  def video_thumbnail_url(lesson)
    "https://img.youtube.com/vi/#{video_id(lesson)}/0.jpg"
  end

  def instrument_emoji(lesson)
    case lesson.instrument.name
    when "Guitar"
      "🎸"
    else
      "🎹"
    end
  end

  def edit_player_actions
    [
      "range:rangeInputReady@window->player#triggerEdition",
      "range:rangeInputUpdated@window->player#updatePoints",
      "section:connect@window->player#playFromTo",
      "section:disconnect@window->player#reset",
    ].join(" ")
  end

  def new_player_actions
    "lesson-form:videoUrlChanged@window->player#load"
  end
end
