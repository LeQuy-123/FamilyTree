/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import FixAccountScreen from './FixAccountScreen';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
class AccountScreen extends Component {
  render() {
    return (
      <ScrollView style={{paddingVertical: 0}}>
        <View style={styles.container}>
          <View style={styles.titlecontainer}>
            <View
              style={{
                width: '100%',
                height: '40%',
                flexDirection: 'row',
                paddingEnd: 20,
                paddingTop: 20,
              }}>
              <Text style={styles.title}>TÀI KHOẢN</Text>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('FixAccountScreen')
                }>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                  }}
                  source={require('./icons8-edit-account-50.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.infocontainer}>
              <Image
                style={styles.images}
                source={require('./avatar_default.png')}
              />
              <View style={styles.info}>
                <Text style={styles.infoText}>
                  Tên: {this.props.route.params?.NameOJB}
                </Text>
                <Text style={styles.infoText}>
                  Họ: {this.props.route.params?.NameOJB2}
                </Text>
              </View>
            </View>
          </View>
          <View style={styles.inputcontainer}>
            <View style={styles.inputs}>
              <Text style={styles.baseText}> Số điện thoại: </Text>
              <Text style={styles.input}>
                {this.props.route.params?.NumberOJB}
              </Text>
              <Text style={styles.baseText}> Giới tính: </Text>
              <Text style={styles.input}>
                {this.props.route.params?.GenderOJB}
              </Text>
              <Text style={styles.baseText}> Email: </Text>
              <Text style={styles.input}>
                {this.props.route.params?.EmailOJB}
              </Text>
              <Text style={styles.baseText}> Ngày sinh: </Text>
              <Text style={styles.input}>
                {this.props.route.params?.DateOJB}
              </Text>
              <Text style={styles.baseText}> Địa chỉ: </Text>
              <Text style={styles.input}>
                {this.props.route.params?.AddressOJB}
              </Text>
            </View>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                bottom: 15,
              }}>
              Đăng xuất
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}
const accountStack = createStackNavigator();
function App() {
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

const styles = StyleSheet.create({
  container: {
    height: 700,
    backgroundColor: '#00B2BF',
  },
  inputcontainer: {
    width: '100%',
    height: '66%',
    backgroundColor: '#FBBD00',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'absolute',
    zIndex: 1,
    bottom: 0,
  },
  titlecontainer: {
    width: '100%',
    height: '35%',
    //backgroundColor: '#00B2BF',
    position: 'absolute',
    zIndex: 2,
  },
  title: {
    flex: 1,
    //backgroundColor: 'white',
    fontSize: 35,
    fontFamily: 'serif',
    paddingStart: 20,
    color: 'white',
  },
  infocontainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingStart: 0,
    paddingEnd: 10,
  },
  info: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 40,
  },
  images: {
    height: 200,
    width: 200,
    backgroundColor: '#AEECEF',
    borderRadius: 115,
    marginLeft: 10,
  },
  inputs: {
    width: '90%',
    height: '65%',
    //backgroundColor: 'white',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  baseText: {
    fontFamily: 'Times New Roman',
    fontSize: 18,
  },
  infoText: {
    fontFamily: 'serif',
    fontSize: 18,
    width: '95%',
    height: 25,
    backgroundColor: '#AEECEF',
    borderRadius: 15,
    paddingStart: 10,
  },
  input: {
    borderBottomColor: 'black',
    borderBottomWidth: 0.8,
    //flex: 1,
    textAlignVertical: 'bottom',
    fontSize: 18,
    paddingStart: 20,
  },
});
export default App;
