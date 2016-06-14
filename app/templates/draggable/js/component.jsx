import React from 'react'
import BaseComponent from 'aem-with-react/BaseComponent'
import './<%= componentName %>.css'

export default class <%= componentName %> extends BaseComponent {
  renderBody() {
    return (
      <div className='<%= componentName %>'></div>
    )
  }
}
