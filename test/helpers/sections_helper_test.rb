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

  test ".format_time for time without hour component" do
    time = VideoPoint.new(0, 12, 23)
    assert_equal format_time(time), "12:23"
  end

  test ".format_time for time with hour component" do
    time = VideoPoint.new(2, 12, 23)
    assert_equal format_time(time), "02:12:23"
  end

  test ".format_time for values < 10" do
    time = VideoPoint.new(1, 1, 1)
    assert_equal format_time(time), "01:01:01"
  end

  test ".format_time for values < 10 without hour component" do
    time = VideoPoint.new(0, 1, 1)
    assert_equal format_time(time), "01:01"
  end

  test "loop img for section set to loop" do
    section = sections(:one)
    assert_equal loop_img(section), LOOP_IMG
  end

  test "loop img for section set not to loop" do
    section = sections(:two)
    assert_equal loop_img(section), PLAY_ONCE_IMG
  end
end
