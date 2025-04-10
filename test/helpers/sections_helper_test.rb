# frozen_string_literal: true

require "test_helper"

class SectionsHelperTest < ActionView::TestCase
  include SectionsHelper

  test "format playback speed when it has decimals" do
    playback_speed = 1.5
    assert_equal format_playback_speed(playback_speed), 1.5
  end

  test "format playback speed when it doesn't have decimals" do
    playback_speed = 2.0
    assert_equal format_playback_speed(playback_speed), 2
  end

  test ".format_time for time less than an hour" do
    time = 1116
    assert_equal format_time(time), "18:36"
  end

  test ".format_time for time an hour or more" do
    time = 7943
    assert_equal format_time(time), "02:12:23"
  end

  test "loop img for section set to loop" do
    section = sections(:one)
    assert_equal loop_img(section), LOOP_IMG
  end

  test "loop img for section set not to loop" do
    section = sections(:two)
    assert_equal loop_img(section), PLAY_ONCE_IMG
  end

  test ".error_style is 'invalid' when the field is present in the error hash" do
    errors = { some: "error" }
    assert_equal error_style(:some, errors), "invalid"
  end

  test ".error_style is empty when the error hash is nil" do
    assert_equal error_style(:some, nil), ""
  end

  test ".error_style is empty when the field is not present in the error hash" do
    errors = { other: "error" }
    assert_equal error_style(:some, errors), ""
  end
end
