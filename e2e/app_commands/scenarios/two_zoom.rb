# frozen_string_literal: true

lesson = CypressOnRails::SmartFactoryWrapper.create(:lesson, name: "Section 1", duration_in_seconds: 1500)
section = Section.create!(name: "Section 1", start_time: 180.0, end_time: 340.0, lesson: lesson)

Zoom.create!(start: 100.0, end: 500.0, section: section)
Zoom.create!(start: 150.0, end: 350.0, section: section)
