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
})
