module LessonsHelper
  def video_id(lesson)
    uri = URI.parse(lesson.video_url)
    path = uri.path
    path[1..path.length]
  end

  # We default to the first thumbnail for now
  def video_thumbnail_url(lesson)
    "https://img.youtube.com/vi/#{video_id(lesson)}/0.jpg"
  end
end
