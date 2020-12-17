import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import jwt from 'jsonwebtoken'

export const signup = user => {
    return fetch(`${API}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signin = user => {
    return fetch(`${API}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const signout = next => {
    removeCookie('token');
    removeLocalStorage('user');
    next();

    return fetch(`${API}/signout`, {
        method: 'GET'
    })
        .then(response => {
            console.log('signout success');
        })
        .catch(err => console.log(err));
};

// set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        });
    }
};

export const removeCookie = key => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });
    }
};
// get cookie
export const getCookie = key => {
    if (process.browser) {
        return cookie.get(key);
    }
};
// localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = key => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
};

export const isAuth = () => {
    if (process.browser) {
        const cookieChecked = getCookie('token');
        if (cookieChecked) {
            if (localStorage.getItem('user')) {
                return JSON.parse(localStorage.getItem('user'));
            } else {
                return false;
            }
        }
    }
};

export const loginWithGoogle = user => {
    return fetch(`${API}/google-login`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
    })
        .then(response => {
            return response.json();
        })
        .catch(err => console.log(err));
};

export const authSpotify = () => {
    const token = getCookie("token");
    if(!token){
        return "There is no user signed in"
    }
    const user = jwt.decode(token);
    return fetch("http://18.224.76.50:8000/auth/spotify?user_email="+user.email, {
        method: 'GET',
    }).then(res => {
        console.log(res)
        return res.json();
    }).catch(err => console.log(err))
}

export const authYouTube = () => {
    const token = getCookie("token");
    if(!token){
        return "There is no user signed in"
    }
    const user = jwt.decode(token);
    console.log("decode jwt");
    return fetch("http://18.224.76.50:8000/auth/youtube?user_email="+user.email, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).catch(err => console.log(err))
}

export const handleResponse = (response) => {
    if(response.status === 401){
        signout(() => {
            Router.push({
                pathname: '/signin',
                query: {
                    message: "Your session is expired, please signin again"
                }
            })
        })        
    }else {
        return;
    }
}