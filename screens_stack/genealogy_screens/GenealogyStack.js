import AddGenealogyScreen from './AddGenealogyScreen';
import DisplayGenealogy from './DisplayGenealogy';
import FixInfoGenealogy from './FixInfoGenealogy';
import GenealogyScreen from './GenealogyScreen';
import {createStackNavigator} from '@react-navigation/stack';
//import MyTabs from '../../TabBar';
import * as React from 'react';

const genealogyStack = createStackNavigator();
const GenealogyStack = () => (
  <genealogyStack.Navigator screenOptions={{headerShown: false}}>
    {/* <genealogyStack.Screen
      name="DisplayGenealogy"
      component={DisplayGenealogy}
      //options={{title: 'DisplayGenealogy'}}
    />
    <genealogyStack.Screen
      name="AddGenealogy"
      component={AddGenealogyScreen}
      //options={{tabBarVisible: false}}
    /> */}
    <genealogyStack.Screen
      name="Genealogy"
      component={GenealogyScreen}
      //options={{title: 'GenealogyScreen'}}
    />
    <genealogyStack.Screen name="FixInfoScreen" component={FixInfoGenealogy} />
  </genealogyStack.Navigator>
);
export default GenealogyStack;
