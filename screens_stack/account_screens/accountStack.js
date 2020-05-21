import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import AccountScreen from './AccountScreen';
import FixAccountScreen from './FixAccountScreen';
import LoginStack from '../loginStack';

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
        name="FixAccountScreen"
        component={FixAccountScreen}
        options={{title: 'Fix Account'}}
      />
    </accountStack.Navigator>
  );
}
