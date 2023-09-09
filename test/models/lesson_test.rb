require "test_helper"

class LessonTest < ActiveSupport::TestCase
  test "#video_id grabs the video id from the url" do
    lesson = lessons(:layla)
    assert_equal lesson.video_id, "something"
  end
end
