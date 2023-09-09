require "application_system_test_case"

class LessonsTest < ApplicationSystemTestCase
  setup do
    @lesson = lessons(:layla)
  end

  test "visiting the index" do
    visit lessons_url
    assert_selector "h1", text: "Lessons"
  end

  test "should create lesson" do
    visit lessons_url
    click_on "New lesson"

    select "Guitar", from: "Instrument"
    fill_in "Name", with: "Wild Blue"
    fill_in "Video URL", with: "https://youtube.com/something2"
    click_on "Create Lesson"

    assert_text "Lesson was successfully created"
    click_on "Back"
  end

  test "should update Lesson" do
    visit lesson_url(@lesson)
    click_on "Edit this lesson", match: :first

    select "Guitar", from: "Instrument"
    fill_in "Name", with: "New Light"
    fill_in "Video URL", with: "https://youtube.com/other"
    click_on "Update Lesson"

    assert_text "Lesson was successfully updated"
    click_on "Back"
  end

  test "should destroy Lesson" do
    visit lesson_url(@lesson)
    click_on "Destroy this lesson", match: :first

    assert_text "Lesson was successfully destroyed"
  end
end
