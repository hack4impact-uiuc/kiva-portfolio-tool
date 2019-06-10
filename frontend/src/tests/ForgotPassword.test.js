import React from 'react'
import { ForgotPassword } from '../components/auth/ForgotPassword'
import { Form, Button, FormGroup, Input, Card, CardBody, CardTitle } from 'reactstrap'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow } from 'enzyme'
import chai from 'chai'
global.jestExpect = global.expect
global.expect = chai.expect

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test(' renders correctly', () => {
  const component = shallow(<ForgotPassword />)

  let tree = shallowToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('< />', () => {
  it('renders All major components', () => {
    const wrapper = shallow(<ForgotPassword />)
    expect(wrapper.find(Form)).to.have.lengthOf(1)
    expect(wrapper.find(Button)).to.have.lengthOf(1)
    expect(wrapper.find(FormGroup)).to.have.lengthOf(1)
    expect(wrapper.find(Input)).to.have.lengthOf(1)
    expect(wrapper.find(Card)).to.have.lengthOf(1)
    expect(wrapper.find(CardBody)).to.have.lengthOf(1)
    expect(wrapper.find(CardTitle)).to.have.lengthOf(1)
  })

  it('renders css', () => {
    const wrapper = shallow(<ForgotPassword />)
    expect(wrapper.find('.nav-absolute')).to.have.lengthOf(1)
    expect(wrapper.find('.background')).to.have.lengthOf(1)
    expect(wrapper.find('.foreground')).to.have.lengthOf(1)
    expect(wrapper.find('.interview-card')).to.have.lengthOf(1)
    expect(wrapper.find('.text-centered')).to.have.lengthOf(2)
  })
})
