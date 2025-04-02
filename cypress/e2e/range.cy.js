describe("Range", () => {
  describe("when not zoomed-in", () => {
    beforeEach(() => {
      cy.appFactories([
        ["create", "lesson", { duration_in_seconds: 100 }],
      ]).then(([lesson]) => {
        cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
        cy.reload()
        cy.findByText("New Section").click()
        cy.wait(1000)
      })
    })

    describe("and picking the starting point", () => {
      describe("and first point pick", () => {
        it("makes the opposite value defaults to 10% of the whole duration", () => {
          cy.get("#section_start_time")
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.get("#section_end_time").should("have.value", 20.0)
        })

        describe("and setting a value too close to the end", () => {
          it("sets the end value to the end of the duration", () => {
            cy.get("#section_start_time")
              .invoke("val", 95.0)
              .trigger("input", { force: true })
            cy.get("#section_end_time").should("have.value", 100.0)
          })
        })
      })

      describe("and not first point pick", () => {
        it("keeps the opposite value unchanged", () => {
          cy.get("#section_start_time")
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_start_time")
            .invoke("val", 12.0)
            .trigger("input", { force: true })
          cy.get("#section_end_time").should("have.value", 20.0)
        })
      })
    })

    describe("and picking the ending point", () => {
      describe("and first point pick", () => {
        it("makes the opposite value defaults to 10% of the whole duration", () => {
          cy.get("#section_end_time")
            .invoke("val", 20.0)
            .trigger("input", { force: true })
          cy.get("#section_start_time").should("have.value", 10.0)
        })

        describe("and setting the value too close to the start", () => {
          it("sets the start value to zero", () => {
            cy.get("#section_end_time")
              .invoke("val", 5.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 0.0)
          })
        })
      })

      describe("and not first point pick", () => {
        it("keeps the opposite value unchanged", () => {
          cy.get("#section_end_time")
            .invoke("val", 20.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_end_time")
            .invoke("val", 22.0)
            .trigger("input", { force: true })
          cy.get("#section_start_time").should("have.value", 10.0)
        })
      })
    })
  })

  describe("when zoomed-in", () => {
    beforeEach(() => {
      cy.appScenario("predictable_zoom")
      cy.forceLogin({ redirect_to: "/lessons" })
      cy.reload()
      cy.get(".video-card > .title").click()
      cy.get(".fa-pencil-square-o").click({ force: true })
    })

    describe("and picking the starting poing", () => {
      describe("and first point pick", () => {
        it("doesn't move the opposite point", () => {
          cy.get("#section_start_time")
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.get("#section_end_time").should("have.value", 257.14)
        })
      })

      describe("and not first point pick", () => {
        it("doesn't move the oppositve point", () => {
          cy.get("#section_start_time")
            .invoke("val", 10.0)
            .trigger("input", { force: true })
          cy.get("#section_end_time").should("have.value", 257.14)
          cy.get("#section_start_time")
            .invoke("val", 5.0)
            .trigger("input", { force: true })
          cy.get("#section_end_time").should("have.value", 257.14)
        })
      })
    })

    describe("and picking the ending poing", () => {
      describe("and first point pick", () => {
        it("doesn't move the opposite point", () => {
          cy.get("#section_end_time")
            .invoke("val", 20.0)
            .trigger("input", { force: true })
          cy.get("#section_start_time").should("have.value", 85.71)
        })
      })

      describe("and not first point pick", () => {
        it("doesn't move the oppositve point", () => {
          cy.get("#section_end_time")
            .invoke("val", 20.0)
            .trigger("input", { force: true })
          cy.get("#section_start_time").should("have.value", 85.71)
          cy.get("#section_end_time")
            .invoke("val", 25.0)
            .trigger("input", { force: true })
          cy.get("#section_start_time").should("have.value", 85.71)
        })
      })
    })
  })

  describe("zooming in", () => {
    beforeEach(() => {
      cy.appFactories([
        ["create", "lesson", { duration_in_seconds: 1500 }],
      ]).then(([lesson]) => {
        cy.appFactories([
          [
            "create",
            "section",
            { start_time: 180.0, end_time: 340.0, lesson_id: lesson.id },
          ],
        ]).then(() => {
          cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
          cy.get(".fa-pencil-square-o").click()
          cy.wait(1000)
          cy.get(".fa-search-plus").click({ force: true })
          cy.wait(1000)
        })
      })
    })

    describe("and picking the starting point", () => {
      describe("and first point pick", () => {
        it("makes the opposite value defaults to 10% of the active zoom duration", () => {
          cy.get("#section_start_time")
            .invoke("val", 150.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_end_time").should("have.value", 300.0)
        })
      })

      describe("and not first point pick", () => {
        it("doesn't move the opposite point", () => {
          cy.get("#section_start_time")
            .invoke("val", 150.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_start_time")
            .invoke("val", 50.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_end_time").should("have.value", 300.0)
        })
      })

      describe("two levels", () => {
        beforeEach(() => {
          cy.get("#section_start_time")
            .invoke("val", 150.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get(".fa-search-plus").click({ force: true })
          cy.wait(1000)
        })

        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time")
              .invoke("val", 50.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })
      })
    })

    describe("and picking the ending point", () => {
      describe("and first point pick", () => {
        it("makes the opposite value defaults to 10% of the active zoom duration", () => {
          cy.get("#section_end_time")
            .invoke("val", 300.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_start_time").should("have.value", 150.0)
        })
      })

      describe("and not first point pick", () => {
        it("doesn't move the opposite point", () => {
          cy.get("#section_end_time")
            .invoke("val", 300.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_end_time")
            .invoke("val", 400.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get("#section_start_time").should("have.value", 150.0)
        })
      })

      describe("two levels", () => {
        beforeEach(() => {
          cy.get("#section_end_time")
            .invoke("val", 300.0)
            .trigger("input", { force: true })
          cy.wait(1000)
          cy.get(".fa-search-plus").click({ force: true })
          cy.wait(1000)
        })

        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time")
              .invoke("val", 400.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })
      })
    })
  })

  describe("zooming out", () => {
    describe("when zooming out to full-duration", () => {
      beforeEach(() => {
        cy.appScenario("one_zoom")
        cy.forceLogin({ redirect_to: "/lessons/" })
        cy.get(".video-card > .title").click()
        cy.get(".fa-pencil-square-o").click()
        cy.wait(1000)
        cy.get('[data-name="zoom-out"]').click()
        cy.wait(2000)
      })
      describe("when picking the starting point", () => {
        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time")
              .invoke("val", 50.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })
      })

      describe("when picking the ending point", () => {
        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time")
              .invoke("val", 350.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })
      })
    })

    describe("when zooming-out to a zoom", () => {
      beforeEach(() => {
        cy.appScenario("two_zoom")
        cy.forceLogin({ redirect_to: "/lessons/" })
        cy.get(".video-card > .title").click()
        cy.get(".fa-pencil-square-o").click()
        cy.wait(1000)
        cy.get('[data-name="zoom-out"]').click()
        cy.wait(2000)
      })
      describe("when picking the starting point", () => {
        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_start_time")
              .invoke("val", 150.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time")
              .invoke("val", 50.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time").should("have.value", 300.0)
          })
        })
      })

      describe("when picking the ending point", () => {
        describe("and first point pick", () => {
          it("makes the opposite value defaults to 10% of the active zoom duration", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })

        describe("and not first point pick", () => {
          it("doesn't move the opposite point", () => {
            cy.get("#section_end_time")
              .invoke("val", 300.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_end_time")
              .invoke("val", 350.0)
              .trigger("input", { force: true })
            cy.wait(1000)
            cy.get("#section_start_time").should("have.value", 150.0)
          })
        })
      })
    })
  })
})
