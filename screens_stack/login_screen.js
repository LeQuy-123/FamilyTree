/* eslint-disable react-native/no-inline-styles */
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
  KeyboardAvoidingView,
  Alert,
  AsyncStorage,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      email: '',
      password: '',
      baseUrl: 'https://familytree1.herokuapp.com/api/auth/login',
      refreshToken: '',
      accessToken: null,
    };
  }
  //kiểm tra email
  validate = text => {
    console.log(text);
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      console.log('Email is Not Correct');
      this.setState({email: text});
      return false;
    } else {
      this.setState({email: text});
      console.log('Email is Correct');
      return true;
    }
  };
  checkMail = text => {
    if (this.validate(this.state.email.trim())) {
      this._postData();
    } else {
      Alert.alert('Vui lòng nhập email hợp lệ');
    }
  };
  _postData = async () => {
    var url = this.state.baseUrl;
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email.trim().toLowerCase(),
          password: this.state.password.trim(),
        }),
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            message: json.message,
            accessToken: json.accessToken,
            refreshToken: json.refreshToken,
          });
          this.storeToken(this.state.accessToken, this.state.refreshToken);
          if (this.state.message !== undefined) {
            console.log(this.state.message);
            Alert.alert(
              'Đăng nhập thất bại',
              this.state.message,
              [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          } else if (this.state.email === '' || this.state.password === '') {
            Alert.alert(
              'Vui lòng nhập đầy đủ email và mật khẩu',
              this.state.message,
              [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          } else if (this.state.accessToken) {
            Alert.alert(
              'Đăng nhập thành công',
              this.state.message,
              [
                {
                  text: 'OK',
                  style: 'cancel',
                  onPress: () => this.props.navigation.navigate('App'),
                },
              ],
              {cancelable: false},
            );
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  checkMailReset = text => {
    if (this.validate(this.state.email.trim())) {
      this._resetPassword();
    } else {
      Alert.alert('Vui lòng điền email mà bạn nhớ vào mục email và thử lại');
    }
  };
  _resetPassword = async () => {
    var url = 'https://familytree1.herokuapp.com/api/auth/recover';
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email.trim().toLowerCase(),
        }),
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            message: json.message,
          });
          this.storeToken(this.state.accessToken, this.state.refreshToken);
          if (this.state.message !== undefined) {
            console.log(this.state.message);
            Alert.alert(
              'Thông báo',
              this.state.message,
              [
                {
                  text: 'OK',
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          }
        });
    } catch (error) {
      console.error(error);
    }
  };
  async storeToken(userToken, tokenRefresh) {
    try {
      await AsyncStorage.setItem('userToken', userToken);
      await AsyncStorage.setItem('tokenRefresh', tokenRefresh);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  render() {
    return (
      <ScrollView>
        <SafeAreaView style={styleslogin.container}>
          <StatusBar barStyle="light-content" />
          <KeyboardAvoidingView
            keyboardVerticalOffset={-500}
            behavior="padding"
            style={styleslogin.container}>
            <TouchableWithoutFeedback
              style={styleslogin.container}
              onPress={Keyboard.dismiss}>
              <View style={styleslogin.background} blurOnSubmit={false}>
                <View style={styleslogin.header1}>
                  <Text style={styleslogin.header_text1_1}> Gia Phả </Text>
                  <TouchableOpacity>
                    <Text style={styleslogin.header_text1_2}> Đăng nhập </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('Create')}>
                    <Text style={styleslogin.header_text1_2}> Đăng kí </Text>
                  </TouchableOpacity>
                </View>
                <View style={styleslogin.header2}>
                  <Text style={styleslogin.header_text2_1}>
                    Chào mừng trở lại!
                  </Text>
                  <Text style={styleslogin.header_text2_2}>
                    Đăng nhập để tiếp tục
                  </Text>
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
                      editable
                      blurOnSubmit={false}
                      //placeholder="Email address"
                      autoCorrect={false}
                      onChangeText={email => this.setState({email})}>
                      {this.props.route.params?.emailOJB}
                    </TextInput>
                    <Text style={styleslogin.text}>Mật khẩu: </Text>
                    <TextInput
                      secureTextEntry={true}
                      textContentType="password"
                      style={styleslogin.input_text}
                      ref={input => {
                        this.secondTextInput = input;
                      }}
                      editable
                      blurOnSubmit={false}
                      //placeholder="Password"
                      autoCorrect={false}
                      onChangeText={password => this.setState({password})}>
                      {this.props.route.params?.passwordOJB2}
                    </TextInput>
                    <TouchableOpacity
                      onPress={() => this.checkMailReset(this.state.email)}>
                      <Text
                        style={{
                          alignSelf: 'flex-end',
                          fontSize: 13,
                          color: '#00B2BF',
                          top: 5,
                        }}>
                        Quên mật khẩu ?{' '}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styleslogin.button_group}>
                    <TouchableOpacity
                      style={styleslogin.buttonContainer}
                      onPress={() => this.checkMail(this.state.email)}>
                      <Text style={styleslogin.text_in_button}>
                        {' '}
                        ĐĂNG NHẬP{' '}
                      </Text>
                    </TouchableOpacity>
                    <Text style={{opacity: 0.4, fontSize: 13}}>
                      - - - Hoặc bạn có thể - - -
                    </Text>
                    <TouchableOpacity
                      style={styleslogin.buttonContainerGoogle}
                      onPress={() => this.clearAsyncStorage()}>
                      <Text style={styleslogin.text_in_buttonGoogle}>
                        Đăng nhập bằng Google
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
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
    bottom: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
  },
  text_container: {
    height: '50%',
    width: '100%',
    //paddingBottom: 30,
    top: -20,
    //backgroundColor: 'green',
  },
  text: {
    fontSize: 18,
    paddingTop: 20,
    fontFamily: 'serif',
  },
  input_text: {
    paddingBottom: -3,
    paddingStart: 10,
    fontSize: 18,
    height: 40,
    borderBottomWidth: 1,
    fontFamily: 'serif',
  },
  button_group: {
    width: '100%',
    height: '50%',
    alignItems: 'center',
    justifyContent: 'space-around',
    //backgroundColor: 'blue',
    bottom: -20,
  },
  buttonContainer: {
    width: '100%',
    height: 35,
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
    fontSize: 18,
    opacity: 0.8,
  },
  buttonContainerGoogle: {
    width: '100%',
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: 'white',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 5.0,
    elevation: 10,
  },
  text_in_buttonGoogle: {
    color: '#00B2BF',
    //fontWeight: 'bold',
    fontSize: 15,
    opacity: 0.8,
  },
  header_text2_1: {
    fontSize: 25,
    paddingTop: 20,
    paddingStart: 30,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  header_text2_2: {
    fontSize: 13,
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
    paddingStart: 50,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
  },
  header_text1_2: {
    paddingTop: 20,
    paddingEnd: 10,
    fontSize: 15,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
});
export default Login;
