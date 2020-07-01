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
  Image,
} from 'react-native';
import _RefreshToken from '../components/refresh_Token';
import {Icon} from 'native-base';

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
      icon: 'eye-off',
      showPassword: true,
    };
  }
  _changeIcon() {
    this.setState(prevState => ({
      icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
      showPassword: !prevState.showPassword,
    }));
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
          //console.log('token refresh for user: ' + this.state.email);
          AsyncStorage.setItem('accessToken', this.state.accessToken);
          AsyncStorage.setItem('tokenRefresh', this.state.refreshToken);
          AsyncStorage.setItem('email', this.state.email);
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
            this.props.navigation.navigate('App');
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
  async checkToken() {
    try {
      let accessToken = await AsyncStorage.getItem('accessToken');
      let refreshToken = await AsyncStorage.getItem('tokenRefresh');
      let userEmail = await AsyncStorage.getItem('email');
      // console.log('refresh token: ' + refreshToken);
      // console.log('email: ' + userEmail);
      if (accessToken) {
        _RefreshToken(userEmail, refreshToken).then(data => {
          if (data !== null) {
            console.log('data: ' + data);
            this.props.navigation.navigate('App');
          } else {
            console.log('clear');
            AsyncStorage.clear();
          }
        });
      } else {
        console.log('chua dang nhap hoac token het han');
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    this.checkToken();
  }
  render() {
    return (
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
                <Image
                  style={{
                    height: 120,
                    width: 120,
                    top: 5,
                    left: 15,
                  }}
                  source={{
                    uri:
                      'https://mellullaby.herokuapp.com/api/normal/image/amadeus-1589026468500-genealogy-logo.png',
                  }}
                />
                <Text style={styleslogin.header_text1_1}> Gia Phả </Text>
                <Text style={styleslogin.header_text1_2Main}> Đăng nhập </Text>
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
                  <Text style={styleslogin.text}>Email </Text>
                  <TextInput
                    textContentType="emailAddress"
                    style={styleslogin.input_text}
                    onSubmitEditing={() => this.thTextInput.focus()}
                    editable
                    blurOnSubmit={false}
                    placeholder="Email address"
                    autoCorrect={false}
                    onChangeText={email => this.setState({email})}>
                    {this.props.route.params?.emailOJB}
                  </TextInput>
                  <Text style={styleslogin.text}>Mật khẩu </Text>
                  <View
                    style={{
                      alignItems: 'flex-end',
                      flexDirection: 'row',
                      borderBottomWidth: 1,
                      paddingBottom: 5,
                    }}>
                    <TextInput
                      ref={input => {
                        this.thTextInput = input;
                      }}
                      style={{
                        paddingStart: 10,
                        fontSize: 18,
                        height: 40,
                        width: '90%',
                        fontFamily: 'serif',
                        paddingBottom: -5,
                      }}
                      placeholder="Password"
                      onSubmitEditing={() => Keyboard.dismiss()}
                      secureTextEntry={this.state.showPassword}
                      onChangeText={e => this.setState({password: e})}>
                      {this.props.route.params?.passwordOJB2}
                    </TextInput>
                    <Icon
                      name={this.state.icon}
                      onPress={() => this._changeIcon()}
                    />
                  </View>
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
                    <Text style={styleslogin.text_in_button}> ĐĂNG NHẬP </Text>
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
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#00B2BF',
  },
  header1: {
    width: '100%',
    flex: 1.9,
    flexDirection: 'row',
    justifyContent: 'space-around',
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
    paddingTop: 60,
    left: 30,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
    //backgroundColor: 'white',
  },
  header_text1_2: {
    paddingTop: 20,
    paddingEnd: 20,
    fontSize: 13,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    borderBottomColor: 'white',
  },
  header_text1_2Main: {
    paddingTop: 20,
    paddingEnd: 20,
    fontSize: 13,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    opacity: 0.5,
  },
});
export default Login;
