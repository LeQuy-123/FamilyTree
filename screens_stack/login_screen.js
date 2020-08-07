/* eslint-disable no-alert */
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
import Modal from 'react-native-modal';
import {LoginButton, AccessToken} from 'react-native-fbsdk';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: '',
      email: this.props.route.params?.emailOJB,
      password: this.props.route.params?.passwordOJB2,
      baseUrl: 'https://familytree1.herokuapp.com/api/auth/login',
      refreshToken: '',
      accessToken: null,
      isModalVisible: false,
      icon: 'eye-off',
      showPassword: true,
      emailReset: '',
    };
  }
  _changeIcon() {
    this.setState(prevState => ({
      icon: prevState.icon === 'eye' ? 'eye-off' : 'eye',
      showPassword: !prevState.showPassword,
    }));
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  //kiểm tra email
  validate = text => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(text) === false) {
      this.setState({email: text});
      return false;
    } else {
      this.setState({email: text});
      return true;
    }
  };
  checkMail = () => {
    if (this.state.email && this.state.password) {
      if (this.validate(this.state.email.trim())) {
        this._postData();
      } else {
        Alert.alert('Vui lòng nhập email hợp lệ');
      }
    } else {
      Alert.alert('Vui lòng nhập email và password');
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
          //console.log(JSON.stringify(json));
          if (json.accessToken) {
            AsyncStorage.setItem('accessToken', json.accessToken);
            AsyncStorage.setItem('tokenRefresh', json.refreshToken);
            AsyncStorage.setItem('email', this.state.email);
            this.props.navigation.navigate('App');
          }
          if (json.message) {
            Alert.alert(
              'Đăng nhập thất bại',
              json.message,
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
  checkMailReset = text => {
    if (this.validate(text.trim())) {
      this._resetPassword(text.trim());
      this.toggleModal();
    } else {
      Alert.alert('Vui lòng điền email mà bạn nhớ vào mục email và thử lại');
    }
  };
  _resetPassword = async mail => {
    var url = 'https://familytree1.herokuapp.com/api/auth/recover';
    try {
      await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: mail.toLowerCase(),
        }),
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            message: json.message,
          });
          if (this.state.message !== undefined) {
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
            this.props.navigation.navigate('App');
          } else {
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
  choiceModal() {
    return (
      <Modal
        backdropOpacity={0.6}
        coverScreen={false}
        isVisible={this.state.isModalVisible}
        onSwipeComplete={this.toggleModal}
        onBackButtonPress={this.toggleModal}
        swipeThreshold={200}
        swipeDirection={['left', 'right', 'down', 'up']}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 250,
            height: 100,
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'space-around',
            backgroundColor: 'white',
          }}>
          <Text>Nhập email của bạn</Text>
          <TextInput
            onChangeText={data => this.setState({emailReset: data})}
            style={{
              width: '90%',
              height: 40,
              borderRadius: 10,
              alignItems: 'center',
              borderWidth: 1,
            }}
          />
          <TouchableOpacity
            onPress={() => this.checkMailReset(this.state.emailReset)}
            style={{
              width: '50%',
              height: 30,
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#00B2BF',
            }}>
            <Text>Xác nhận</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
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
                <View>
                  <Text style={styleslogin.header_text1_2Main}>Đăng nhập</Text>
                </View>
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
                  <TouchableOpacity onPress={() => this.toggleModal()}>
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
                  <View>
                    <LoginButton
                      publishPermissions={['email']}
                      onLoginFinished={(error, result) => {
                        if (error) {
                          Alert.alert(
                            'Login failed with error: ' + error.message,
                          );
                        } else if (result.isCancelled) {
                          Alert.alert('Login was cancelled');
                        } else {
                          Alert.alert(
                            'Login was successful with permissions: ' +
                              result.grantedPermissions,
                          );
                        }
                      }}
                      onLogoutFinished={() => alert('User logged out')}
                    />
                  </View>
                </View>
              </View>
              {this.choiceModal()}
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
    marginEnd: 20,
    fontSize: 15,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  header_text1_2Main: {
    paddingTop: 20,
    marginEnd: 20,
    fontSize: 15,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    borderBottomColor: 'white',
    borderBottomWidth: 3,
  },
});
export default Login;
