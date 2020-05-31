import {AsyncStorage} from 'react-native';

async function _RefreshToken(email, token) {
  var url = 'https://familytree1.herokuapp.com/api/auth/refreshtoken';
  try {
    await fetch(url, {
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
      .then(json => {
        console.log('dang refresh token');
        console.log('new aceess token: ' + json.accessToken);
        if (json.accessToken !== 'undefined') {
          storeToken(json.accessToken);
        } else {
          console.log('het han');
          AsyncStorage.clear();
        }
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
