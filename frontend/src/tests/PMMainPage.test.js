import React from 'react'
<<<<<<< HEAD
import {PMMainPage} from '../components/PMMainPage'
=======
import { PMMainPage } from '../components/PMMainPage'
>>>>>>> e7f92789976f46ed8eb9d0a78910e1ed9d70f66c
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson, mountToJson } from 'enzyme-to-json'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
<<<<<<< HEAD
global.jestExpect = global.expect;
global.expect = chai.expect;
import sinon from 'sinon';


beforeAll(() => {
    configure({ adapter: new Adapter() })
  })
  
test('PMMainPage renders correctly', () => {
    const component = mount(<PMMainPage />)

    let tree = mountToJson(component)
    jestExpect(tree).toMatchSnapshot()
})
  

describe('<PMMainPage />', () => {
    it('calls componentDidMount', () => {
      sinon.spy(PMMainPage.prototype, 'componentDidMount');
      const wrapper = mount(<PMMainPage />);
      expect(PMMainPage.prototype.componentDidMount).to.have.property('callCount', 1);
      PMMainPage.prototype.componentDidMount.restore();
    });
  });
=======
global.jestExpect = global.expect
global.expect = chai.expect
import sinon from 'sinon'

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

test('PMMainPage renders correctly', () => {
  const component = mount(<PMMainPage />)

  let tree = mountToJson(component)
  jestExpect(tree).toMatchSnapshot()
})

describe('<PMMainPage />', () => {
  it('calls componentDidMount', () => {
    sinon.spy(PMMainPage.prototype, 'componentDidMount')
    const wrapper = mount(<PMMainPage />)
    expect(PMMainPage.prototype.componentDidMount).to.have.property('callCount', 1)
    PMMainPage.prototype.componentDidMount.restore()
  })
})
>>>>>>> e7f92789976f46ed8eb9d0a78910e1ed9d70f66c
