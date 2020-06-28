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
            console.log('newAccessToken: ' + data);
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
    this.getToken();
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
            <View style={styles.infocontainer}>
              {this.state.image ? (
                <Image
                  style={styles.images}
                  source={{
                    uri:
                      'https://familytree1.herokuapp.com/api/normal/image/' +
                      this.state.image,
                  }}
                />
              ) : (
                <Image
                  style={styles.images}
                  source={require('./avatar_default.png')}
                />
              )}
              <View style={styles.info}>
                <Text style={styles.infoText}>{this.state.Name}</Text>
                {this.state.NickName ? (
                  <Text style={styles.infoText}>{this.state.NickName}</Text>
                ) : (
                  <View />
                )}
              </View>
            </View>
          </View>
          <View style={styles.inputcontainer}>
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
            <TouchableOpacity onPress={() => this.LogOut()}>
              <Text
                style={{
                  color: 'white',
                  fontSize: 20,
                  bottom: 15,
                }}>
                Đăng xuất
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 800,
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
    fontSize: 35,
    fontFamily: 'serif',
    paddingStart: 20,
    color: 'white',
    fontWeight: 'bold',
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
    borderWidth: 1,
    borderColor: 'white',
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
    left: 5,
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
