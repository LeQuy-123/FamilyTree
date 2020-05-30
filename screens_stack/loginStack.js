import {createStackNavigator} from '@react-navigation/stack';
import * as React from 'react';
import Create from './create_account_screen';
import Login from './login_screen';
import MyTabs from '../TabBar';
import Loading from './loading_screen';

const accountStack = createStackNavigator();
export default function LoginStack() {
  return (
    <accountStack.Navigator screenOptions={{headerShown: false}}>
      <accountStack.Screen
        name="Loading"
        component={Loading}
        options={{title: 'Loading'}}
      />
      <accountStack.Screen
        name="Login"
        component={Login}
        options={{title: 'Login'}}
      />
      <accountStack.Screen
        name="Create"
        component={Create}
        options={{title: 'Create'}}
      />
      <accountStack.Screen
        name="App"
        component={MyTabs}
        options={{title: 'App'}}
      />
    </accountStack.Navigator>
  );
}
