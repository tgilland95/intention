import * as React from 'react';
import glamorous from 'glamorous';
import bind from '../../../../utilities/bind';
import { Todo } from '../../../../types';

import CalendarDay from './components/CalendarDay';

const NUM_DAYS_VISIBLE = 3;
const DAY_IN_MS = 86400000;

interface Props {
  loading: boolean;
  events: Todo[];
  onDrop(date: Date): void;
}

interface State {
  startDate: Date;
}

const Container = glamorous.div({
  padding: '0 20px',
});

const ControlsContainer = glamorous.div({
  display: 'flex',
  justifyContent: 'space-between',
});

const CalendarContainer = glamorous.div({
  display: 'flex',
  minHeight: '100vh',
});

const DayContainer = glamorous.div({
  flex: '1 0 33.333%',
});

const Button = glamorous.button<{small?: boolean}>({
  color: '#007ACE',
  padding: '12px 0 0',
}, ({small = false}) => ({
  fontSize: small ? 14 : 20,
  fontWeight: small ? 600 : 900,
}));

export default class Calendar extends React.Component<Props, State> {
  state = {
    startDate: new Date(),
  };

  @bind
  handlePreviousClick() {
    this.setState(({startDate}) => ({
      startDate: new Date(startDate.valueOf() - DAY_IN_MS),
    }));
  }

  @bind
  handleNextClick() {
    this.setState(({startDate}) => ({
      startDate: new Date(startDate.valueOf() + DAY_IN_MS),
    }));
  }

  @bind
  handleTodayClick() {
    this.setState({startDate: new Date()});
  }

  render() {
    const {startDate} = this.state;
    const {events} = this.props;

    const calendarDays = Array(NUM_DAYS_VISIBLE).fill(null).map((_, index) => {
      const startOfDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
      const date = new Date(startOfDate.valueOf() + DAY_IN_MS * index);

      const showMonth = (index === 0) || date.getDate() === 1;

      const eventsForDay = events.filter(({startTime}) => {
        if (startTime == null) { return false; }

        const eventStartTime = new Date(startTime);

        return eventStartTime.getFullYear() === date.getFullYear() &&
          eventStartTime.getMonth() === date.getMonth() &&
          eventStartTime.getDate() === date.getDate();
      });

      return (
        <DayContainer key={date.toString()}>
          <CalendarDay
            date={date}
            events={eventsForDay}
            showMonth={showMonth}
            onDrop={this.props.onDrop}
          />
        </DayContainer>
      );
    });

    return (
      <Container>
        <ControlsContainer>
          <Button onClick={this.handlePreviousClick}>&larr;</Button>
          <Button onClick={this.handleTodayClick} small>Today</Button>
          <Button onClick={this.handleNextClick}>&rarr;</Button>
        </ControlsContainer>
        <CalendarContainer>
          {calendarDays}
        </CalendarContainer>
      </Container>
    );
  }
}
