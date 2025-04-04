# frozen_string_literal: true

lesson = CypressOnRails::SmartFactoryWrapper.create(:lesson, duration_in_seconds: 600)
section = Section.create!(name: "Section 1", start_time: 10.0, end_time: 20.0, lesson: lesson)

Zoom.create!(
  section: section,
  start: 5.0,
  "end" => 40.0,
)
