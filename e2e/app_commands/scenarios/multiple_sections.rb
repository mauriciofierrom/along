lesson = CypressOnRails::SmartFactoryWrapper.create(:lesson, name: "Lesson 1")

CypressOnRails::SmartFactoryWrapper.create_list(:section, 3, lesson: lesson)
