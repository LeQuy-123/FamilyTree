import {AsyncStorage} from 'react-native';
import url from './MainURL';
async function _RefreshToken(email, token) {
  var URL = url + '/api/auth/refreshtoken';
  //console.log('refresh token: ' + token);
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
        console.log('thanh cong');
        console.log('token: ' + data.accessToken);
        storeToken(data.accessToken);
        return data.accessToken;
      })
      .catch(error => {
        console.log('error: ' + error.toString());
        AsyncStorage.clear();
        return 'null';
      });
  } catch (error) {
    console.error(error);
  }
}
async function storeToken(newToken) {
  try {
    if (newToken) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.setItem('accessToken', newToken);
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
}

export default _RefreshToken;
