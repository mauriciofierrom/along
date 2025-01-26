import { Application } from "@hotwired/stimulus"

import RangeController from "../../../app/javascript/controllers/range_controller"
import ZoomController from "../../../app/javascript/controllers/zoom_controller"
import Zoom, { ZoomType } from "../../../app/javascript/controllers/zoom/zoom"

jest.useFakeTimers()

describe("RangeController", () => {
  let application
  let rangeElement
  let rangeController

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
    controllerElement.dataset.action =
      "player:resetRange@window->range#resetRange"

    const form = document.createElement("form")

    const startField = document.createElement("input")
    startField.dataset.zoomTarget = "zoomStart"

    const endField = document.createElement("input")
    endField.dataset.zoomTarget = "zoomEnd"

    form.appendChild(startField)
    form.appendChild(endField)

    const zoomControllerElement = document.createElement("div")
    zoomControllerElement.className = "zoom"
    zoomControllerElement.dataset.controller = "zoom"

    controllerElement.dataset.rangeZoomOutlet = ".zoom"

    controllerElement.appendChild(slider)
    controllerElement.appendChild(rangeInput)

    document.body.appendChild(zoomControllerElement)
    document.body.appendChild(controllerElement)

    application = Application.start()
    application.register("range", RangeController)
    application.register("zoom", ZoomController)
  })

  describe("range controller", () => {
    beforeEach(() => {
      rangeElement = document.querySelector('[data-controller="range"]')
      rangeController = application.getControllerForElementAndIdentifier(
        rangeElement,
        "range",
      )
    })

    // TODO: Check whether the reset works properly in beforeEach or else the
    // order of the test examples affect the outcome of the results.
    it("calls players loop on connect", () => {
      const mockDispatch = jest.spyOn(rangeController, "dispatch")

      rangeController.initialize()

      jest.runAllTimers()

      expect(mockDispatch).toHaveBeenCalledWith("rangeInputReady", {
        detail: {
          start: 0.0,
          end: 5.0,
          isEdit: false,
        },
      })
    })

    describe("when the point is changed", () => {
      it("dispatches to the controller", () => {
        const mockDispatch = jest.spyOn(rangeController, "dispatch")

        rangeController.updateZoomLevel({
          detail: { zoom: new Zoom(4.0, 33.0, 290) },
        })

        rangeController.minTarget.value = "12"
        rangeController.maxTarget.value = "25"
        rangeController.minTarget.dispatchEvent(new InputEvent("input"))

        jest.runAllTimers()

        const start = 5.2
        const end = 6.5
        const setting = 5.2

        expect(mockDispatch).toHaveBeenCalledWith("rangeInputUpdated", {
          detail: {
            start,
            end,
            setting,
          },
        })
      })
    })

    describe("on addZoomLevel", () => {
      beforeEach(() => {
        rangeElement = document.querySelector('[data-controller="range"]')
        rangeController = application.getControllerForElementAndIdentifier(
          rangeElement,
          "range",
        )
      })

      it("resets the range", () => {
        const mockResetRange = jest.spyOn(rangeController, "resetRange")

        rangeController.updateZoomLevel({
          detail: { zoom: new Zoom(4.0, 33.0, 290) },
        })

        jest.runAllTimers()

        expect(mockResetRange).toHaveBeenCalled()
      })

      describe("when the zoom level is zero", () => {
        it("dispatches to player controller without converting", () => {
          rangeController.zoomLevels = []
          const mockDispatch = jest.spyOn(rangeController, "dispatch")

          rangeController.maxTarget.value = "33"
          rangeController.minTarget.value = "12"

          rangeController.updateZoomLevel({
            detail: { zoom: new Zoom(12.0, 33.0, 290) },
          })

          jest.runAllTimers()

          expect(mockDispatch).toHaveBeenCalledWith("rangeInputUpdated", {
            detail: {
              start: 12,
              end: 33,
              zoom: ZoomType.In,
            },
          })
        })
      })
    })

    describe("when the point is changed with two zooms in", () => {
      it("dispatches to the controller", () => {
        const mockDispatch = jest.spyOn(rangeController, "dispatch")

        // The two zooms
        rangeController.updateZoomLevel({
          detail: { zoom: new Zoom(5, 50, 290) },
        })
        rangeController.updateZoomLevel({
          detail: { zoom: new Zoom(6.13, 15.13, 290) },
        })

        rangeController.minTarget.value = "3"
        rangeController.maxTarget.value = "110"
        rangeController.minTarget.dispatchEvent(new InputEvent("input"))

        jest.runAllTimers()

        const start = 6.22
        const end = 9.54
        const setting = 6.22

        expect(mockDispatch).toHaveBeenCalledWith("rangeInputUpdated", {
          detail: {
            start,
            end,
            setting,
          },
        })
      })
    })
  })
})
