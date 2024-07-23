require 'rails_helper'

describe Section, type: :model do
  subject { create(:section) }

  describe 'associations' do
    it { should belong_to(:lesson) }
  end

  describe 'validations' do
    it { should validate_uniqueness_of(:name).scoped_to(:lesson_id) }
  end
end
