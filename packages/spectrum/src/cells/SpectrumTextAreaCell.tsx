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
import React from 'react';
import {
  CellProps,
  isMultiLineControl,
  RankedTester,
  rankWith,
} from '@jsonforms/core';
import { withJsonFormsCellProps } from '@jsonforms/react';
import { SpectrumRendererProps } from '../index';
import { withVanillaCellProps } from '../util/index';
import { TextArea } from '@adobe/react-spectrum';

export const SpectrumTextAreaCell = (
  props: CellProps & SpectrumRendererProps
) => {
  const {
    data,
    label,
    id,
    enabled,
    uischema,
    path,
    handleChange,
    isValid,
    schema,
  } = props;

  const onChange = (value: string) => handleChange(path, value);
  const maxLength = schema.maxLength;

  return (
    <TextArea
      value={data || ''}
      label={label}
      onChange={onChange}
      id={`${id}-input`}
      isDisabled={!enabled}
      autoFocus={uischema.options && uischema.options.focus}
      maxLength={maxLength}
      validationState={isValid ? 'valid' : 'invalid'}
    />
  );
};

/**
 * Tester for a multi-line string control.
 * @type {RankedTester}
 */
export const spectrumTextAreaCellTester: RankedTester = rankWith(
  2,
  isMultiLineControl
);

export default withJsonFormsCellProps(
  withVanillaCellProps(SpectrumTextAreaCell)
);