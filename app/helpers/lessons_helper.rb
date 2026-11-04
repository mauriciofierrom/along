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
      "section:cancelled@window->player#reset",
      "section-form:cancelled@window->player#reset",
    ].join(" ")
  end

  def new_player_actions
    [
      "lesson-form:videoUrlChanged@window->player#load",
      "tutorial:start@document->player#onTutorialStart",
      "tutorial:end@document->player#onTutorialEnd",
    ].join(" ")
  end

  def tutorial_config(scope)
    {
      steps: tutorial_steps(scope),
    }.merge(common_tutorial_conf)
  end

  private

  def common_tutorial_conf
    {
      progressText: "{{current}} #{t("tutor.progress")} {{total}}",
      nextBtnText: t("tutor.next"),
      prevBtnText: t("tutor.previous"),
      doneBtnText: t("tutor.done"),
    }
  end

  def tutorial_steps(translation_path)
    t(translation_path).keys.map do |part|
      {
        element: (tutor_id(part) unless part == :final),
        popover: {
          title: t("#{translation_path}.#{part}.title"),
          description: t("#{translation_path}.#{part}.description"),
        },
      }.compact
    end
  end

  def tutor_id(name)
    "[data-tutorid='#{name.to_s.dasherize}']"
  end
end
