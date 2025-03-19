require "rails_helper"

shared_examples "a timeline" do
  describe "ticks" do
    let(:labeled_ticks) { subject.ticks.values_at(*(0...subject.ticks.size).step(5)) }
    let(:unlabeled_ticks) { subject.ticks.select { |t| !t.labeled? } }

    it "have at least 10 labeled ticks" do
      expect(subject.ticks.select { |tick| tick.labeled? }.size).to be >= 10
    end

    it "has labeled ticks every 4 other tick" do
      expect(labeled_ticks).to all(satisfy { |tick| tick.labeled? })
    end

    it "has all values be half minute or a full minute multiple" do
      expect(labeled_ticks).to all(satisfy { |t| t.value % 30.0 == 0 })
    end

    it "has the same value between unlabeled ticks" do
      diffs = unlabeled_ticks
        .each_slice(4)
        .flat_map {|g| g.each_cons(2).map {|m, n| n.value - m.value }}
      expect(diffs).to all(eq(diffs.first))
    end

    it "has the same value between labeled ticks" do
      diffs = labeled_ticks
        .each_cons(2)
        .map {|m, n| n.value - m.value }
      expect(diffs).to all(eq(diffs.first))
    end

    it "has the same value between all ticks" do
      diffs = subject.ticks
        .each_cons(2)
        .map {|m, n| n.value - m.value }
      expect(diffs).to all(eq(diffs.first))
    end
  end
end

describe Timeline do
  describe "#initialize" do
    context "when the duration is less than 45 seconds" do
      subject { build(:timeline, :less_than_forty_five_seconds) }

      it "is a timeline" do
        expect(subject.ticks.size).to be >= 11
      end
    end

    context "when the duration is ten minutes" do
      subject { build(:timeline, :ten_minutes) }

      it_behaves_like "a timeline"

      it "has the last item be 10 minutes" do
        expect(subject.ticks.last.value).to eq(10.minutes.in_seconds)
      end

      it "has the penultimate item be .2 seconds less" do
        expect(subject.ticks[subject.ticks.size - 2].value.seconds.in_minutes).to eq(9.8)
      end
    end

    context "when the duration is more than ten minutes" do
      subject { build(:timeline, :more_than_ten_minutes) }

      it_behaves_like "a timeline"
    end

    context "when the timeline starts on non-zero value" do
      subject { build(:timeline, :zoomed_in) }

      it_behaves_like "a timeline"

      describe "starting value" do
        let(:init) { 15.minutes.in_seconds }
        let(:final) { 21.minutes.in_seconds }
        let(:first_tick) { build(:timeline, :zoomed_in, init: init, final: final).ticks.first }

        it "is equal to or less than the starting value" do
          expect(first_tick.value).to be <= init
        end
      end
    end
  end
end
