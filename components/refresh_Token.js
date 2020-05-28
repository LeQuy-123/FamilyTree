import {AsyncStorage} from 'react-native';

async function _RefreshToken(email, token) {
  var url = 'https://familytree1.herokuapp.com/api/auth/refreshtoken';
  try {
    await fetch(url, {
      method: 'POST',
      //mode: 'no-cors',
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
        storeToken(json.accessToken);
        return json.accessToken;
      });
  } catch (error) {
    console.error(error);
  }
}
async function storeToken(userToken) {
  try {
    if (userToken !== null) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.setItem('userToken', userToken);
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
}

export default _RefreshToken;
