import React from 'react'
import { shallow, mount, render } from 'enzyme'
import { expect } from 'chai'
import sinon from 'sinon'

import { default as <%= componentName %> } from './<%= componentName %>'

var resource = null

beforeEach( () => {
  resource = {}
})

afterEach( () => {
  resource = null
})

describe('Testing the <<%= componentName %>/>', () => {
  it('should render a <<%= componentName %>> component', () => {
    const wrapper = shallow(<<%= componentName %> resource={resource} root={true}/>)
    assert.fail(0, 1, 'Write your tests here')
  })
})
