/*
  The MIT License
  
  Copyright (c) 2017-2019 EclipseSource Munich
  https://github.com/eclipsesource/jsonforms
  
  Copyright (c) 2020 headwire.com, Inc
  https://github.com/headwirecom/jsonforms-react-spectrum-renderers
  
  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:
  
  The above copyright notice and this permission notice shall be included in
  all copies or substantial portions of the Software.
  
  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
  THE SOFTWARE.
*/
import { GroupLayout, RuleEffect, SchemaBasedCondition } from '@jsonforms/core';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { ReactWrapper } from 'enzyme';
import GroupLayoutRenderer, {
  spectrumGroupLayoutTester,
} from '../../src/layouts/SpectrumGroupLayout';
import { mountForm } from '../util';

Enzyme.configure({ adapter: new Adapter() });

test('tester', () => {
  expect(spectrumGroupLayoutTester(undefined, undefined)).toBe(-1);
  expect(spectrumGroupLayoutTester(null, undefined)).toBe(-1);
  expect(spectrumGroupLayoutTester({ type: 'Foo' }, undefined)).toBe(-1);
  expect(spectrumGroupLayoutTester({ type: 'Group' }, undefined)).toBe(1);
});

describe('Group layout', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test('render without label', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [],
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper.find(GroupLayoutRenderer).getDOMNode();
    const heading = groupLayout.querySelector('h4');
    expect(heading).toBeNull();
  });

  test('render with label', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      label: 'Foo',
      elements: [],
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper.find(GroupLayoutRenderer).getDOMNode();
    const heading = groupLayout.querySelector('h4');
    expect(heading?.textContent).toBe('Foo');
  });

  test('render with null elements', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: null,
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper.find(GroupLayoutRenderer).getDOMNode();
    const content = groupLayout.querySelector('section');
    expect(content?.children).toHaveLength(0);
  });

  test('render with children', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [{ type: 'Control' }, { type: 'Control' }],
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper.find(GroupLayoutRenderer).getDOMNode();
    const content = groupLayout.querySelector('section');
    expect(content?.children).toHaveLength(2);
  });

  test('hide', () => {
    // Condition that evaluates to false
    const condition: SchemaBasedCondition = {
      scope: '',
      schema: {},
    };
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [{ type: 'Control' }],
      rule: {
        effect: RuleEffect.HIDE,
        condition,
      },
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper
      .find(GroupLayoutRenderer)
      .getDOMNode() as HTMLElement;
    expect(groupLayout.style.display).toBe('none');
  });

  test('show by default', () => {
    const uischema: GroupLayout = {
      type: 'Group',
      elements: [{ type: 'Control' }],
    };
    wrapper = mountForm(uischema);

    const groupLayout = wrapper
      .find(GroupLayoutRenderer)
      .getDOMNode() as HTMLElement;
    expect(groupLayout.style.display).not.toBe('none');
  });
});
