# frozen_string_literal: true

require "json_schemer"

require "test_helper"

class LessonsHelperTest < ActionView::TestCase
  include LessonsHelper

  STEPS = {
    "type" => "object",
    "required" => ["popover"],
    "additionalProperties" => false,
    "properties" => {
      "element" => { "type" => "string", "pattern" => "^\\[data-tutorid='[a-z0-9-]+'\\]$" },
      "popover" => {
        "type" => "object",
        "required" => ["title", "description"],
        "additionalProperties" => false,
        "properties" => {
          "title" => { "type" => "string", "minLength" => 1 },
          "description" => { "type" => "string", "minLength" => 1 },
        },
      },
    },
  }.freeze

  TUTOR_SCHEMA = JSONSchemer.schema({
    "type" => "object",
    "required" => ["steps", "progressText", "nextBtnText", "prevBtnText", "doneBtnText"],
    "additionalProperties" => false,
    "properties" => {
      "progressText" => { "type" => "string", "pattern" => '^\{\{current\}\}.+\{\{total\}\}$' },
      "nextBtnText" => { "type" => "string", "minLength" => 1 },
      "prevBtnText" => { "type" => "string", "minLength" => 1 },
      "doneBtnText" => { "type" => "string", "minLength" => 1 },
      "steps" => { "type" => "array", "minItems" => 1, "items" => STEPS },
    },
  })

  TUTORIAL_CONFIGS = ["tutor.lesson", "tutor.lesson-form"].freeze

  test "#tutorial_config matches the schema in every locale" do
    elements = I18n.available_locales.map do |locale|
      I18n.with_locale(locale) do
        TUTORIAL_CONFIGS.map do |conf|
          config = JSON.parse(tutorial_config(conf).to_json)
          # Check that the configuration matches the schema
          assert(TUTOR_SCHEMA.valid?(config), "invalid config for locale #{locale}")
          config["steps"].map { |step| step["element"] }
        end
      end
    end

    # Check the same number of steps per locale
    assert_equal 2, elements.uniq.size
  end

  test "#tutorial_config final step has no element key" do
    TUTORIAL_CONFIGS.each do |config|
      assert_not tutorial_config(config)[:steps].last.key?(:element)
    end
  end

  test "#video_id grabs the video id from the url" do
    lesson = lessons(:layla)
    assert_equal video_id(lesson), "fX5USg8_1gA"
  end
end
