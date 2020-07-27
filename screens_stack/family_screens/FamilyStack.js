import FamilyScreen from './FamilyScreen';
import AddFamilyScreen from './AddFamilyScreen';
import ShareTree from './ShareTreeScreen';
import {createStackNavigator} from '@react-navigation/stack';
import ViewTree from './ViewShareTree';
//import MyTabs from '../../TabBar';
import * as React from 'react';

const familyStack = createStackNavigator();
const FamilyStack = () => (
  <familyStack.Navigator screenOptions={{headerShown: false}}>
    <familyStack.Screen name="FamilyScreen" component={FamilyScreen} />
    <familyStack.Screen name="AddFamilyScreen" component={AddFamilyScreen} />
    <familyStack.Screen name="Geno" component={ShareTree} />
    <familyStack.Screen name="ViewTree" component={ViewTree} />
  </familyStack.Navigator>
);
export default FamilyStack;
