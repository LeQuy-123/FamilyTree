/* eslint-disable no-unused-vars */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
//import cac man hinh theo stack
import {AccountScreen} from './screens_stack/account_screens/export_account_screen';
import {EventScreen} from './screens_stack/events_screens/export_events_screen';
import {FamilyScreen} from './screens_stack/family_screens/export_family_screen';
import {GenealogyScreen} from './screens_stack/genealogy_screens/export_genealogy_screen';
import {NewsScreen} from './screens_stack/news_screens/export_news_screen';
import Login from './screens_stack/login_screen';
import Loading from './screens_stack/loading_screen';
const UserContext = React.createContext({});

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      labeled="true"
      initialRouteName="Event"
      barStyle={{height: 50}}>
      <Tab.Screen
        name="Event"
        component={EventScreen}
        options={{
          tabBarLabel: 'Event',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="calendar-check"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Family"
        component={FamilyScreen}
        options={{
          tabBarLabel: 'Family',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-group"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="History"
        component={GenealogyScreen}
        options={{
          tabBarLabel: 'Genealogy',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="file-tree"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="NewsScreen"
        component={NewsScreen}
        options={{
          tabBarLabel: 'News',
          title: 'News',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="newspaper"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={AccountScreen}
        options={{
          tabBarLabel: 'Account',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      accessToken: '',
    };
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('userData1');
      let data = JSON.parse(userData);
      this.setState({accessToken: data});
      console.log(data);
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
        {this.state.accessToken !== null ? <MyTabs /> : <Login />}
      </NavigationContainer>
    );
  }
}
