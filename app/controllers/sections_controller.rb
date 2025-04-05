# frozen_string_literal: true

class SectionsController < ApplicationController
  before_action :set_lesson, except: :swap_order
  before_action :set_section, only: [:show, :edit, :update, :destroy]

  def show
    respond_to do |format|
      format.turbo_stream
    end
  end

  def new
    @section = @lesson.sections.build
  end

  def edit
  end

  def create
    @section = @lesson.sections.build(section_params)

    respond_to do |format|
      if @section.save
        flash.now[:notice] = t(".success")
        format.html { redirect_to(lesson_url(@lesson)) }
      else
        format.html { render(:new, status: :unprocessable_entity) }
      end
    end
  end

  def update
    respond_to do |format|
      if @section.update(section_params)
        flash.now[:notice] = t(".success")
        format.html { redirect_to(lesson_url(@lesson)) }
      else
        format.html { render(:edit, status: :unprocessable_entity) }
      end
    end
  end

  def destroy
    @section.destroy

    respond_to do |format|
      flash.now[:notice] = t(".success")
      format.html { redirect_to(lesson_url(@lesson)) }
      format.turbo_stream
    end
  end

  # We asume the client has our back so we can just go ahead without checking
  # the levels.
  def zoom_in
    @indicator = {
      left_margin: Zoom.left_margin(zoom_params[:start].to_f, zoom_params[:duration].to_f),
      width: Zoom.width(zoom_params[:start].to_f, zoom_params[:end].to_f, zoom_params[:duration].to_f),
    }

    @zoom = Zoom.new(start: zoom_params[:start], end: zoom_params[:end])

    @timeline = Timeline.new(@zoom.start, @zoom.end)

    respond_to do |format|
      format.turbo_stream
    end
  end

  def zoom_out
    starting = zoom_params[:zoom_out_start].to_f
    ending = zoom_params[:zoom_out_end].to_f

    @to_delete_id = zoom_params[:zoom_out_id].to_i
    @timeline = Timeline.new(starting, ending.zero? ? @lesson.duration_in_seconds : ending)
    @to_delete_index = Time.now.to_i

    respond_to do |format|
      format.turbo_stream
    end
  end

  def swap_order
    dragged = Section.find(swap_params[:dragged_id].to_i)
    dropped = Section.find(swap_params[:dropped_id].to_i)

    dragged_order = dragged.order

    Section.transaction do
      dragged.order = dropped.order
      dropped.order = dragged_order

      dropped.save!(validate: false)
      dragged.save!(validate: false)
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
        zoom_attributes: [:start, :end, :id, :_destroy])
  end

  def zoom_params
    params
      .permit(:start,
        :end,
        :duration,
        :button,
        :authenticity_token,
        :commit,
        :zoom_out_start,
        :zoom_out_end,
        :zoom_out_id,
        :lesson_id)
  end

  def swap_params
    params.require(:swap_params)
  end
end
