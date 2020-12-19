import axios from 'axios';

export const authenticate = (data, next) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('refresh', data.refresh);
    localStorage.setItem('token', JSON.stringify(data));
    next();
  }
};

export const authenticate_access = (data, next) => {
  localStorage.setItem('token', JSON.stringify(data));
  next();
};

export const logout = (next) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    localStorage.removeItem('refresh');
    next();
    return axios
      .get(`api/auth/logout`)
      .then((res) => {
        console.log('signout', res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

export const isAuthenticated = () => {
  console.log(window);
  if (typeof window === 'undefined') {
    console.log('in if false');
    return false;
  }
  if (localStorage.getItem('token')) {
    console.log('in local storage');
    return JSON.parse(localStorage.getItem('token'));
  } else {
    console.log('in else false');
    return false;
  }
};

export const getNewAccessToken = () => {
  if (localStorage.getItem('refresh')) {
    const refresh = localStorage.getItem('refresh');
    return axios
      .post(`/api/auth/token`, {
        token: refresh,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => console.log(err));
  }
};
