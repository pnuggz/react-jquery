// ES modules
import React from 'react'
import ReactDOM from 'react-dom'
import * as customFunctions from "./customFunction/test"
const json = require('./json/test.json');

json.name = 0
json.input = ''
json.pages.forEach((page, pageIndex) => {
  if(page.elements.length === 0) {
    return true
  }

  page.elements.forEach((element, elementIndex ) => {
    if(element.default_value) {
      const defaultConfig = element.default_value
      const defaultType = defaultConfig.type.toLowerCase()
  
      switch(defaultType) {
        case 'auto': 
          json.pages[pageIndex].elements[elementIndex].template_untrimmed_value = 'TEST TEST TEST'
          break;
        case 'manual':
          json.pages[pageIndex].elements[elementIndex].template_untrimmed_value = defaultConfig.value
          break;
        default:
          break;
      }
    } else {
      json.pages[pageIndex].elements[elementIndex].template_untrimmed_value = ''
    }
  })
})

// The initial configuration props
window.jsonprops = json

const jsonprops = window.jsonprops

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

const InputText = (element) => {
  const id = element.element_id
  return (
    <div>
      <p>{element.element_label}</p>
      <p><input key={id} id={id} type="text" value={element.template_untrimmed_value} onChange={() => {}} /></p>
    </div>
  )
}

const FormGenerator = (props) => {
  const config = props
  const elements = config.pages
  .filter((page) => {
    if(page.elements.length === 0) {
      return false
    }
    return true
  })
  .map((page) => {
    return page.elements.map((element) => {
      return element
    })
  })
  .flat()

  const renderForm = () => {
    return elements.map((element) => {
      const elemType = element.element.toLowerCase()

      switch(elemType) {
        case 'text': 
          return <InputText {...element} />
        default:
          return null
      }
    })
  }

  return (
    <div>
      {renderForm()}
    </div>
  )
}

// This is where it finally renders the whole templating application
const Application = (jsonprops) => {
  return(
    <div>
      <h1>{jsonprops.id}</h1>
      <FormGenerator {...jsonprops} />
    </div>
  )
}

const render = () => {
  // This is where the form is rerendered
  ReactDOM.render(<Application {...jsonprops} />, document.getElementById('template__form-wrapper'))

  // This is where the canvas is rerender
  // getAllInputData(true)
  // blah blah blah
}


// This is the initial render
render()


// This is where prefilled data is injected
// $('#userselect').on('change', () => { .... render()})





// Functions to bind event listeners
const defaultInputFunction = (event) => {
  const id = $(event.target).attr('id')
  const val = $(event.target).val()
  jsonpropValueSetter(id, val)
}

const customFunctionCreator = (element, condition) => {
  const elemId = element.element_id

  $(`#${elemId}`).on('input change', (event) => {
    if(Array.isArray(condition.function)) {
      for(let i = 0; i<condition.function.length; i++) {
        eval(`customFunctions.${condition.function[i]}`)
      }
    } else {
      eval(`customFunctions.${condition.function}`)
    }

    render()
  })
}

const defaultFunctionCreator = (element) => {
  const elemType = element.element
  const elemId = element.element_id

  $(`#${elemId}`).on('input change', (event) => {
    if(
      elemType === "text"
    ) {
      defaultInputFunction(event)
    }
    
    render()
  })
}


// Custom function binding on INPUT & CHANGE
window.jsonprops.pages.forEach(page => {
  if(page.elements.length === 0) {
    return true
  }

  page.elements.forEach(element => {
    if(element.rules && element.rules.conditions) {
      element.rules.conditions.forEach(condition => {
        customFunctionCreator(element, condition)
      })
    } else {
      defaultFunctionCreator(element)
    }
  })
});




// proxy handler
const handler = {
  set(target, key, value) {
    target[key] = value;
    render()
  },
};

// window.jsonprops.on('propUpdate', () => { render() })
window.updateJsonprops = {}

let i = 0;
const callbackProxy = (object) => {
  let key = i

  if(typeof object === "object") {
    Object.keys(object).forEach((objkey) => {
      key = objkey
      const obj = object[objkey]
      callbackProxy(obj)
    })
  } else if (typeof object === "array") {
    object.forEach((obj,arrKey) => {
      key = arrKey
      callbackProxy(obj)
    })
  } else {
    let prox = new Proxy(window.jsonprops, handler)
    window.updateJsonprops.jsonprops = prox
  }

  i++
}

callbackProxy(window.jsonprops)
