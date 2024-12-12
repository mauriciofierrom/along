import { Application } from "@hotwired/stimulus"

import RangeController from "../../../app/javascript/controllers/range_controller"
import Zoom, { ZoomType } from "../../../app/javascript/controllers/zoom"

jest.useFakeTimers()

describe("RangeController", () => {
  let application;
  let rangeElement;
  let rangeController;

  beforeEach(() => {
    const selected = document.createElement("div")
    selected.className = "range-selected"
    selected.dataset.rangeTarget = "slider"

    const startTimeField = document.createElement("input")
    startTimeField.type = "range"
    startTimeField.value = "0.0"
    startTimeField.className = "min"
    startTimeField.step = 0.01
    startTimeField.max = "290.0"
    startTimeField.dataset.action = "input->range#update"
    startTimeField.dataset.rangeTarget = "min"

    const endTimeField = document.createElement("input")
    endTimeField.type = "range"
    endTimeField.value = "5.0"
    endTimeField.className = "max"
    endTimeField.step = 0.01
    endTimeField.max = "290.0"
    endTimeField.dataset.action = "input->range#update"
    endTimeField.dataset.rangeTarget = "max"

    const rangeInput = document.createElement("div")
    rangeInput.appendChild(startTimeField)
    rangeInput.appendChild(endTimeField)

    const slider = document.createElement("div")
    slider.className = "range-slider"
    slider.appendChild(selected)

    const controllerElement = document.createElement("div")
    controllerElement.className = "range"
    controllerElement.dataset.controller = "range"
    controllerElement.dataset.action = "zoom-field:addZoomLevel@window->range#addZoomLevel zoom-field:removeZoomLevel@window->range#removeZoomLevel player:resetRange@window->range#resetRange"
    controllerElement.dataset.rangePlayerOutlet = ".player"

    controllerElement.appendChild(slider)
    controllerElement.appendChild(rangeInput)

    document.body.appendChild(controllerElement)

    application = Application.start()
    application.register("range", RangeController)
  })


  describe("range controller", () => {
    beforeEach(() => {
      rangeElement = document.querySelector('[data-controller="range"]')
      rangeController = application.getControllerForElementAndIdentifier(rangeElement, "range")
    })

    // TODO: Check whether the reset works properly in beforeEach or else the
    // order of the test examples affect the outcome of the results.
    it("calls players loop on connect", () => {
      const mockDispatch = jest.spyOn(rangeController, "dispatch")

      rangeController.initialize()

      jest.runAllTimers()

      expect(mockDispatch).toHaveBeenCalledWith("connect", {detail: {
        start: 0.0,
        end: 5.0,
        max: 290
      }})
    })

    describe("when the point is changed", () => {
      it("dispatches to the controller", () => {
        const mockDispatch = jest.spyOn(rangeController, "dispatch")

        rangeController.zoomLevels = [new Zoom(4.0, 33.0, 1234)]
        rangeController.minTarget.value = "12"
        rangeController.maxTarget.value = "25"
        rangeController.minTarget.dispatchEvent(new InputEvent("input"))

        jest.runAllTimers()

        const start = 4.28
        const end = 4.59
        const setting = 12

        expect(mockDispatch)
          .toHaveBeenCalledWith("update", { detail: {
            start,
            end,
            setting,
            zoom: "zoom-in"
          }})
      })
    })

    describe("on addZoomLevel", () => {
      beforeEach(() => {
        rangeElement = document.querySelector('[data-controller="range"]')
        rangeController = application.getControllerForElementAndIdentifier(rangeElement, "range")
      })

      it("resets the range", () => {
        const mockResetRange = jest.spyOn(rangeController, "resetRange")

        rangeController.addZoomLevel({detail: {start: 4.0, end: 33.0}})

        jest.runAllTimers()

        expect(mockResetRange).toHaveBeenCalled()
      })

      it("dispatches to player controller with the converted value", () => {
        rangeController.zoomLevels = []
        const mockDispatch = jest.spyOn(rangeController, "dispatch")

        rangeController.maxTarget.value = "25"
        rangeController.minTarget.value = "12"

        rangeController.addZoomLevel({detail: {start: 4.0, end: 33.0}})

        jest.runAllTimers()

        expect(mockDispatch)
          .toHaveBeenCalledWith("update", {
            detail: {
              start: 5.2,
              end: 6.5,
              setting: undefined,
              zoom: ZoomType.In}})
      })
    })

    describe("on removeZoomLevel", () => {
      it("removes the first element in the zoom levels", () => {
        rangeController.zoomLevels = [new Zoom(4.0, 33.0, 1234)]
        const zoomLevelCount = rangeController.zoomLevel
        rangeController.removeZoomLevel()

        jest.runAllTimers()

        expect(rangeController.zoomLevels).toHaveLength(zoomLevelCount - 1)
      })
    })
  })
})
