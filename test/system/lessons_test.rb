# frozen_string_literal: true

require "application_system_test_case"

class LessonsTest < ApplicationSystemTestCase
  setup do
    login_as users(:default)
    @lesson = lessons(:layla)
  end

  test "visiting the index" do
    visit lessons_url
    assert_selector ".title", text: "Lessons"
  end

  test "should have app-capable meta tag" do
    visit lesson_url(@lesson)
    find 'meta[name="apple-mobile-web-app-capable"][content="yes"]', visible: :all
  end
end
