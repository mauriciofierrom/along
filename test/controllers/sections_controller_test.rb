require "test_helper"

class SectionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @section = sections(:one)
    @lesson = lessons(:layla)
  end

  test "should get new" do
    get new_lesson_section_url(@lesson, @section)
    assert_response :success
  end

  test "should create section" do
    assert_difference("Section.count") do
      post lesson_sections_url(@lesson),
        params: { section: {
          current: false,
          start_time_hour: 0,
          start_time_minute: 3,
          start_time_second: 15,
          end_time_hour: 0,
          end_time_minute: 5,
          end_time_second: 25,
          finished: false,
          loop: true,
          name: "Strange Brew",
          playback_speed: 2.5,
        }}
    end

    assert_redirected_to lesson_url(@lesson)
  end

  test "should get edit" do
    get edit_lesson_section_url(@lesson, @section)
    assert_response :success
  end

  test "should update section" do
    patch lesson_section_url(@lesson, @section),
        params: { section: {
          current: true,
          start_time_hour: 0,
          start_time_minute: 3,
          start_time_second: 15,
          end_time_hour: 0,
          end_time_minute: 5,
          end_time_second: 25,
          finished: true,
          loop: false,
          name: "White Room",
          playback_speed: 0.5,
        }}
    assert_redirected_to lesson_url(@lesson)
  end

  test "should destroy section" do
    assert_difference("Section.count", -1) do
      delete lesson_section_url(@lesson, @section)
    end

    assert_redirected_to lesson_url(@lesson)
  end
end
