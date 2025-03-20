class SectionsController < ApplicationController
  before_action :set_lesson, except: %i[ zoom_in, zoom_out ]
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
        flash.now[:notice] = "Section was successfully created."
        format.html { redirect_to lesson_url(@lesson)}
      else
        format.html { render :new, status: :unprocessable_entity }
      end
    end
  end

  def update
    respond_to do |format|
      if @section.update(section_params)
        flash.now[:notice] = "Section was successfully updated."
        format.html { redirect_to lesson_url(@lesson) }
      else
        format.html { render :edit, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @section.destroy

    respond_to do |format|
      flash.now[:notice] = "Section was successfully destroyed."
      format.html { redirect_to lesson_url(@lesson) }
      format.turbo_stream
    end
  end

  def show
    respond_to do |format|
      format.turbo_stream
    end
  end

  # We asume the client has our back so we can just go ahead without checking
  # the levels.
  def zoom_in
    @indicator = {
      left_margin: Zoom.left_margin(zoom_params[:start].to_f, zoom_params[:duration].to_f),
      width: Zoom.width(zoom_params[:start].to_f, zoom_params[:end].to_f, zoom_params[:duration].to_f)
    }

    @zoom = Zoom.new(start: zoom_params[:start], end: zoom_params[:end])

    respond_to do |format|
      format.turbo_stream
    end
  end

  def zoom_out
    starting = zoom_params[:start].to_f
    ending = zoom_params[:end].to_f

    @timeline = !starting.nil? && !ending.nil? ? Timeline.new(starting, ending) : section.timeline
    @to_delete = zoom_params[:to_delete_id].to_i

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
                :lesson_id,
                zoom_attributes: {})
    end

    def zoom_params
      params
        .permit(:start,
                :end,
                :duration,
                :button,
                :authenticity_token,
                :commit,
                :to_delete_id
               )
    end
end
