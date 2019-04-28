import React from 'react'
import {DocumentClassPage} from '../components/DocumentClassPage'
import {NavBar} from '../components/NavBar'
import { Button, Modal, ModalBody, ModalFooter, Table, Label, Media } from 'reactstrap'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson, mountToJson } from 'enzyme-to-json'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
global.jestExpect = global.expect;
global.expect = chai.expect;
import sinon from 'sinon';


beforeAll(() => {
    configure({ adapter: new Adapter() })
  })

test('DocumentClassPage renders correctly', () => {
    const component = shallow(<DocumentClassPage/>)

    let tree = shallowToJson(component)
    jestExpect(tree).toMatchSnapshot()
})

describe('<DocumentClassPage />', () => {
    it('renders All major components', () => {
      const wrapper = shallow(<DocumentClassPage/>);
      expect(wrapper.find(Modal)).to.have.lengthOf(1);
      expect(wrapper.find(Button)).to.have.lengthOf(3);
      expect(wrapper.find(Table)).to.have.lengthOf(1);

    });
  
    it('renders css in modal', () => {
        const wrapper = shallow(<DocumentClassPage/>);
        expect(wrapper.find('.dropPage')).to.have.lengthOf(1);
      expect(wrapper.find('.droppedBox')).to.have.lengthOf(1);
      expect(wrapper.find('.dropZone')).to.have.lengthOf(1);
      expect(wrapper.find('.invalidSearchButton')).to.have.lengthOf(1);
    });

    it('renders css in button', () => {
        const wrapper = shallow(<DocumentClassPage/>);
      expect(wrapper.find('.edit-banner')).to.have.lengthOf(1);
      expect(wrapper.find('.h1')).to.have.lengthOf(1);
      expect(wrapper.find('.add-doc-text')).to.have.lengthOf(2);
      expect(wrapper.find('.addImg')).to.have.lengthOf(1);

    });

    it('renders css in table ', () => {
        const wrapper = shallow(<DocumentClassPage/>);
      expect(wrapper.find('.doc-table')).to.have.lengthOf(1);
      expect(wrapper.find('.theader-centered')).to.have.lengthOf(1);

    });
  
  });