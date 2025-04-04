require 'rails_helper'

describe Section, type: :model do
  subject { create(:section) }

  describe 'associations' do
    it { should belong_to(:lesson) }
  end

  describe 'validations' do
    it { should validate_uniqueness_of(:name).scoped_to(:lesson_id) }
    it { should validate_uniqueness_of(:order).scoped_to(:lesson_id) }
  end

  describe '#save' do
    describe "#set_order" do
      let(:new_section) { build(:section, lesson: subject.lesson) }

      it "triggers set_order on save" do
        expect(new_section).to receive(:set_order)
        new_section.save!
      end

      it "should set the order to max value per lesson plus one" do
        expect(subject.order).to eq(1)
        expect(new_section.order).to be_nil

        new_section.save!

        expect(new_section.order).to eq(2)
      end
    end
  end
end
