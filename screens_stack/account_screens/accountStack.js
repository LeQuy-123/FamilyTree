import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import AccountScreen from './AccountScreen';
import FixAccountScreen from './FixAccountScreen';

const accountStack = createStackNavigator();
export default function AccountStack() {
  return (
    <accountStack.Navigator screenOptions={{headerShown: false}}>
      <accountStack.Screen
        name="Account"
        component={AccountScreen}
        options={{title: 'Account'}}
      />
      <accountStack.Screen
        name="Fix"
        component={FixAccountScreen}
        options={{title: 'Fix Account'}}
      />
    </accountStack.Navigator>
  );
}
