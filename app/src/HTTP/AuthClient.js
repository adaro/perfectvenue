import PerfectvenueGlobals from '../PerfectvenueGlobals'

const API = PerfectvenueGlobals.defaultProps.DEV;

export default (type, params) => {
    if (type === 'AUTH_LOGIN') {
        // const { username, password } = params;
        const request = new Request(API.host + '/accounts/login/', {
            method: 'POST',
            // body: JSON.stringify({ username, password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }

                return response.json();
            })
    }

    if (type === 'AUTH_LOGOUT') {
        const request = new Request(API.host + '/accounts/logout/', {
            method: 'POST',
            body: JSON.stringify({  }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
        })
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })

        return Promise.resolve();
    }

    return Promise.resolve();
}