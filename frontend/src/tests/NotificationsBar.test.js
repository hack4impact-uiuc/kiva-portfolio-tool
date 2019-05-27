import React from 'react'
import { Notification } from '../components/Notification'
import { NotificationsBar } from '../components/NotificationsBar'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
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
  let props = {
    isPM: true,
    allMessages: ['yadayada'],
    allInformation: ['info here']
  }
  const component = shallow(<NotificationsBar {...props} />)

  let tree = shallowToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('< />', () => {
  let props = {
    isPM: true,
    allMessages: ['yadayada'],
    allInformation: ['info here']
  }
  it('renders All major components', () => {
    const wrapper = shallow(<NotificationsBar {...props} />)
    expect(wrapper.find(Tab)).to.have.lengthOf(2)
    expect(wrapper.find(TabList)).to.have.lengthOf(1)
    expect(wrapper.find(TabPanel)).to.have.lengthOf(2)
    expect(wrapper.find(Tabs)).to.have.lengthOf(1)
  })

  it('renders css', () => {
    const wrapper = shallow(<NotificationsBar {...props} />)
    expect(wrapper.find('.tab')).to.have.lengthOf(2)
    expect(wrapper.find('.tab-font')).to.have.lengthOf(2)
  })
})
