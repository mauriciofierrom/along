describe("Zoom", () => {
  it("the zoom option isn't available until we pick a section", () => {
    cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
      cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
      cy.reload()
      cy.findByText("New Section").click()
      cy.get('[data-name="zoom-in"]').should("not.be.visible")
      cy.get("#section_start_time")
        .invoke("val", 10.0)
        .trigger("input", { force: true })
      cy.get('[data-name="zoom-in"]').should("be.visible")
    })
  })

  describe("Zoom in", () => {
    beforeEach(() => {
      cy.appFactories([["create", "section"]]).then(([section]) => {
        cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
        cy.reload()
        cy.get(".fa-pencil-square-o").click({ force: true })
        cy.get("#section_start_time")
          .invoke("val", 10.0)
          .trigger("input", { force: true })
        cy.get("#section_end_time")
          .invoke("val", 20.0)
          .trigger("input", { force: true })
        cy.get(".fa-search-plus").click({ force: true })
      })
    })

    it("shows the zoom indicator", () => {
      cy.get(".zoom-indicator").should("exist")
    })

    it("shows the zoom out button", () => {
      cy.get('[data-name="zoom-out"]').should("exist").and("be.visible")
    })

    it("resets the range", () => {
      cy.get("#section_start_time").should("have.value", 0)
      cy.get("#section_end_time").then((endTime) => {
        const max = parseFloat(endTime.attr("max"))
        const value = parseFloat(endTime.val())

        expect(value).to.equal(max)
      })
    })

    it("the zoom in button is disabled", () => {
      cy.get('[data-name="zoom-in"]').should("have.class", "disabled")
    })

    context("when picking a point", () => {
      it("enables zoom in button again", () => {
        cy.get("#section_start_time")
          .invoke("val", 10)
          .trigger("input", { force: true })
        cy.get('[data-name="zoom-in"]').should("not.have.class", "disabled")
      })
    })
  })

  describe("Zoom out", () => {
    context("when we're editing a section", () => {
      context("if there are no more zooms", () => {
        beforeEach(() => {
          cy.appFactories([["create", "zoom"]]).then(() => {
            cy.forceLogin({ redirect_to: "/lessons" })
            cy.reload()
            cy.get(".video-card > .title").click()
            cy.get(".fa-pencil-square-o").click({ force: true })
            cy.get('[data-name="zoom-out"]').click()
          })
        })

        it("removes the zoom indicator", () => {
          cy.get(".zoom-indicator").should("not.exist")
        })

        it("removes the zoom out button", () => {
          cy.get('[data-name="zoom-out"]').should("not.be.visible")
        })
      })

      context("and there are more zooms", () => {
        it("restores the range to the whole video duration", () => {
          cy.appScenario("multiple_zoom")
          cy.forceLogin({ redirect_to: "/lessons" })
          cy.get(".video-card > .title").click()
          // FIXME: This should be changed to use factories once we swap the
          // section start/end times to seconds
          cy.get(".fa-pencil-square-o").click()
          cy.get('[data-name="zoom-out"]').click({ force: true })
          cy.get("#section_start_time").should("have.value", 0)
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
          cy.reload()
          cy.findByText("New Section").click()
          cy.get("#section_start_time")
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.get(".fa-search-plus").click()
        })
      })

      context("and there are no more zooms", () => {
        it("shows the zoom indicator", () => {
          cy.get(".zoom-indicator").should("exist")
        })

        it("shows the zoom out button", () => {
          cy.get('[data-name="zoom-out"]').should("exist").and("be.visible")
        })

        it("resets the range", () => {
          cy.get("#section_start_time").should("have.value", 0.0)
          cy.get("#section_end_time").then((endTime) => {
            const max = parseFloat(endTime.attr("max"))
            const value = parseFloat(endTime.val())

            expect(value).to.equal(max)
          })
        })

        it("the zoom in button is disabled", () => {
          cy.get('[data-name="zoom-in"]').should("have.class", "disabled")
        })
      })

      context("and there are more zooms", () => {
        beforeEach(() => {
          cy.get("#section_start_time")
            .invoke("val", 2.0)
            .trigger("input", { force: true })
          cy.wait(2000)
          cy.get(".fa-search-plus").click({ force: true })
          cy.wait(2000)
          cy.get('[data-name="zoom-out"]').click({ force: true })
        })

        it("resets the range", () => {
          cy.get("#section_start_time").should("have.value", 0.0)
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
