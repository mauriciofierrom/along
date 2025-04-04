# frozen_string_literal: true

section = CypressOnRails::SmartFactoryWrapper.create(:section, name: "Section 1")

# Each subsequent section level must be inside the other to an upper limit of 3
# FIXME: This depends on lesson/section values to have enough duration/end time
zoom1 = Zoom.create!(
  section: section,
  start: section.start_time + 2.0,
  "end" => section.end_time - 2.0,
)

zoom2 = Zoom.create!(
  section: section,
  start: zoom1.start + 2,
  "end" => zoom1.end - 2,
)

Zoom.create!(
  section: section,
  start: zoom2.start + 2,
  "end" => zoom2.end - 2,
)
