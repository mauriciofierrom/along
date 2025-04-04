# frozen_string_literal: true

require "rails_helper"

describe Section do
  subject(:section) { create(:section) }

  describe "associations" do
    it { is_expected.to(belong_to(:lesson)) }
  end

  describe "validations" do
    it { is_expected.to(validate_uniqueness_of(:name).scoped_to(:lesson_id)) }
    it { is_expected.to(validate_uniqueness_of(:order).scoped_to(:lesson_id)) }
  end

  describe "#save" do
    describe "#set_order" do
      let(:new_section) { build(:section, lesson: subject.lesson) }

      it "triggers set_order on save" do
        # rubocop:disable RSpec/MessageSpies
        expect(new_section).to(receive(:set_order))
        # rubocop:enable RSpec/MessageSpies
        new_section.save!
      end

      it "sets the order of the first section" do
        expect(section.order).to(eq(1))
      end

      it "has no value before save" do
        expect(new_section.order).to(be_nil)
      end

      it "sets the order to max value per lesson plus one" do
        new_section.save!

        expect(new_section.order).to(eq(2))
      end
    end
  end
end
