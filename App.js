/* eslint-disable no-unused-vars */
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginStack from './screens_stack/loginStack';
import Loading from './screens_stack/loading_screen';
import _RefreshToken from './components/refresh_Token';

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseUrl: 'https://familytree1.herokuapp.com/api/auth/refreshtoken',
      refreshToken: '',
      email: '',
      accessToken: null,
      isLoading: true,
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('tokenRefresh');
      let userEmail = await AsyncStorage.getItem('email');
      let accessToken = await AsyncStorage.getItem('userToken');
      this.setState({
        refreshToken: userData,
        email: userEmail,
        accessToken: accessToken,
      });
      if (userData !== null) {
        _RefreshToken(this.state.email, this.state.refreshToken);
        console.log('refresh token: ' + userData);
      } else {
        console.log('user chua dang nhap');
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    setTimeout(() => {
      this.getToken();
      this.setState({isLoading: false});
    }, 2500);
  }
  render() {
    if (this.state.isLoading) {
      return <Loading />;
    } else {
      return <NavigationContainer>{<LoginStack />}</NavigationContainer>;
    }
  }
}
