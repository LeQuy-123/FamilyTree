import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  StatusBar,
  TextInput,
  SafeAreaView,
  Keyboard,
  TouchableOpacity,
  ScrollView,
} from 'react-native';

export default class Create extends Component {
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styleslogin.container}>
          <StatusBar barStyle="light-content" />
          <TouchableWithoutFeedback
            style={styleslogin.container}
            onPress={Keyboard.dismiss}>
            <View style={styleslogin.background} blurOnSubmit={false}>
              <View style={styleslogin.header1}>
                <Text style={styleslogin.header_text1_1}> Gia Phả </Text>
                <TouchableOpacity
                  onPress={() => this.props.navigation.navigate('Login')}>
                  <Text style={styleslogin.header_text1_2}> Đăng nhập </Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text style={styleslogin.header_text1_2}> Đăng kí </Text>
                </TouchableOpacity>
              </View>
              <View style={styleslogin.header2}>
                <Text style={styleslogin.header_text2_1}>
                  {' '}
                  Chào mừng quay trở lại{' '}
                </Text>
                <Text style={styleslogin.header_text2_2}>Tạo tài khoản:</Text>
              </View>
              <View style={styleslogin.body}>
                <View style={styleslogin.text_container}>
                  <Text style={styleslogin.text}>Email: </Text>
                  <TextInput
                    textContentType="emailAddress"
                    style={styleslogin.input_text}
                    onSubmitEditing={() => {
                      this.secondTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    editable
                    //placeholder="Email address"
                    autoCorrect={false}
                  />
                  <Text style={styleslogin.text}>Tên: </Text>
                  <TextInput
                    textContentType="emailAddress"
                    style={styleslogin.input_text}
                    onSubmitEditing={() => {
                      this.thirdTextInput.focus();
                    }}
                    ref={input => {
                      this.secondTextInput = input;
                    }}
                    blurOnSubmit={false}
                    editable
                    //placeholder="Email address"
                    autoCorrect={false}
                  />
                  <Text style={styleslogin.text}>Mật khẩu:</Text>
                  <TextInput
                    ref={input => {
                      this.thirdTextInput = input;
                    }}
                    secureTextEntry={true}
                    textContentType="password"
                    style={styleslogin.input_text}
                    editable
                    blurOnSubmit={false}
                    autoCorrect={false}
                  />
                </View>
                <View style={styleslogin.button_group}>
                  <TouchableOpacity style={styleslogin.buttonContainer}>
                    <Text style={styleslogin.text_in_button}> XÁC NHẬN </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </ScrollView>
    );
  }
}
const styleslogin = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  background: {
    height: 680,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#00B2BF',
  },
  header1: {
    width: '100%',
    flex: 1.9,
    flexDirection: 'row',
    //backgroundColor: 'red',
  },
  header2: {
    width: '100%',
    flex: 2.1,
  },
  body: {
    width: '100%',
    flex: 6,
    backgroundColor: 'white',
    borderRadius: 36,
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
  },
  text_container: {
    width: '100%',
    justifyContent: 'space-between',
    //paddingBottom: 30,
    //backgroundColor: 'green',
  },
  text: {
    fontSize: 20,
    paddingTop: 20,
    fontFamily: 'serif',
  },
  input_text: {
    padding: 10,
    fontSize: 18,
    height: 40,
    borderBottomWidth: 1,
    fontFamily: 'serif',
  },
  button_group: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: 'blue',
    end: 0,
  },
  buttonContainer: {
    width: '100%',
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#00B2BF',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 5.0,
    elevation: 10,
  },
  text_in_button: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 20,
    opacity: 0.8,
    fontFamily: 'serif',
  },
  header_text2_1: {
    fontSize: 25,
    paddingTop: 20,
    paddingStart: 20,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  header_text2_2: {
    fontSize: 15,
    paddingTop: 5,
    paddingStart: 30,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  header_text1_1: {
    fontSize: 30,
    flex: 6,
    paddingTop: 50,
    paddingStart: 10,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
  },
  header_text1_2: {
    paddingTop: 30,
    paddingEnd: 10,
    fontSize: 15,
    flex: 1.5,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
});
