require "application_system_test_case"

class SectionsTest < ApplicationSystemTestCase
  setup do
    @section = sections(:one)
  end

  test "visiting the index" do
    visit sections_url
    assert_selector "h1", text: "Sections"
  end

  test "should create section" do
    visit sections_url
    click_on "New section"

    check "Current" if @section.current
    fill_in "End time", with: @section.end_time
    check "Finished" if @section.finished
    fill_in "Lesson", with: @section.lesson_id
    check "Loop" if @section.loop
    fill_in "Name", with: @section.name
    fill_in "Playback speed", with: @section.playback_speed
    fill_in "Start time", with: @section.start_time
    click_on "Create Section"

    assert_text "Section was successfully created"
    click_on "Back"
  end

  test "should update Section" do
    visit section_url(@section)
    click_on "Edit this section", match: :first

    check "Current" if @section.current
    fill_in "End time", with: @section.end_time
    check "Finished" if @section.finished
    fill_in "Lesson", with: @section.lesson_id
    check "Loop" if @section.loop
    fill_in "Name", with: @section.name
    fill_in "Playback speed", with: @section.playback_speed
    fill_in "Start time", with: @section.start_time
    click_on "Update Section"

    assert_text "Section was successfully updated"
    click_on "Back"
  end

  test "should destroy Section" do
    visit section_url(@section)
    click_on "Destroy this section", match: :first

    assert_text "Section was successfully destroyed"
  end
end
