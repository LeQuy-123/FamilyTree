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
  Alert,
} from 'react-native';

export default class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Nothing here',
      email: '',
      username: '',
      password: '',
      baseUrl: 'https://familytree1.herokuapp.com/api/auth/register',
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
  onClickListener = viewId => {
    // Alert.alert(this.state.Usrname+" "+this.state.email+" "+this.state.password , "View_id "+viewId);
    if (this.state.username) {
      if (this.validate(this.state.email.trim())) {
        if (this.state.password && this.state.password.length > 6) {
          this._postData();
        } else {
          Alert.alert('Vui lòng nhập mật khẩu, dài hơn 6 kí tự');
        }
      } else {
        Alert.alert('Vui lòng nhập email hợp lệ');
      }
    } else {
      Alert.alert('Vui lòng nhập tên người dùng');
    }
  };
  _postData = async () => {
    var url = this.state.baseUrl;
    try {
      await fetch(url, {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.email.trim().toLowerCase(),
          username: this.state.username.trim(),
          password: this.state.password.trim(),
        }),
      })
        .then(response => response.json())
        .then(json => {
          this.setState({message: json.message});
          Alert.alert(
            'Thông báo',
            this.state.message,
            [
              {
                text: 'OK',
                style: 'cancel',
              },
              {
                text: 'Get back to login',
                onPress: () =>
                  this.props.navigation.navigate('Login', {
                    emailOJB: this.state.email,
                    passwordOJB2: this.state.password,
                  }),
              },
            ],
            {cancelable: false},
          );
        });
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    return (
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
                Chào mừng trở lại!{' '}
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
                  onChangeText={email => this.setState({email})}
                />
                <Text style={styleslogin.text}>Tên: </Text>
                <TextInput
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
                  onChangeText={username => this.setState({username})}
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
                  onChangeText={password => this.setState({password})}
                />
              </View>
              <View style={styleslogin.button_group}>
                <TouchableOpacity
                  onPress={() => this.onClickListener()}
                  style={styleslogin.buttonContainer}>
                  <Text style={styleslogin.text_in_button}> XÁC NHẬN </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
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
    height: '30%',
    width: '100%',
    justifyContent: 'space-between',
    top: -20,
    // backgroundColor: 'green',
  },
  text: {
    fontSize: 18,
    paddingTop: 10,
    fontFamily: 'serif',
    //backgroundColor: 'green',
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
    height: 100,
    //backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonContainer: {
    top: 50,
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
    paddingStart: 20,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  header_text2_2: {
    fontSize: 13,
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
    flex: 1.5,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
});
