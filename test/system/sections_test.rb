require "application_system_test_case"

class SectionsTest < ApplicationSystemTestCase
  setup do
    @lesson = lessons(:layla)
    @section = sections(:one)
  end

  test "visiting the index" do
    visit lesson_url(@lesson)
    assert_selector "h2", text: "Sections"
  end

  test "should create section" do
    visit lesson_url(@lesson)
    click_on "New section"

    fill_in "Name", with: "Part 4"
    fill_in :section_start_time_hour, with: @section.start_time_hour
    fill_in :section_start_time_minute, with: @section.start_time_minute
    fill_in :section_start_time_second, with: @section.start_time_second
    fill_in :section_end_time_hour, with: @section.end_time_hour
    fill_in :section_end_time_minute, with: @section.end_time_minute
    fill_in :section_end_time_second, with: @section.end_time_second
    check "Finished"
    check "Loop"
    fill_in "Playback speed", with: @section.playback_speed
    check "Current" if @section.current

    click_on "Create Section"

    assert_text "Section was successfully created"
    click_on "Back"
  end

  test "should update Section" do
    visit lesson_url(@lesson)

    assert_selector "summary", text: "Intro"

    find("details", text: "Intro").click
    # click_on "details"
    click_on "Edit section", match: :first

    fill_in "Name", with: "Part 3"
    fill_in :section_start_time_hour, with: (@section.start_time_hour)
    fill_in :section_start_time_minute, with: (@section.start_time_minute + 2)
    fill_in :section_start_time_second, with: (@section.start_time_second + 2)
    fill_in :section_end_time_hour, with: (@section.end_time_hour)
    fill_in :section_end_time_minute, with: (@section.end_time_minute + 2)
    fill_in :section_end_time_second, with: (@section.end_time_second + 2)
    uncheck "Finished" if @section.finished
    uncheck "Loop" if @section.loop
    fill_in "Playback speed", with: 2.5
    uncheck "Current"

    click_on "Update Section"

    assert_text "Section was successfully updated"
    click_on "Back"
  end

   test "should destroy Section" do
     visit lesson_url(@lesson)

     find("details", text: "Intro").click
     click_on "Destroy this section", match: :first

     assert_text "Layla"
     assert_selector "h2", text: "Sections"
     assert_text "Section was successfully destroyed"
   end
end
