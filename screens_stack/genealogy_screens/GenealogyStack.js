import AddGenealogyScreen from './AddGenealogyScreen';
import DisplayGenealogy from './DisplayGenealogy';
import FixInfoGenealogy from './FixInfoGenealogy';
import GenealogyScreen from './GenealogyScreen';
import FixInfoNode from './FixInfoNode';
import AddParentNote from './AddParentNode';
import {createStackNavigator} from '@react-navigation/stack';
//import MyTabs from '../../TabBar';
import * as React from 'react';

const genealogyStack = createStackNavigator();
const GenealogyStack = () => (
  <genealogyStack.Navigator screenOptions={{headerShown: false}}>
    <genealogyStack.Screen
      name="DisplayGenealogy"
      component={DisplayGenealogy}
    />
    <genealogyStack.Screen name="AddGenealogy" component={AddGenealogyScreen} />
    <genealogyStack.Screen name="Genealogy" component={GenealogyScreen} />
    <genealogyStack.Screen name="FixInfoScreen" component={FixInfoGenealogy} />
    <genealogyStack.Screen name="FixNode" component={FixInfoNode} />
    <genealogyStack.Screen name="AddParentNote" component={AddParentNote} />
  </genealogyStack.Navigator>
);
export default GenealogyStack;
