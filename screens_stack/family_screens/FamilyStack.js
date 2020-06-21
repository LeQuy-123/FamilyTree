import FamilyScreen from './FamilyScreen';
import AddFamilyScreen from './AddFamilyScreen';

import {createStackNavigator} from '@react-navigation/stack';
//import MyTabs from '../../TabBar';
import * as React from 'react';

const familyStack = createStackNavigator();
const FamilyStack = () => (
  <familyStack.Navigator screenOptions={{headerShown: false}}>
    <familyStack.Screen
      name="FamilyScreen"
      component={FamilyScreen}
      //options={{title: 'DisplayGenealogy'}}
    />
    <familyStack.Screen
      name="AddFamilyScreen"
      component={AddFamilyScreen}
      //options={{tabBarVisible: false}}
    />
  </familyStack.Navigator>
);
export default FamilyStack;
