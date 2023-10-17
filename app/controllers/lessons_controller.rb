class LessonsController < ApplicationController
  before_action :set_lesson, only: %i[show edit update destroy]

  def index
    @lessons = Lesson.includes(:instrument).page params[:page]
  end

  def show
  end

  def new
    @lesson = Lesson.new
  end

  def edit
  end

  def create
    @lesson = Lesson.new(lesson_params)
    if @lesson.save
      respond_to do |format|
        format.html { redirect_to lesson_url(@lesson), notice: "Lesson was successfully created." }
        format.turbo_stream { flash.now[:notice] = "Lesson was successfully created" }
      end
    else
        render :new, status: :unprocessable_entity
    end
  end

  def update
    if @lesson.update(lesson_params)
      respond_to do |format|
        format.html { redirect_to lesson_url(@lesson), notice: "Lesson was successfully updated." }
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @lesson.destroy

    respond_to do |format|
      format.html { redirect_to lessons_url, notice: "Lesson was successfully destroyed." }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_lesson
      @lesson = Lesson.includes(:instrument).find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def lesson_params
      params.require(:lesson).permit(:name, :video_url, :instrument_id, :order, :duration_in_seconds, :page)
    end
end
