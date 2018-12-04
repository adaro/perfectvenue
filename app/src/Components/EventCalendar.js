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
				// scrollToTime={this.props.scrollToTime}
        // defaultDate={this.props.defaultDate}
				eventPropGetter={event => {
						if (this.props.selected && this.props.selected.name === event.name) {
							const backgroundColor = "#8247ff";
							return { style: { backgroundColor } }
						}
					}
				}

        selected={this.props.selected}
	    	events={this.props.eventsList}
	      titleAccessor={(event) => { return event.name }}
	      startAccessor={(event) => { return moment(event.start_date).toDate(); }}
	      endAccessor={(event) => { return moment(event.end_date).toDate(); }}
	      localizer={localizer}
	      onSelectEvent={event => this.props.handleSelectEvent(event)}
        onSelectSlot={this.props.handleSelectSlot} // TODO: create new event form on mouse click up
	    />
	  </div>
    );
  }
}

export default EventCalendar;
