import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import * as React from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AccountStack from './screens_stack/account_screens/accountStack';
import EventStack from './screens_stack/events_screens/eventStack';
import FamilyStack from './screens_stack/family_screens/FamilyStack';
import GenealogyStack from './screens_stack/genealogy_screens/GenealogyStack';
//import DisplayGenealogy from './screens_stack/genealogy_screens/DisplayGenealogy';
import {NewsScreen} from './screens_stack/news_screens/export_news_screen';

const Tab = createBottomTabNavigator();
export default function MyTabs() {
  return (
    <Tab.Navigator
      labeled="true"
      initialRouteName="Event"
      // eslint-disable-next-line react-native/no-inline-styles
      barStyle={{height: 50}}>
      <Tab.Screen
        name="Event"
        component={EventStack}
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
        component={FamilyStack}
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
        name="Genealogy"
        component={GenealogyStack}
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
