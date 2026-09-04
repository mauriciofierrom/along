describe("Zoom", () => {
  it("the zoom option isn't available until we pick a section", () => {
    cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
      cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
      cy.findByText("New Section").shouldBeEnabled().click()
      cy.findByTestId("zoom-in").should("not.be.visible")
      cy.get("#section_start_time")
        .shouldBeEnabled()
        .invoke("val", 10.0)
        .trigger("input", { force: true })
        .should("have.value", 10.0)
      cy.findByRole("button", { name: "Zoom in" }).should("be.visible")
    })
  })

  describe("Zoom in", () => {
    beforeEach(() => {
      cy.appFactories([["create", "section"]]).then(([section]) => {
        cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
        cy.disableDebounce()
        cy.findByTestId("edit-section").shouldBeEnabled().click({ force: true })
        cy.get("#section_start_time")
          .shouldBeEnabled()
          .invoke("val", 10.0)
          .trigger("input", { force: true })
          .should("have.value", 10.0)
        cy.get("#section_end_time")
          .invoke("val", 20.0)
          .trigger("input", { force: true })
          .should("have.value", 20.0)
        cy.findByRole("button", { name: "Zoom in" })
          .shouldBeEnabled()
          .click({ force: true })
      })
    })

    it("updates the UI consistently", () => {
      // Shows zoom indicator
      cy.findByTestId("zoom-indicator").should("exist")

      // Shows the zoom out button
      cy.findByTestId("zoom-out").should("be.visible")

      // Restores the start input to zero
      cy.get("#section_start_time").should("have.value", 0)

      // Restore the end input to the max value
      cy.get("#section_end_time").then((endTime) => {
        const max = parseFloat(endTime.attr("max"))
        const value = parseFloat(endTime.val())

        expect(value).to.equal(max)
      })

      // Disables the zoom in button
      cy.findByTestId("zoom-in").should("have.class", "disabled")
    })

    context("when picking a point", () => {
      it("enables zoom in button again", () => {
        cy.get("#section_start_time")
          .invoke("val", 10)
          .trigger("input", { force: true })
        cy.findByTestId("zoom-in").should("not.have.class", "disabled")
      })
    })
  })

  describe("Zoom out", () => {
    context("when we're editing a section", () => {
      context("if there are no more zooms", () => {
        beforeEach(() => {
          cy.appFactories([["create", "zoom"]]).then(() => {
            cy.forceLogin({ redirect_to: "/lessons" })
            cy.findByTestId("lesson-link").click()
            cy.findByTestId("edit-section").click({ force: true })
            cy.findByRole("button", { name: "Zoom out" })
              .shouldBeEnabled()
              .click()
          })
        })

        it("removes the zoom-out ui", () => {
          // Removes the zoom indicator
          cy.findByTestId("zoom-indicator").should("not.exist")

          // Removes the zoom out button
          cy.findByTestId("zoom-out").should("not.be.visible")
        })
      })

      context("and there are more zooms", () => {
        it("restores the range to the whole video duration", () => {
          cy.appScenario("multiple_zoom")
          cy.forceLogin({ redirect_to: "/lessons" })
          cy.findByTestId("lesson-link").click()
          cy.disableDebounce()
          cy.findByTestId("edit-section").click({ force: true })
          cy.get("#section_start_time").shouldBeEnabled()
          cy.findByRole("button", { name: "Zoom out" })
            .shouldBeEnabled()
            .click({ force: true })
          cy.get("#section_start_time")
            .shouldBeEnabled()
            .should("have.value", 0)
          cy.get("#section_end_time").then((endTime) => {
            const max = parseFloat(endTime.attr("max"))
            const value = parseFloat(endTime.val())

            expect(value).to.equal(max)
          })
        })
      })
    })

    context("when we're creating a section", () => {
      beforeEach(() => {
        cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
          cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
          cy.disableDebounce()
          cy.findByText("New Section").shouldBeEnabled().click()
          cy.get("#section_start_time")
            .shouldBeEnabled()
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.findByRole("button", { name: "Zoom in" }).click()
        })
      })

      context("and there are no more zooms", () => {
        it("updates the UI consistently", () => {
          // Shows the zoom indicator
          cy.findByTestId("zoom-indicator").should("exist")

          // Shows the zoom out button
          cy.findByTestId("zoom-out").should("be.visible")

          // Resets the range
          cy.get("#section_start_time").should("have.value", 0.0)
          cy.get("#section_end_time").then((endTime) => {
            const max = parseFloat(endTime.attr("max"))
            const value = parseFloat(endTime.val())

            expect(value).to.equal(max)
          })

          // Disables the zoom in button
          cy.findByTestId("zoom-in").should("have.class", "disabled")
        })
      })

      context("and there are more zooms", () => {
        beforeEach(() => {
          cy.get("#section_start_time")
            .shouldBeEnabled()
            .invoke("val", 2.0)
            .trigger("input", { force: true })
            .should("have.value", 2.0)

          cy.findByRole("button", { name: "Zoom in" }).click({ force: true })

          cy.findByTestId("zoom-in").should("have.class", "disabled")

          cy.findByRole("button", { name: "Zoom out" })
            .shouldBeEnabled()
            .click({ force: true })
        })

        it("resets the range", () => {
          cy.get("#section_start_time")
            .shouldBeEnabled()
            .should("have.value", 0.0)
          cy.get("#section_end_time").then((endTime) => {
            const max = parseFloat(endTime.attr("max"))
            const value = parseFloat(endTime.val())

            expect(value).to.equal(max)
          })
        })
      })
    })
  })
})
