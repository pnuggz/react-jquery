export const contactOutput = () => {
  const id = $(event.target).attr('id')
  const val = $(event.target).val()
  jsonpropValueSetter(id, val)
}

export const emailOutput = () => {
  const id = $(event.target).attr('id')
  const val = $(event.target).val()
  jsonpropValueSetter(id, val)
}

const jsonpropValueSetter = (id, val) => {
  window.jsonprops.pages.forEach((page, pageIndex) => {
    if(page.elements.length === 0) {
      return true
    }

    page.elements.forEach((element, elementIndex ) => {
      if(element.element_id === id) {
        window.jsonprops.pages[pageIndex].elements[elementIndex].template_untrimmed_value = val
      }
    })
  })
}