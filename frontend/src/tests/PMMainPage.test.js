import React from 'react'
import { PMMainPage } from '../components/PMMainPage'
import Adapter from 'enzyme-adapter-react-16'
import { mountToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import chai from 'chai'
global.jestExpect = global.expect
global.expect = chai.expect
import sinon from 'sinon'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('PMMainPage renders correctly', () => {
  const component = shallow(<PMMainPage />)

  let tree = mountToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('<PMMainPage />', () => {
  it('calls componentDidMount', () => {
    sinon.spy(PMMainPage.prototype, 'componentDidMount')
    const wrapper = shallow(<PMMainPage />)
    expect(PMMainPage.prototype.componentDidMount).to.have.property('callCount', 1)
    PMMainPage.prototype.componentDidMount.restore()
  })
})
