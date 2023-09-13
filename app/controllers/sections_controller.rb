class SectionsController < ApplicationController
  before_action :set_lesson
  before_action :set_section, only: %i[ show edit update destroy ]

  def new
    @section = @lesson.sections.build
  end

  def edit
  end

  def create
    @section = @lesson.sections.build(section_params)

    respond_to do |format|
      if @section.save
        format.html { redirect_to lesson_url(@lesson), notice: "Section was successfully created." }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @section.update(section_params)
        format.html { redirect_to lesson_url(@lesson), notice: "Section was successfully updated." }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @section.destroy

    respond_to do |format|
      format.html { redirect_to lesson_url(@lesson), notice: "Section was successfully destroyed." }
    end
  end

  private
    def set_section
      @section = @lesson.sections.find(params[:id])
    end

    def set_lesson
      @lesson = Lesson.find(params[:lesson_id])
    end

    def section_params
      params
        .require(:section)
        .permit(:name,
                :start_time_hour,
                :start_time_minute,
                :start_time_second,
                :end_time_hour,
                :end_time_minute,
                :end_time_second,
                :playback_speed,
                :current,
                :finished,
                :loop,
                :lesson_id)
    end
end
