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

  test "should create lesson" do
    visit lessons_url
    click_on "New lesson"

    select "Guitar", from: "Instrument"
    fill_in "Name", with: "Wild Blue"
    fill_in "Video URL", with: "https://youtube.com/something2"
    page.execute_script("document.querySelector('#lesson_duration_in_seconds').value = 123");

    click_on "Create Lesson"

    assert_text "Wild Blue"
  end

  test "should update Lesson" do
    visit lesson_url(@lesson)
    click_on "Edit this lesson", match: :first

    select "Guitar", from: "Instrument"
    fill_in "Name", with: "New Light"
    fill_in "Video URL", with: "https://youtube.com/other-thing"
    click_on "Update Lesson"

    # assert_text "Lesson was successfully updated"
    click_on "Back to lessons"

    assert_selector ".title", text: "Lessons"
    assert_text "New Light"
  end

  # FIXME: Turbo stream flash notices
  # test "should destroy Lesson" do
  #   visit lesson_url(@lesson)
  #   click_on "Destroy this lesson", match: :first

  #   assert_text "Lesson was successfully destroyed"
  # end
end
