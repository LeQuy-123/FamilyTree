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
          this.storeToken(this.state.accessToken);
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
              this.state.accessToken,
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
  async storeToken(user) {
    try {
      await AsyncStorage.setItem('userData', JSON.stringify(user));
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
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
                    Chào mừng quay trở lại
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
                    <Text>---Hoặc bạn có thể---</Text>
                    <TouchableOpacity
                      style={styleslogin.buttonContainer}
                      onPress={() => this.clearAsyncStorage()}>
                      <Text style={styleslogin.text_in_button}>
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
    bottom: 40,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 40,
  },
  text_container: {
    flex: 4,
    width: '100%',
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
    flex: 6,
    alignItems: 'center',
    justifyContent: 'space-between',
    //backgroundColor: 'blue',
    paddingTop: 150,
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
    paddingStart: 30,
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
export default Login;
