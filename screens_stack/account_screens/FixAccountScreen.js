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
import ImagePicker from 'react-native-image-crop-picker';
import * as nativeBase from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import onClickAddImages from '../../components/pickImage';
import DatePicker from 'react-native-datepicker';

export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      myEmail: '',
      date: '',
      image: '',
      imageType: '',
      TextInput_Name: ' ',
      TextInput_NickName: ' ',
      TextInput_Number: 'Chưa cập nhật',
      TextInput_Gender: 'Chưa cập nhật',
      TextInput_Address: 'Chưa cập nhật',
      baseUrl: 'https://familytree1.herokuapp.com/api/user/update',
      accessToken: null,
      myRefreshToken: '',
    };
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
      console.log(userData);
    } catch (error) {
      console.log('Something went wrong', error);
    }
  }
  _postData = async () => {
    _RefreshToken(this.state.myEmail, this.state.myRefreshToken);
    var url = this.state.baseUrl;
    try {
      await fetch(url, {
        method: 'PUT',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.state.accessToken,
        },
        body: JSON.stringify({
          nickname: this.state.TextInput_NickName,
          numphone: this.state.TextInput_Number,
          sex: this.state.TextInput_Gender,
          datebirth: this.state.date,
          address: this.state.TextInput_Address,
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
  };
  _postImage = async (token, image) => {
    // eslint-disable-next-line no-undef
    var myHeaders = new Headers();
    myHeaders.append('Authorization', 'Bearer ' + token);
    const photo = {
      uri: image.path,
      type: 'image/jpeg',
      name: 'photo.jpg',
    };
    var formData = new FormData();
    formData.append('file', photo);

    var requestOptions = {
      method: 'PUT',
      headers: myHeaders,
      formData,
      redirect: 'follow',
    };

    fetch('https://familytree1.herokuapp.com/api/user/update', requestOptions)
      .then(response => response.json())
      .then(result => console.log(result.user.profileImage))
      .catch(error => console.log('error', error));
  };
  componentDidMount() {
    this.getToken();
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
                      onPress={onClickAddImages}>
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
                      <Text style={styles.textAva}>+ Thêm ảnh đại điện</Text>
                    </TouchableOpacity>
                    <Text style={styles.testTitle}>Tên: </Text>
                    <TextInput
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.secondTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Name: data})
                      }
                    />
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
                      onChangeText={data =>
                        this.setState({TextInput_NickName: data})
                      }
                    />
                    <Text style={styles.testTitle}>Số điện thoại: </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.thirdTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.fourthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Number: data})
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
                      onChangeText={data =>
                        this.setState({TextInput_Gender: data})
                      }
                    />
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
                      onChangeText={data =>
                        this.setState({TextInput_Address: data})
                      }
                    />
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
