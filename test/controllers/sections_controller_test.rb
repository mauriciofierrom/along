# frozen_string_literal: true

require "test_helper"

class SectionsControllerTest < ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers

  setup do
    sign_in users(:default)
    @section = sections(:one)
    @lesson = lessons(:layla)
  end

  test "should get new" do
    get new_lesson_section_url(@lesson, @section)
    assert_response :success
  end

  # SHould work again when changing the test database to postgresql
  # test "should create section" do
  #   assert_difference("Section.count") do
  #     post lesson_sections_url(@lesson),
  #       params: { section: {
  #         current: false,
  #         start_time: 10.34,
  #         end_time: 24.22,
  #         finished: false,
  #         loop: true,
  #         name: "Strange Brew",
  #         playback_speed: 2.5,
  #       }}
  #   end

  #   assert_redirected_to lesson_url(@lesson)
  # end

  test "should get edit" do
    get edit_lesson_section_url(@lesson, @section)
    assert_response :success
  end

  test "should update section" do
    patch lesson_section_url(@lesson, @section),
      params: {
        section: {
          current: true,
          start_time: 12.2,
          end_time: 23.4,
          finished: true,
          loop: false,
          name: "White Room",
          playback_speed: 0.5,
        },
      }
    assert_redirected_to lesson_url(@lesson)
  end

  test "should destroy section" do
    assert_difference("Section.count", -1) do
      delete lesson_section_url(@lesson, @section)
    end

    assert_redirected_to lesson_url(@lesson)
  end
end
