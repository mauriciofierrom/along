require "application_system_test_case"

class SectionsTest < ApplicationSystemTestCase
  setup do
    login_as users(:default)
    @lesson = lessons(:layla)
    @section = sections(:one)
  end

  test "visiting the index" do
    visit lesson_url(@lesson)
    assert_selector ".sections"
  end

  test "should create section" do
    visit lesson_url(@lesson)
    click_on "New Section"

    fill_in "Name", with: "Part 4"
    page.execute_script("document.querySelector('#section_start_time').disabled = false")
    page.execute_script("document.querySelector('#section_end_time').disabled = false")
    page.execute_script("document.querySelector('#section_start_time').value = 123.2")
    page.execute_script("document.querySelector('#section_end_time').value = 323.2")
    find(".switch").click
    fill_in "Playback speed", with: @section.playback_speed
    check "Current" if @section.current

    click_on "Create"

    assert_text "Part 4"
  end

  test "should update Section" do
    skip
    visit lesson_url(@lesson)

    assert_selector ".section", text: "Intro"

    click_on "Edit", match: :prefer_exact
    assert_selector "h1", text: "Editing section"

    fill_in "Name", with: "Part 3"
    page.execute_script("document.querySelector('#section_start_time').value = 123.2")
    page.execute_script("document.querySelector('#section_end_time').value = 323.2")
    uncheck "Finished" if @section.finished
    uncheck "Loop" if @section.loop
    fill_in "Playback speed", with: 2.5
    uncheck "Current"

    click_on "Update Section"

    visit lesson_url(@lesson)
    assert_text "Part 3"
  end

   test "should destroy Section" do
     visit lesson_url(@lesson)

     assert_text @section.name

     find(".item", text: @section.name).find(".fa-trash").click

     assert_no_text @section.name
   end
end
