import React from 'react'
import { LanguageSelector } from '../components/LanguageSelector'
import Select from 'react-select'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson, mountToJson } from 'enzyme-to-json'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
global.jestExpect = global.expect
global.expect = chai.expect
import sinon from 'sinon'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test(' renders correctly', () => {
  const component = mount(<LanguageSelector />)

  let tree = mountToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('< />', () => {
  it('renders All major components', () => {
    const wrapper = mount(<LanguageSelector />)
    expect(wrapper.find(Select)).to.have.lengthOf(1)
  })

  it('renders css', () => {
    const wrapper = mount(<LanguageSelector />)
    expect(wrapper.find('.langSelect')).to.have.lengthOf(4)
  })
})
