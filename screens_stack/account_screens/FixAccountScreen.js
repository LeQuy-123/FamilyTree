/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  ScrollView,
  Alert,
} from 'react-native';
//import ImagePicker from 'react-native-image-crop-picker';
import * as nativeBase from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import url from '../../components/MainURL';
import PhoneInput from 'react-native-phone-input';

export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      myEmail: '',
      image: '',
      imageType: '',
      Name: '',
      NickName: '',
      Number: '',
      Gender: '',
      Address: '',
      date: '',
      baseUrl: url + '/api/user/update',
      accessToken: null,
      myRefreshToken: '',
    };
  }
  chosePhotoFromLibrary() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        image: image.path,
      });
    });
  }
  takePhotoFromCamera() {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        image: image.path,
      });
    });
  }
  onClickAddImages() {
    const Buttons = ['Chụp từ máy ảnh', 'Chọn từ thư viện', 'Thoát'];
    nativeBase.ActionSheet.show(
      {
        options: Buttons,
        cancelButtonIndex: 2,
        title: 'Tai avatar moi',
      },
      buttonIndex => {
        switch (buttonIndex) {
          case 0:
            this.takePhotoFromCamera();
            break;
          case 1:
            this.chosePhotoFromLibrary();
            break;
          default:
            break;
        }
      },
    );
  }
  async getToken() {
    try {
      let userData = await AsyncStorage.getItem('accessToken');
      let email = await AsyncStorage.getItem('email');
      let refreshToken = await AsyncStorage.getItem('tokenRefresh');
      this.setState({
        accessToken: userData,
        myEmail: email,
        myRefreshToken: refreshToken,
      });
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  _postData = async () => {
    if (this.thirdTextInput.isValidNumber()) {
      _RefreshToken(this.state.myEmail, this.state.myRefreshToken);
      let userData = await AsyncStorage.getItem('accessToken');
      try {
        await fetch(this.state.baseUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + userData,
          },
          body: JSON.stringify({
            nickname: this.state.NickName,
            numphone: this.state.Number,
            sex: this.state.Gender,
            datebirth: this.state.date,
            address: this.state.Address,
          }),
        })
          .then(response => response.json())
          .then(json => {
            console.log(json.message);
            Alert.alert(
              json.message,
              'Vui lòng reload app để cập nhật thông tin',
              [
                {
                  text: 'Xác nhận',
                  style: 'cancel',
                  onPress: () => this.props.navigation.navigate('Account'),
                },
              ],
              {cancelable: false},
            );
          });
      } catch (error) {
        console.error(error);
      }
    } else {
      Alert.alert('Vui lòng nhập số điện thoại hợp lệ');
    }
  };
  _postImage = async image => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    _RefreshToken(email, refreshToken).then(data => {
      var URL = url + '/api/user/familyupdate';
      try {
        fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + data,
          },
          body: JSON.stringify({
            file: image,
          }),
        })
          .then(response => response.json())
          .then(json => {})
          .catch(error => {
            console.log('error: ' + error.toString());
            throw error;
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
  _getData = async token => {
    var URL = url + '/api/user/show';
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
          console.log(this.state.Name);
        });
    } catch (error) {
      console.error(error);
    }
  };
  componentDidMount() {
    this.getToken().then(() => this._getData(this.state.accessToken));
  }
  render() {
    return (
      <nativeBase.Root>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}>
          <ScrollView style={styles.contentContainer}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={styles.container}>
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Image
                      style={{
                        height: 40,
                        width: 40,
                        top: 8,
                      }}
                      source={require('./icons8-back-to-100.png')}
                    />
                  </TouchableOpacity>
                  <Text style={styles.Title2}>Chỉnh sửa thông tin cá nhân</Text>
                </View>
                <View style={styles.containerInfo}>
                  <Text style={styles.Title1}> Thông tin cá nhân </Text>
                  <View style={styles.InfoEdit}>
                    <TouchableOpacity
                      style={styles.avatar}
                      onPress={() => this.onClickAddImages()}>
                      {this.state.image === '' && (
                        <Image
                          source={require('./avatar_default.png')}
                          style={{
                            width: 120,
                            height: 120,
                            borderRadius: 20,
                          }}
                        />
                      )}
                      {this.state.image !== '' && (
                        <Image
                          source={{uri: this.state.image}}
                          style={{
                            width: 130,
                            height: 130,
                            borderRadius: 65,
                          }}
                        />
                      )}
                      <Text style={styles.textAva}>+ Thêm ảnh đại diện</Text>
                    </TouchableOpacity>
                    <Text style={styles.testTitle}>Tên: </Text>
                    <TextInput
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.secondTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      editable={false}
                      onChangeText={data => this.setState({Name: data})}>
                      {this.state.Name}
                    </TextInput>
                    <Text style={styles.testTitle}>Họ:</Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.secondTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.thirdTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({NickName: data})}>
                      {this.state.NickName}
                    </TextInput>
                    <Text style={styles.testTitle}>Số điện thoại: </Text>
                    <PhoneInput
                      style={styles.inputText}
                      ref={input => {
                        this.thirdTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.fourthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      value={this.state.Number}
                      initialCountry="vn"
                      onChangePhoneNumber={number =>
                        this.setState({Number: number})
                      }
                    />
                    <Text style={styles.testTitle}>Giới tính: </Text>
                    <TextInput
                      ref={input => {
                        this.fourthTextInput = input;
                      }}
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.sixthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({Gender: data})}>
                      {this.state.Gender}
                    </TextInput>
                    <Text style={styles.testTitle}>Ngày sinh: </Text>
                    <DatePicker
                      style={{width: 266, borderRadius: 50}}
                      date={this.state.date}
                      mode="date"
                      placeholder="select date"
                      format="YYYY-MM-DD"
                      minDate="1900-05-01"
                      maxDate="2100-06-01"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0,
                        },
                        dateInput: {
                          marginLeft: 36,
                        },
                        // ... You can check the source to find the other keys.
                      }}
                      onDateChange={date => {
                        this.setState({date: date});
                      }}
                    />
                    <Text style={styles.testTitle}>Địa chỉ: </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.sixthTextInput = input;
                      }}
                      onChangeText={data => this.setState({Address: data})}>
                      {this.state.Address}
                    </TextInput>
                  </View>
                </View>
                <View style={styles.ComboButton}>
                  <TouchableOpacity
                    style={styles.Button1}
                    onPress={() => this.props.navigation.goBack()}>
                    <Text style={styles.ButtonText1}>Hủy</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.Button2}
                    onPress={() => this._postData()}>
                    <Text style={styles.ButtonText2}>Cập nhật</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </ScrollView>
        </KeyboardAwareScrollView>
      </nativeBase.Root>
    );
  }
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    height: 800,
    backgroundColor: '#FBBD00',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  containerInfo: {
    width: '90%',
    height: '82%',
    bottom: 10,
    borderRadius: 30,
    backgroundColor: '#00B2BF',
    justifyContent: 'flex-end',
  },
  InfoEdit: {
    width: '100%',
    height: '92%',
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingStart: 25,
    justifyContent: 'center',
  },
  Title1: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    bottom: 10,
    paddingStart: 15,
  },
  Title2: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
    top: 10,
  },
  ComboButton: {
    width: '100%',
    height: '6%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  Button1: {
    borderRadius: 15,
    width: 140,
    height: '100%',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ButtonText1: {
    color: 'black',
    fontSize: 20,
  },
  Button2: {
    borderRadius: 15,
    width: 140,
    height: '100%',
    backgroundColor: '#00B2BF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  ButtonText2: {
    color: 'white',
    fontSize: 20,
  },
  testTitle: {
    left: 0,
    fontWeight: 'bold',
    fontSize: 16,
  },
  inputText: {
    width: '90%',
    height: 40,
    fontSize: 15,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    paddingVertical: -15,
    borderWidth: 1,
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textAva: {
    fontSize: 18,
    color: 'darkgrey',
    start: 10,
  },
});
