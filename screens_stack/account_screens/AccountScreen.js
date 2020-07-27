/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  AsyncStorage,
} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
class AccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      image: '',
      baseUrl: 'https://familytree1.herokuapp.com/api/user/show',
      accessToken: '',
      date: '',
      Name: ' ',
      NickName: ' ',
      Number: '',
      Gender: '',
      Address: '',
      email: '',
    };
  }
  clearAsyncStorage = async () => {
    AsyncStorage.clear();
  };
  LogOut() {
    this.clearAsyncStorage();
    this._Logout();
    this.props.navigation.navigate('Login');
  }
  async getToken() {
    try {
      let refreshToken = await AsyncStorage.getItem('tokenRefresh');
      let accessToken = await AsyncStorage.getItem('accessToken');
      let email = await AsyncStorage.getItem('email');
      this.setState({
        refreshToken: refreshToken,
        accessToken: accessToken,
        email: email,
      });
      if (this.state.accessToken !== null) {
        _RefreshToken(email, refreshToken).then(data => {
          if (data) {
            this._getData(data);
          } else {
            this.props.navigation.navigate('Login');
          }
        });
      }
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.getToken();
    });
  }
  _Logout = async () => {
    var URL = url + '/api/auth/logout';
    try {
      await fetch(URL, {
        method: 'DELETE',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: this.state.refreshToken,
        }),
      });
    } catch (error) {
      console.error(error);
    }
  };
  _getData = async token => {
    var URL = url + '/api/user/show';
    // console.log('access token:' + token);
    try {
      await fetch(URL, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + token,
        },
      })
        .then(response => response.json())
        .then(json => {
          this.setState({
            date: json.user.datebirth,
            Name: json.user.username,
            NickName: json.user.nickname,
            Number: json.user.numphone,
            Gender: json.user.sex,
            Address: json.user.address,
            image: json.user.profileImage,
          });
        });
    } catch (error) {
      console.error(error);
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.titlecontainer}>
          <View
            style={{
              width: '100%',
              height: 80,
              flexDirection: 'row',
              paddingRight: 15,
              paddingTop: 10,
              justifyContent: 'space-between',
            }}>
            <Text style={styles.title}>TÀI KHOẢN</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('Fix')}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                }}
                source={require('./icons8-edit-account-50.png')}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.inputcontainer}>
          <View style={styles.infocontainer}>
            {this.state.image ? (
              <Image
                style={styles.images}
                source={{
                  uri: this.state.image,
                }}
              />
            ) : (
              <Image
                style={styles.images}
                source={require('./avatar_default.png')}
              />
            )}
            <View style={styles.info}>
              {this.state.NickName ? (
                <View
                  style={{
                    width: '100%',
                    height: '100%',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                  }}>
                  <Text style={styles.infoText}>{this.state.Name}</Text>
                  <Text style={styles.infoText}>{this.state.NickName}</Text>
                </View>
              ) : (
                <View
                  style={{
                    width: '100%',
                    height: '50%',
                    top: 40,
                  }}>
                  <Text style={styles.infoText}>{this.state.Name}</Text>
                </View>
              )}
            </View>
          </View>
          <View style={styles.inputs}>
            <Text style={styles.baseText}> Email </Text>
            <Text style={styles.input}>{this.state.email}</Text>
            <Text style={styles.baseText}> Số điện thoại </Text>
            <Text style={styles.input}>{this.state.Number}</Text>
            <Text style={styles.baseText}> Giới tính </Text>
            <Text style={styles.input}>{this.state.Gender}</Text>
            <Text style={styles.baseText}> Ngày sinh </Text>
            <Text style={styles.input}>{this.state.date}</Text>
            <Text style={styles.baseText}> Địa chỉ </Text>
            <Text style={styles.input}>{this.state.Address}</Text>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              bottom: 15,
            }}
            onPress={() => this.LogOut()}>
            <Image
              style={{
                height: 30,
                width: 30,
                right: 10,
              }}
              source={require('../../images/logout.png')}
            />
            <Text
              style={{
                fontSize: 20,
              }}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#00B2BF',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  inputcontainer: {
    width: '100%',
    height: '68%',
    backgroundColor: '#FBBD00',
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  titlecontainer: {
    width: '100%',
    height: '32%',
    backgroundColor: '#00B2BF',
  },
  title: {
    fontSize: 35,
    fontFamily: 'serif',
    paddingStart: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  infocontainer: {
    height: 200,
    width: '100%',
    bottom: 50,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  info: {
    height: 120,
    width: '45%',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  images: {
    height: 200,
    width: 200,
    backgroundColor: '#AEECEF',
    borderRadius: 115,
    borderWidth: 1,
    borderColor: 'white',
  },
  inputs: {
    width: '90%',
    height: '65%',
    //backgroundColor: 'white',
    justifyContent: 'space-between',
    marginBottom: 60,
  },
  baseText: {
    fontFamily: 'serif',
    fontSize: 17,
  },
  infoText: {
    fontFamily: 'serif',
    fontSize: 20,
    width: '100%',
    height: 30,
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
export default AccountScreen;
