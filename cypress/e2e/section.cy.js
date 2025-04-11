describe("Section", () => {
  it("Loads the section", () => {
    cy.appFactories([["create", "section"]]).then(([section]) => {
      cy.forceLogin({ redirect_to: "/lessons" })
      cy.get(".video-card > .title").click()
      cy.findByText(section.name).should("exist")
    })
  })

  describe("On create", () => {
    it("enables the range inputs when the video starts playing", () => {
      cy.appFactories([["create", "lesson"]]).then(([lesson]) => {
        cy.forceLogin({ redirect_to: `/lessons/${lesson.id}` })
        cy.findByText("New Section").click()
        cy.get("#section_start_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_end_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_start_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
        cy.get("#section_end_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
      })
    })

    describe("on validation error", () => {
      beforeEach(() => {
        cy.appFactories([["create", "section", { name: "My Section" }]]).then(
          ([section]) => {
            cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
            cy.reload()
            cy.findByText("New Section").click()
            cy.get("#section_name").type("My Section")
            cy.findByText("Create").click()
          },
        )
      })

      it("sets custom validity with the validation error message", () => {
        cy.get("#section_name").should(($field) => {
          expect($field.get(0).checkValidity()).to.equal(false)
          expect($field.get(0).validationMessage).to.equal(
            "has already been taken",
          )
        })
      })

      it("sets the invalid class on the element", () => {
        cy.get("#section_name").should("have.class", "invalid")
      })
    })
  })

  describe("On edit", () => {
    it("enables the range inputs when the video starts playing", () => {
      cy.appFactories([["create", "section"]]).then(([section]) => {
        cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
        cy.reload()
        cy.get(".fa-pencil-square-o").click({ force: true })
        cy.get("#section_start_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_end_time")
          .should("have.class", "disabled")
          .should("be.disabled")
        cy.get("#section_start_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
        cy.get("#section_end_time")
          .should("not.have.class", "disabled")
          .should("not.be.disabled")
      })
    })

    describe("on validation error", () => {
      beforeEach(() => {
        cy.appFactories([["create", "section", { name: "My Section" }]]).then(
          ([section]) => {
            cy.appFactories([
              [
                "create",
                "section",
                { name: "Other Section", lesson_id: section.lesson_id },
              ],
            ]).then(() => {
              cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
              cy.reload()
              cy.get(".fa-pencil-square-o").eq(1).click({ force: true })
              cy.get("#section_name").clear().type("My Section")
              cy.findByText("Create").click()
            })
          },
        )
      })

      it("sets custom validity with the validation error message", () => {
        cy.get("#section_name").should(($field) => {
          expect($field.get(0).checkValidity()).to.equal(false)
          expect($field.get(0).validationMessage).to.equal(
            "has already been taken",
          )
        })
      })

      it("sets the invalid class on the element", () => {
        cy.get("#section_name").should("have.class", "invalid")
      })
    })
  })

  /**
   * Due to the way stimulus augments events we have to re-implement a lot of
   * stuff which is not good. Still, it helps make sure that the swap happens,
   * but I wouldn't feel too bad removing this one.
   */
  describe("On drag-n-drop re-order", () => {
    beforeEach(() => {
      cy.appScenario("multiple_sections")
      cy.forceLogin({ redirect_to: "/lessons" })
      cy.get(".video-card > .title").click()
      cy.get(".item").eq(1).findByText("Section 2")
      cy.get(".item")
        .last()
        .then(($lastItem) => {
          cy.wrap($lastItem).trigger("dragstart", {
            dataTransfer: new DataTransfer(),
          })
          cy.get(".item")
            .first()
            .then(($firstItem) => {
              const data = new DataTransfer()
              data.setData(
                "application/section-id",
                $lastItem.data("sectionId"),
              )
              data.dropEffect = "move"
              cy.wrap($firstItem).trigger("drop", {
                dataTransfer: data,
                currentTarget: $lastItem.get(0),
              })
            })
        })
    })

    it("swaps the places of the sections", () => {
      cy.get(".item").first().findByText("Section 3")
      cy.get(".item").last().findByText("Section 1")
    })

    it("makes the changes persistent", () => {
      cy.reload()
      cy.get(".item").first().findByText("Section 3")
      cy.get(".item").last().findByText("Section 1")
    })

    it("doesn't affect the other sections", () => {
      cy.get(".item").eq(1).findByText("Section 2")
    })
  })

  describe("On playback", () => {
    describe("on player restriction", () => {
      it("should show the player restriction popover", () => {
        cy.appFactories([
          ["create", "section", { name: "Restriction Section" }],
        ]).then(([section]) => {
          cy.forceLogin({ redirect_to: `/lessons/${section.lesson_id}` })
          cy.reload()
          cy.get("#player-restriction").should("have.class", "hidden")
          cy.get("#player").then(([player]) => {
            player.dataset.restriction = "user_action_required"
            cy.findByText("Restriction Section").click({ force: true })
            cy.get("#player-restriction").should("not.have.class", "hidden")
            cy.findByText("Playback Restriction")
          })
        })
      })
    })
  })
})
