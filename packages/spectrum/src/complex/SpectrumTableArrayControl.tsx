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
import fpfilter from 'lodash/fp/filter';
import fpmap from 'lodash/fp/map';
import fpflow from 'lodash/fp/flow';
import fpkeys from 'lodash/fp/keys';
import fpstartCase from 'lodash/fp/startCase';
import {
  ArrayControlProps,
  ControlElement,
  createDefaultValue,
  Helpers,
  isPlainLabel,
  Paths,
  RankedTester,
  Resolve,
  Test,
} from '@jsonforms/core';
import { DispatchCell, withJsonFormsArrayControlProps } from '@jsonforms/react';
import {
  Cell,
  Column,
  Row,
  Table,
  TableBody,
  TableHeader,
} from '@react-spectrum/table';
import {
  ActionButton,
  Button,
  Flex,
  Header,
  Heading,
  Text,
  Tooltip,
  TooltipTrigger,
  View,
} from '@adobe/react-spectrum';

import './table-cell.css';

import Add from '@spectrum-icons/workflow/Add';
import Delete from '@spectrum-icons/workflow/Delete';
import { ErrorObject } from 'ajv';
import AlertCircle from '@spectrum-icons/workflow/AlertCircle';

const { createLabelDescriptionFrom } = Helpers;

const { or, isObjectArrayControl, isPrimitiveArrayControl, rankWith } = Test;

/**
 * Alternative tester for an array that also checks whether the 'table'
 * option is set.
 * @type {RankedTester}
 */
export const spectrumTableArrayControlTester: RankedTester = rankWith(
  3,
  or(isObjectArrayControl, isPrimitiveArrayControl)
);

class SpectrumTableArrayControl extends React.Component<
  ArrayControlProps,
  any
> {
  confirmDelete = (path: string, index: number) => {
    const p = path.substring(0, path.lastIndexOf('.'));
    this.props.removeItems(p, [index])();
  };

  render() {
    const {
      addItem,
      uischema,
      schema,
      rootSchema,
      path,
      data,
      visible,
      errors,
      label,
      childErrors,
    } = this.props;

    const controlElement = uischema as ControlElement;

    const createControlElement = (key?: string): ControlElement => ({
      type: 'Control',
      label: false,
      scope: schema.type === 'object' ? `#/properties/${key}` : '#',
    });

    const getError = (e: ErrorObject[]) => (p: string) => {
      const childPropErrors = e.filter(
        (localError) => localError.dataPath === p
      );

      if (childPropErrors.length > 0) {
        // TODO: is it possible to have multiple errors on a property?
        return childPropErrors[0].message;
      } else {
        return '';
      }
    };

    const getChildErrorMessage = getError(childErrors);
    const labelObject = createLabelDescriptionFrom(controlElement, schema);
    const isValid = errors.length === 0;
    const labelText = isPlainLabel(label) ? label : label.default;

    const UNSAFE_error = {
      color: 'rgb(215, 55, 63)',
    };

    const headerColumns: JSX.Element[] = schema.properties
      ? fpflow(
          fpkeys,
          fpfilter((prop) => schema.properties[prop].type !== 'array'),
          fpmap((prop) => <Column key={prop}>{fpstartCase(prop)}</Column>)
        )(schema.properties)
      : [<Column key='items'>Items</Column>];

    return (
      <View
        UNSAFE_className='spectrum-table-array-control'
        isHidden={visible === undefined || visible === null ? false : !visible}
      >
        <Header>
          <Flex
            direction='row'
            alignItems='center'
            justifyContent='space-between'
          >
            <Heading level={4}>{labelText}</Heading>
            <View isHidden={!isValid} marginEnd='auto' />
            <View isHidden={isValid} marginEnd='auto'>
              <TooltipTrigger delay={0}>
                <Button
                  isQuiet
                  aria-label='validation'
                  variant='negative'
                  margin='size-50'
                  minWidth='size-0'
                  width='size-10'
                >
                  <AlertCircle color='negative' />
                </Button>
                <Tooltip>{errors}</Tooltip>
              </TooltipTrigger>
            </View>
            <TooltipTrigger delay={0}>
              <ActionButton
                UNSAFE_className='add-button'
                onPress={addItem(path, createDefaultValue(schema))}
              >
                <Add />
              </ActionButton>
              <Tooltip>Add to {labelObject.text}</Tooltip>
            </TooltipTrigger>
          </Flex>
        </Header>

        <Table overflowMode='wrap' density='compact'>
          <TableHeader>
            {[
              ...headerColumns,
              <Column key='none' width={70}>
                &nbsp;
              </Column>,
            ]}
          </TableHeader>
          <TableBody>
            {!data || !Array.isArray(data) || data.length === 0 ? (
              <Row>
                {[...headerColumns, 3].map((_, index) =>
                  index === 0 ? (
                    <Cell key={index}>No data</Cell>
                  ) : (
                    <Cell key={index}>&nbsp;</Cell>
                  )
                )}
              </Row>
            ) : (
              data.map((_child, index) => {
                const childPath = Paths.compose(path, `${index}`);

                const rowCells: JSX.Element[] = schema.properties
                  ? fpflow(
                      fpkeys,
                      fpfilter(
                        (prop) => schema.properties[prop].type !== 'array'
                      ),
                      fpmap((prop) => {
                        const childPropPath = Paths.compose(
                          childPath,
                          prop.toString()
                        );

                        return (
                          <Cell key={childPropPath}>
                            <Flex direction='column' width='100%'>
                              <DispatchCell
                                schema={Resolve.schema(
                                  schema,
                                  `#/properties/${prop}`,
                                  rootSchema
                                )}
                                uischema={createControlElement(prop)}
                                path={childPath + '.' + prop}
                              />
                              <View
                                UNSAFE_style={UNSAFE_error}
                                isHidden={
                                  getChildErrorMessage(childPropPath) === ''
                                }
                              >
                                <Text>
                                  {getChildErrorMessage(childPropPath)}
                                </Text>
                              </View>
                            </Flex>
                          </Cell>
                        );
                      })
                    )(schema.properties)
                  : [
                      <Cell key={Paths.compose(childPath, index.toString())}>
                        <Flex direction='column' width='100%'>
                          <DispatchCell
                            schema={schema}
                            uischema={createControlElement()}
                            path={childPath}
                          />
                          <View
                            UNSAFE_style={UNSAFE_error}
                            isHidden={getChildErrorMessage(childPath) === ''}
                          >
                            <Text>{getChildErrorMessage(childPath)}</Text>
                          </View>
                        </Flex>
                      </Cell>,
                    ];

                return (
                  <Row key={childPath}>
                    {[
                      ...rowCells,
                      <Cell key={`delete-row-${index}`}>
                        <TooltipTrigger delay={0}>
                          <ActionButton
                            aria-label={`Delete row at ${index}`}
                            onPress={() => {
                              if (
                                window.confirm(
                                  'Are you sure you wish to delete this item?'
                                )
                              ) {
                                this.confirmDelete(childPath, index);
                              }
                            }}
                          >
                            <Delete />
                          </ActionButton>
                          <Tooltip>Delete</Tooltip>
                        </TooltipTrigger>
                      </Cell>,
                    ]}
                  </Row>
                );
              })
            )}
          </TableBody>
        </Table>
      </View>
    );
  }
}

export default withJsonFormsArrayControlProps(SpectrumTableArrayControl);
