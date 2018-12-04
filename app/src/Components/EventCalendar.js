import React, { Component } from 'react';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'
const localizer = BigCalendar.momentLocalizer(moment) // or globalizeLocalizer

class EventCalendar extends Component {

  render() {

  	console.log(this.props.eventsList, 99)

  	this.props.eventsList.filter(function(event) {

  	})

    return (
	   <div>
	    <BigCalendar
	      selectable
				scrollToTime={this.props.scrollToTime}
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
	      startAccessor={(event) => { return moment(event.start_date) }}
	      endAccessor={(event) => { return moment(event.end_date) }}
	      localizer={localizer}
	      onSelectEvent={event => this.props.handleSelectEvent(event)}
        onSelectSlot={this.props.handleSelectSlot} // TODO: create new event form on mouse click up
	    />
	  </div>
    );
  }
}

export default EventCalendar;
