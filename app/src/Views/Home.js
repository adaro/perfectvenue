import React, { Component } from 'react';
import MediaCard from '../Components/Card'
import RestClient from '../HTTP/RestClient';
import PerfectvenueGlobals from '../PerfectvenueGlobals'
const API = PerfectvenueGlobals.defaultProps.PROD;


class Home extends Component {

	state = {
		venues: null
	}

	componentDidMount() {
    const getVenuesPromise = RestClient('GET', '/api/venues/')
    const self = this;
    getVenuesPromise.then(function(resp) {
    	console.log(resp)
      self.setState({venues: resp, loading: false})
    })
	}

	renderCards() {
		if (this.state.venues) {
			return (
				<div className="flex-wrap">
					{this.state.venues.map(function(venue) {
						return (<MediaCard media={venue.fields.logo} title={venue.fields.name} details={venue.fields.description} actionRoute={"/venues/" + venue.pk}/>)
					})}
				</div>
			)
		}
		else {
			return null
		}
	}

  render() {

    return (
    	<div >
    	 {this.renderCards()}
    	</div>

    )
	}
}

export default Home;
