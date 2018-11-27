import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class EventCalendar extends Component {

  render() {


    return (
	   <div>
	    <BigCalendar
	      selectable
				scrollToTime={this.props.scrollToTime}
        // defaultDate={this.props.defaultDate}

				eventPropGetter={event => {

						if (this.props.selected && this.props.selected.name === event.fields.name) {
							const backgroundColor = "#8247ff";
							return { style: { backgroundColor } }
						}

					}
				}

        selected={this.props.selected}
	    	events={this.props.eventsList}
	      titleAccessor={(event) => { return event.fields.name }}
	      startAccessor={(event) => { return moment(event.fields.start_date) }}
	      endAccessor={(event) => { return moment(event.fields.end_date) }}
	      localizer={localizer}
	      onSelectEvent={event => this.props.handleSelectEvent(event)}
        onSelectSlot={this.props.handleSelectSlot} // TODO: create new event form on mouse click up
	    />
	  </div>
    );
  }
}

export default EventCalendar;
