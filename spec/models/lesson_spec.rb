# frozen_string_literal: true

require "rails_helper"

describe Lesson do
  describe "associations" do
    it { is_expected.to(belong_to(:instrument)) }
    it { is_expected.to(belong_to(:user)) }
    it { is_expected.to(have_many(:sections)) }
  end

  describe "validations" do
    it { is_expected.to(validate_uniqueness_of(:name).scoped_to(:user_id)) }
    it { is_expected.to(validate_presence_of(:video_url)) }
    it { is_expected.to(validate_presence_of(:duration_in_seconds)) }
    it { is_expected.to(validate_numericality_of(:duration_in_seconds).only_integer.is_greater_than(0)) }
  end

  describe "#default_scope" do
    let(:user) { create(:user) }
    let(:older) { create(:lesson, created_at: 1.day.ago, user: user) }
    let(:newer) { create(:lesson, created_at: Time.current, user: user) }

    it "is ordered descending based on creation time" do
      expect(described_class.where(user: user)).to(eq([newer, older]))
    end
  end

  describe "#current_objective" do
    subject(:current_objective) { lesson.current_objective }

    let(:user) { create(:user) }
    let(:lesson) { create(:lesson, user: user) }

    context "when there's no section" do
      it { is_expected.to(be_nil) }
    end

    context "when there's a section" do
      let!(:section) { create(:section, lesson: lesson, current: true) }

      it { is_expected.to(eq(section)) }
    end
  end
end
