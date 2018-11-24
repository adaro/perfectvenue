
/* global FB*/
import React from 'react';
import PropTypes from 'prop-types';
import AuthClient from './HTTP/AuthClient';

class PerfectvenueGlobals extends React.Component {

   static defaultProps = {
      DEV: {
      	host: 'http://127.0.0.1:8000',
      	client: 'http://localhost:3000'
      },
      PROD: {
      	host: 'http://pv-env.z7uy3c3xvn.us-west-2.elasticbeanstalk.com',
        client: 'https://app.perfetvenue.com'
      },
      getParam: (name, url) => {
          if (!url) url = window.location.href;
          name = name.replace(/[\[\]]/g, "\\$&");
          var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
              results = regex.exec(url);
          if (!results) return null;
          if (!results[2]) return '';
          return decodeURIComponent(results[2].replace(/\+/g, " "));
      },

      cleanURL: () => {
        window.history.pushState({}, document.title, "/"+window.location.href.substring(window.location.href.lastIndexOf('/') + 1).split("?")[0]);
      },

   };
}

PerfectvenueGlobals.propTypes = {
	urls: PropTypes.object
};


export default PerfectvenueGlobals;
