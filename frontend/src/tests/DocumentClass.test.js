import React from 'react'
import { DocumentClass } from '../components/DocumentClass'
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap'
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

test('DocumentClass renders correctly', () => {
  let props = { name: 'testing', description: 'testingaswell' }
  const component = shallow(<DocumentClass documentClass={props} />)

  let tree = mountToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('<DocumentClass />', () => {
  it('renders <Modal/> components', () => {
    let props = { name: 'testing', description: 'testingaswell' }
    const wrapper = shallow(<DocumentClass documentClass={props} />)
    expect(wrapper.find(Modal)).to.have.lengthOf(2)
  })

  it('renders dropPage', () => {
    let props = { name: 'testing', description: 'testingaswell' }
    const wrapper = shallow(<DocumentClass documentClass={props} />)
    expect(wrapper.find('.dropPage')).to.have.lengthOf(1)
    expect(wrapper.find('.droppedBox')).to.have.lengthOf(1)
    expect(wrapper.find('.dropZone')).to.have.lengthOf(1)
  })

  it('renders invalidSearchButtons', () => {
    let props = { name: 'testing', description: 'testingaswell' }
    const wrapper = shallow(<DocumentClass documentClass={props} />)
    expect(wrapper.find('.invalidSearchButton')).to.have.lengthOf(3)
  })

  it('renders interaction', () => {
    let props = { name: 'testing', description: 'testingaswell' }
    const wrapper = shallow(<DocumentClass documentClass={props} />)
    expect(wrapper.find('.interaction')).to.have.lengthOf(1)
  })
})
