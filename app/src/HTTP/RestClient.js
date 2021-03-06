import PerfectvenueGlobals from '../PerfectvenueGlobals'

const API = PerfectvenueGlobals.defaultProps.PROD;

export default (type, endpoint, params) => {
    if (type === 'POST') {
        const request = new Request(API.host + endpoint, {
            method: 'POST',
            body: JSON.stringify({ params }),
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + localStorage.getItem('pvToken') }),
        })
        return fetch(request)
            .then(response => {

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
    }

    if (type === 'PUT') {
        const request = new Request(API.host + endpoint, {
            method: 'PUT',
            body: JSON.stringify({ params }),
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + localStorage.getItem('pvToken') }),
        })
        return fetch(request)
            .then(response => {

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
    }

    if (type === 'DELETE') {
        const request = new Request(API.host + endpoint, {
            method: 'DELETE',
            body: JSON.stringify({ params }),
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + localStorage.getItem('pvToken') }),
        })
        return fetch(request)
            .then(response => {

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
    }

    if (type === 'GET') {
         var url = new URL(API.host + endpoint)
        if (params) {
          Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        }

        const request = new Request(url, {
            method: 'GET',
            headers: new Headers({ 'Content-Type': 'application/json', 'Authorization': 'Token ' + localStorage.getItem('pvToken') }),
        })

        return fetch(request)
            .then(response => {

                if (response.status == 401) {
                    const new_url = window.location.href = API.host + '/accounts/login'
                    window.location.href = new_url
                }

                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                console.log(response)

                return response.json();
            })
    }


    return Promise.resolve();
}