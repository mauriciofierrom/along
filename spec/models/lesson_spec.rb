require 'rails_helper'

describe Lesson, type: :model do
  describe 'associations' do
    it { should belong_to(:instrument) }
    it { should have_many(:sections) }
  end
end
