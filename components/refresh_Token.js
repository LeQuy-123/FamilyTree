import {AsyncStorage} from 'react-native';
import url from './MainURL';
async function _RefreshToken(email, token) {
  var URL = url + '/api/auth/refreshtoken';
  try {
    return await fetch(URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        token: token,
      }),
    })
      .then(response => response.json())
      .then(data => {
        AsyncStorage.removeItem('accessToken');
        AsyncStorage.setItem('accessToken', data.accessToken);
        return data.accessToken;
      })
      .catch(error => {
        console.log('error: ' + error.toString());
        return null;
      });
  } catch (error) {
    console.error(error);
  }
}

export default _RefreshToken;
