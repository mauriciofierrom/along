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

  describe "video url validations" do
    it { is_expected.to(allow_value("https://youtu.be/0Rdu1S6UJBU?si=fYmWqtQ5KOhqCmxW").for(:video_url)) }
    it { is_expected.to(allow_value("https://www.youtu.be/0Rdu1S6UJBU?si=fYmWqtQ5KOhqCmxW").for(:video_url)) }
    it { is_expected.to(allow_value("https://www.youtu.be/0Rdu1S6UJBU").for(:video_url)) }
    it { is_expected.to(allow_value("https://www.youtu.be/0Rdu-S6UJBU").for(:video_url)) }
    it { is_expected.to(allow_value("https://www.youtu.be/0Rdu1S6UJ_U").for(:video_url)) }
    it { is_expected.to(allow_value("https://www.youtu.be/0Rdu-S6UJ_U").for(:video_url)) }
    it { is_expected.not_to(allow_value("https://evil-youtu.be/0Rdu1S6UJBU?si=fYmWqtQ5KOhqCmxW").for(:video_url)) }
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
