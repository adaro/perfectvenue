import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
import moment_timezone from 'moment-timezone'
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class EventCalendar extends Component {


	convertDateToDateTime = (date) => {
	  const dateM = moment.tz(date, BigCalendar.tz)
	  const m = moment.tz({
	    year: dateM.year(),
	    month: dateM.month(),
	    date: dateM.date(),
	    hour: dateM.hour(),
	    minute: dateM.minute(),
	  }, BigCalendar.tz)
	  return m
	}

  render() {

    return (
	   <div>
	    <BigCalendar
	      selectable
				// scrollToTime={this.props.scrollToTime}
        // defaultDate={this.props.defaultDate}
				eventPropGetter={event => {
						if (this.props.selected && this.props.selected.id === event.id) {
							const backgroundColor = "#8247ff";
							return { style: { backgroundColor } }
						}

						if (event.status === 'AP') {
							const backgroundColor = "#8247ff";
							return { style: { backgroundColor } }
						}

						if (event.status === 'PN') {
							const backgroundColor = "#618833";
							return { style: { backgroundColor } }
						}

						if (event.status === 'DC') {
							const backgroundColor = "#ffab68";
							return { style: { backgroundColor } }
						}
						if (event.status === 'CN') {
							const backgroundColor = "#e91e63";
							return { style: { backgroundColor } }
						}
					}
				}

        selected={this.props.selected}
	    	events={this.props.eventsList}
	      titleAccessor={(event) => { return event.name }}
	      startAccessor={(event) => { return new Date(moment(event.start_date).utc().format('YYYY/MM/DD hh:mm a')) }}
	      endAccessor={(event) => { return new Date(moment(event.end_date).utc().format('YYYY/MM/DD hh:mm a')) }}
	      localizer={localizer}
	      onSelectEvent={event => this.props.handleSelectEvent(event)}
        onSelectSlot={this.props.handleSelectSlot} // TODO: create new event form on mouse click up
	    />
	  </div>
    );
  }
}

export default EventCalendar;
