import React from 'react'
import {SelectDocumentsPage} from '../components/SelectDocuments'
import {Selector} from '../components/Selector'
import Adapter from 'enzyme-adapter-react-16'
import { shallowToJson } from 'enzyme-to-json'
import { configure, shallow, mount } from 'enzyme'
import chai from 'chai'
global.jestExpect = global.expect;
global.expect = chai.expect;
import sinon from 'sinon';


beforeAll(() => {
    configure({ adapter: new Adapter() })
  })

describe('<SelectDocumentsPage />', () => {
    it('renders two <Selector/> components', () => {
      const wrapper = shallow(<SelectDocumentsPage />);
      expect(wrapper.find(Selector)).to.have.lengthOf(2);
    });
  
    it('renders topBar', () => {
      const wrapper = shallow(<SelectDocumentsPage />);
      expect(wrapper.find('.topBar')).to.have.lengthOf(1);
      expect(wrapper.find('.iconTop')).to.have.lengthOf(1);
      expect(wrapper.find('.iconInfo')).to.have.lengthOf(1);
      expect(wrapper.find('.partnernamebox')).to.have.lengthOf(1);
      expect(wrapper.find('.partnername')).to.have.lengthOf(1);
    });

    it('renders input', () => {
        const wrapper = shallow(<SelectDocumentsPage />);
        expect(wrapper.find('.input-master')).to.have.lengthOf(1);
    });

    it('renders document select view', () => {
        const wrapper = shallow(<SelectDocumentsPage />);
        expect(wrapper.find('.displayView')).to.have.lengthOf(1);
        expect(wrapper.find('.displayCell')).to.have.lengthOf(2);
        expect(wrapper.find('.blockCustom')).to.have.lengthOf(3);
    });

    it('renders date selection', () => {
        const wrapper = shallow(<SelectDocumentsPage />);
        expect(wrapper.find('.dateDisplay')).to.have.lengthOf(1);
        expect(wrapper.find('.datePicker')).to.have.lengthOf(1);
    });

    it('renders nextButton', () => {
        const wrapper = shallow(<SelectDocumentsPage />);
        expect(wrapper.find('.nextButton')).to.have.lengthOf(1);
    });
  
    it('simulates click events', () => {
      const onButtonClick = sinon.spy();
      const wrapper = shallow(<Selector name='Available' documents={['lol']} update={onButtonClick} />);
      wrapper.find('button').simulate('click');
      expect(onButtonClick).to.have.property('callCount', 1);
    });
  });