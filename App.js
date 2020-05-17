/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import LoginStack from './screens_stack/loginStack';
import Loading from './screens_stack/loading_screen';
import MyTabs from './TabBar';
const UserContext = React.createContext({});

const Tab = createBottomTabNavigator();

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      accessToken: null,
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('userToken');
      this.setState({accessToken: userData});
      console.log(userData);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    this.getToken();
  }
  render() {
    return (
      <NavigationContainer>
        {this.state.accessToken ? <MyTabs /> : <LoginStack />}
      </NavigationContainer>
    );
  }
}
