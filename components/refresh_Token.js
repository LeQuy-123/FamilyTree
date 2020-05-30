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
    }).then(response => {
      const statusCode = response.status;
      if (statusCode === 200) {
        response.json();
        storeToken(response.json.accessToken);
      } else {
        console.log('het han');
        AsyncStorage.clear();
        return null;
      }
    });
    // .then(json => {
    //   console.log('dang refresh token');
    //   if (json) {
    //     storeToken(json.accessToken);
    //   } else {
    //     console.log('het han');
    //     return null;
    //   }
    // });
  } catch (error) {
    console.error(error);
  }
}
async function storeToken(userToken) {
  try {
    if (userToken) {
      await AsyncStorage.removeItem('accessToken');
      await AsyncStorage.setItem('accessToken', userToken);
    }
  } catch (error) {
    console.log('Something went wrong', error);
  }
}

export default _RefreshToken;
