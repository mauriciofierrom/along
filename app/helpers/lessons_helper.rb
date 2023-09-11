module LessonsHelper
  def video_id(lesson)
    uri = URI.parse(lesson.video_url)
    path = uri.path
    path[1..path.length]
  end
end
