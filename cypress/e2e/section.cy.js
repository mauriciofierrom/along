describe("Section", () => {
  it("Loads the section", () => {
    let sectionName

    cy.appFactories([["create", "section"]]).then(([section]) => {
      console.log(section)
      sectionName = section.name

      cy.forceLogin({ redirect_to: "/lessons"})
      cy.get(".video-card > .title").click()
      cy.contains(sectionName)
    })
  })
})
