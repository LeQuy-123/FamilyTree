import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

import {StyleSheet, View, SafeAreaView, Text} from 'react-native';

export default class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: 'https://familytree1.herokuapp.com/api/auth/refreshtoken',
      refreshToken: '',
      email: '',
      accessToken: null,
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('tokenRefresh');
      let userEmail = await AsyncStorage.getItem('email');

      this.setState({refreshToken: userData, email: userEmail});
      if (userData !== null) {
        this._postData(this.state.email, this.state.refreshToken);
        console.log('refresh token: ' + userData);
      } else {
        console.log('user chua dang nhap');
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  _postData = async (email, token) => {
    var url = this.state.baseUrl;
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
          this.setState({accessToken: json.accessToken});
          console.log('new token: ' + this.state.accessToken);
          this.storeToken(this.state.accessToken);
        });
    } catch (error) {
      console.error(error);
    }
  };
  componentDidMount() {
    this.getToken();
  }
  async storeToken(userToken) {
    try {
      if (userToken !== null) {
        await AsyncStorage.removeItem('userToken');
        await AsyncStorage.setItem('userToken', userToken);
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  render() {
    return (
      <SafeAreaView style={styleslogin.container}>
        <View style={styleslogin.background}>
          <Text style={styleslogin.header_text1_1}> Genealogy </Text>
        </View>
      </SafeAreaView>
    );
  }
}
const styleslogin = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#00B2BF',
  },
  header_text1_1: {
    fontSize: 55,
    flex: 6,
    paddingTop: 250,
    paddingStart: 10,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
  },
});
