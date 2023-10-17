class ResetAllLessonCacheCounters < ActiveRecord::Migration[7.0]
  def up
    Lesson.all.each do |lesson|
      Lesson.reset_counters(lesson.id, :sections)
    end
  end
end
