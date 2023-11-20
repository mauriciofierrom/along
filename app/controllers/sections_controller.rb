class SectionsController < ApplicationController
  before_action :set_lesson
  before_action :set_section, only: %i[ show edit update destroy ]

  def new
    @section = @lesson.sections.build
  end

  def edit
  end

  def create
    start_time = VideoPoint.from_seconds(section_params[:start_time].to_i)
    end_time = VideoPoint.from_seconds(section_params[:end_time].to_i)

    updated_params = section_params

    updated_params[:start_time] = start_time
    updated_params[:end_time] = end_time

    @section = @lesson.sections.build(updated_params)

    respond_to do |format|
      if @section.save
        format.html { redirect_to lesson_url(@lesson), notice: "Section was successfully created." }
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    start_time = VideoPoint.from_seconds(section_params[:start_time].to_i)
    end_time = VideoPoint.from_seconds(section_params[:end_time].to_i)

    updated_params = section_params

    updated_params[:start_time] = start_time
    updated_params[:end_time] = end_time

    respond_to do |format|
      if @section.update(updated_params)
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

  def show
    respond_to do |format|
      format.turbo_stream
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
                :start_time,
                :end_time,
                :playback_speed,
                :current,
                :finished,
                :loop,
                :lesson_id)
    end
end
