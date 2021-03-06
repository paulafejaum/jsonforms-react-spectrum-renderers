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
import * as React from 'react';
import {
  ControlElement,
  getData,
  HorizontalLayout,
  JsonSchema,
  update,
} from '@jsonforms/core';
import { JsonFormsReduxContext } from '@jsonforms/react';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme, { mount, ReactWrapper } from 'enzyme';
import SpectrumNumberCell, {
  spectrumNumberCellTester,
} from '../../src/cells/SpectrumNumberCell';
import SpectrumHorizontalLayoutRenderer from '../../src/layouts/SpectrumHorizontalLayout';
import { initJsonFormsSpectrumStore } from '../spectrumStore';

Enzyme.configure({ adapter: new Adapter() });

const controlElement: ControlElement = {
  type: 'Control',
  scope: '#/properties/foo',
};

const fixture = {
  data: { foo: 3.14 },
  schema: {
    type: 'number',
    minimum: 5,
  },
  uischema: controlElement,
};

describe('Number cell tester', () => {
  test('tester', () => {
    expect(spectrumNumberCellTester(undefined, undefined)).toBe(-1);
    expect(spectrumNumberCellTester(null, undefined)).toBe(-1);
    expect(spectrumNumberCellTester({ type: 'Foo' }, undefined)).toBe(-1);
    expect(spectrumNumberCellTester({ type: 'Control' }, undefined)).toBe(-1);
  });

  test('tester with wrong schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      spectrumNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
        },
      })
    ).toBe(-1);
  });

  test('tester with wrong schema type, but sibling has correct one', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      spectrumNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          bar: {
            type: 'number',
          },
        },
      })
    ).toBe(-1);
  });

  test('tester with machting schema type', () => {
    const control: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    expect(
      spectrumNumberCellTester(control, {
        type: 'object',
        properties: {
          foo: {
            type: 'number',
          },
        },
      })
    ).toBe(2);
  });
});

describe('Number cell', () => {
  let wrapper: ReactWrapper;

  afterEach(() => wrapper.unmount());

  test.skip('autofocus on first element', () => {
    const schema: JsonSchema = {
      type: 'object',
      properties: {
        firstNumberCell: { type: 'number', minimum: 5 },
        secondNumberCell: { type: 'number', minimum: 5 },
      },
    };
    const firstControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/firstNumberCell',
      options: {
        focus: true,
      },
    };
    const secondControlElement: ControlElement = {
      type: 'Control',
      scope: '#/properties/secondNumberCell',
      options: {
        focus: true,
      },
    };
    const uischema: HorizontalLayout = {
      type: 'HorizontalLayout',
      elements: [firstControlElement, secondControlElement],
    };
    const data = {
      firstNumberCell: 3.14,
      secondNumberCell: 5.12,
    };
    const store = initJsonFormsSpectrumStore({
      data,
      schema,
      uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumHorizontalLayoutRenderer
            schema={schema}
            uischema={uischema}
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const inputs = wrapper.find('input');
    expect(document.activeElement).toBe(inputs.at(0));
    expect(document.activeElement).toBe(inputs.at(1));
  });

  test('autofocus active', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: true,
      },
    };
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(document.activeElement).toBe(input);
  });

  test('autofocus inactive', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
      options: {
        focus: false,
      },
    };
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
    });

    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('autofocus inactive by default', () => {
    const uischema: ControlElement = {
      type: 'Control',
      scope: '#/properties/foo',
    };
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.autofocus).toBe(false);
  });

  test('render', () => {
    const schema: JsonSchema = { type: 'number' };
    const store = initJsonFormsSpectrumStore({
      data: { foo: 3.14 },
      schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.type).toBe('number');
    // todo: react-spectrum does not yet support the step attribute
    // expect(input.step).toBe('0.1');
    expect(input.value).toBe('3.14');
  });

  test.skip('has classes set', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );

    const input = wrapper.find('input');
    expect(input.hasClass('input')).toBe(true);
    expect(input.hasClass('validate')).toBe(true);
    expect(input.hasClass('valid')).toBe(true);
  });

  test('update via input event', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input');
    input.simulate('change', { target: { value: '2.72' } });
    wrapper.update();
    expect(getData(store.getState()).foo).toBe(2.72);
  });

  test('update via action', () => {
    const store = initJsonFormsSpectrumStore({
      data: { foo: 2.72 },
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('2.72');
    store.dispatch(update('foo', () => 3.14));
    wrapper.update();
    expect(input.value).toBe('3.14');
  });

  test('update with undefined value', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update('foo', () => undefined));
    expect(input.value).toBe('');
  });

  test('update with null value', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update('foo', () => null));
    expect(input.value).toBe('');
  });

  test('update with wrong ref', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update('bar', () => 11));
    expect(input.value).toBe('3.14');
  });

  test('update with null ref', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    store.dispatch(update(null, () => 2.72));
    expect(input.value).toBe('3.14');
  });

  test('update with undefined ref', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    store.dispatch(update(undefined, () => 13));
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.value).toBe('3.14');
  });

  test('disable', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            enabled={false}
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(true);
  });

  test('enabled by default', () => {
    const store = initJsonFormsSpectrumStore({
      data: fixture.data,
      schema: fixture.schema,
      uischema: fixture.uischema,
    });
    wrapper = mount(
      <Provider store={store}>
        <JsonFormsReduxContext>
          <SpectrumNumberCell
            schema={fixture.schema}
            uischema={fixture.uischema}
            path='foo'
          />
        </JsonFormsReduxContext>
      </Provider>
    );
    const input = wrapper.find('input').getDOMNode() as HTMLInputElement;
    expect(input.disabled).toBe(false);
  });
});
