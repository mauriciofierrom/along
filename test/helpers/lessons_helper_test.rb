require "test_helper"

class LessonsHelperTest < ActionView::TestCase
  include LessonsHelper

  test "#video_id grabs the video id from the url" do

    lesson = lessons(:layla)
    assert_equal video_id(lesson), "something"
  end
end
