// @flow

import React from 'react';
import Calendar from './Calendar';
import Event from './Event';
import { mount, shallow } from 'enzyme';

test('Calendar without props should be rendered', () => {
  mount(
    <Calendar />
  );
});

test('Calendar with one event should be rendered', () => {
  mount(
    <Calendar>
      <Event 
        start={new Date(2017, 1, 1)}
        end={new Date(2017, 1, 1, 1)} />
    </Calendar>
  )
});

test('Calendar with 2 events should be rendered', () => {
  mount(
    <Calendar>
      <Event 
        start={new Date(2017, 1, 1)}
        end={new Date(2017, 1, 1, 1)} />
      <Event 
        start={new Date(2017, 1, 1)}
        end={new Date(2017, 1, 1, 1)} />
    </Calendar>
  )
});

test('Calendar with 3days mode should be rendered', () => {
  mount(
    <Calendar
      mode='3days' />
  );
});

test('Calendar with week mode should be rendered', () => {
  mount(
    <Calendar
      mode='week' />
  );
});