import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountStack from './screens_stack/account_screens/accountStack';
import {EventScreen} from './screens_stack/events_screens/export_events_screen';
import {FamilyScreen} from './screens_stack/family_screens/export_family_screen';
import {GenealogyScreen} from './screens_stack/genealogy_screens/export_genealogy_screen';
import {NewsScreen} from './screens_stack/news_screens/export_news_screen';
const Tab = createBottomTabNavigator();

export default function MyTabs() {
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
        component={AccountStack}
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
