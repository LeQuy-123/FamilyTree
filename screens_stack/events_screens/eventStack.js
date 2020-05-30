import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import EventScreen from './EventScreen';
import AddEventScreen from './AddEventScreen';

const accountStack = createStackNavigator();
export default function EventStack() {
  return (
    <accountStack.Navigator screenOptions={{headerShown: false}}>
      <accountStack.Screen
        name="Event"
        component={EventScreen}
        options={{title: 'event'}}
      />
      <accountStack.Screen
        name="AddEvent"
        component={AddEventScreen}
        options={{title: 'addEvent'}}
      />
    </accountStack.Navigator>
  );
}
