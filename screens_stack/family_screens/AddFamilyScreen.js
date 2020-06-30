/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  TextInput,
  Picker,
  Keyboard,
  Alert,
} from 'react-native';
import * as nativeBase from 'native-base';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import PhoneInput from 'react-native-phone-input';

export default class FixInfoGenealogy extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      id: this.props.route.params.id,
      image: '',
      parentage: 'Họ nội',
      firstName: '',
      middleName: '',
      lastName: '',
      email: '',
      nickName: '',
      phone: '',
      sex: 'Nam',
      address: '',
      job: '',
      yourself: '',
      religion: '',
      date: '',
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
      console.log(image.path);
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
      console.log(image.path);
    });
  }
  onClickAddImages() {
    const Buttons = ['Chụp từ máy ảnh', 'Chọn từ thư viện', 'Thoát'];
    nativeBase.ActionSheet.show(
      {
        options: Buttons,
        cancelButtonIndex: 2,
        title: 'Chọn hình hảnh',
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
  _postDataFamily = async () => {
    console.log(this.state.phone);
    if (this.TextInput5.isValidNumber() || this.state.phone === undefined) {
      if (this.state.firstName !== '' || this.state.lastName !== '') {
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
                id: this.state.id,
                firstname: this.state.firstName,
                middlename: this.state.middleName,
                lastname: this.state.lastName,
                email: this.state.email,
                nickname: this.state.nickName,
                numphone: this.state.phone,
                sex: this.state.sex,
                datebirth: this.state.date,
                address: this.state.address,
                job: this.state.job,
                parentage: this.state.parentage,
                yourself: this.state.yourself,
                religion: this.state.religion,
                profileImage: this.state.image,
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
        this.props.navigation.navigate('FamilyScreen');
      } else {
        Alert.alert('Vui lòng nhập đầy đủ họ tên người thân');
      }
    } else {
      Alert.alert('Vui lòng nhập số điện thoại hợp lệ');
    }
  };
  loadOneFamily = async id => {
    console.log('Loading 1 family');
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    _RefreshToken(email, refreshToken).then(data => {
      var URL = url + '/api/user/familyshowone';
      if (data === null) {
        console.log('ko the refresh token do token het han');
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              id: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              if (this.state.sex) {
                this.setState({
                  image: json.family.profileImage,
                  parentage: json.family.parentage,
                  firstName: json.family.firstname,
                  middleName: json.family.middlename,
                  lastName: json.family.lastname,
                  email: json.family.email,
                  nickName: json.family.nickname,
                  phone: json.family.numphone,
                  sex: json.family.sex,
                  address: json.family.address,
                  job: json.family.job,
                  yourself: json.family.yourself,
                  religion: json.family.religion,
                  date: json.family.datebirth,
                });
              } else {
                this.setState({
                  image: json.family.profileImage,
                  parentage: json.family.parentage,
                  firstName: json.family.firstname,
                  middleName: json.family.middlename,
                  lastName: json.family.lastname,
                  email: json.family.email,
                  nickName: json.family.nickname,
                  phone: json.family.numphone,
                  address: json.family.address,
                  job: json.family.job,
                  yourself: json.family.yourself,
                  religion: json.family.religion,
                  date: json.family.datebirth,
                });
              }
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  componentDidMount() {
    if (this.props.route.params.id) {
      this.loadOneFamily(this.props.route.params.id);
    }
  }

  render() {
    return (
      <nativeBase.Root>
        <SafeAreaView>
          <ScrollView
            style={{
              backgroundColor: '#FBBD00',
            }}>
            <View style={styles.container}>
              <View style={styles.titleGroup}>
                <TouchableOpacity
                  onPress={() => this.props.navigation.goBack()}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      top: 8,
                    }}
                    source={require('../../images/icons8-back-to-100.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>Thêm người thân</Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.titleGr}>Thông tin người thân</Text>
                <View style={styles.info}>
                  <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => this.onClickAddImages()}>
                    {this.state.image === '' && (
                      <Image
                        source={require('../../images/avatar_default.png')}
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
                  <Text style={styles.inputTitle}>Họ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onSubmitEditing={() => {
                      this.TextInput1.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={data => this.setState({firstName: data})}>
                    {this.state.firstName}
                  </TextInput>
                  <Text style={styles.inputTitle}>Đêm* </Text>
                  <TextInput
                    ref={input => {
                      this.TextInput1 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput2.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({middleName: data})}>
                    {this.state.middleName}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên* </Text>
                  <TextInput
                    ref={input => {
                      this.TextInput2 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput3.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({lastName: data})}>
                    {this.state.lastName}
                  </TextInput>
                  <Text style={styles.inputTitle}>Email </Text>
                  <TextInput
                    ref={input => {
                      this.TextInput3 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput4.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({email: data})}>
                    {this.state.email}
                  </TextInput>
                  <Text style={styles.inputTitle}>Biệt danh* </Text>
                  <TextInput
                    ref={input => {
                      this.TextInput4 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput5.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({nickName: data})}>
                    {' '}
                    {this.state.nickName}
                  </TextInput>
                  <Text style={styles.inputTitle}>Số điện thoại </Text>
                  <PhoneInput
                    ref={input => {
                      this.TextInput5 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput7.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    value={this.state.phone}
                    initialCountry="vn"
                    onChangePhoneNumber={number =>
                      this.setState({phone: number})
                    }
                  />
                  <Text style={styles.inputTitle}>Giới tính</Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={this.state.sex}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({
                          sex: itemValue,
                        });
                      }}>
                      <Picker.Item label="Nam" value="Nam" />
                      <Picker.Item label="Nữ" value="Nữ" />
                      <Picker.Item label="Khác" value="Khác" />
                    </Picker>
                  </View>
                  <Text style={styles.inputTitle}>Ngày sinh</Text>
                  <DatePicker
                    style={{width: '90%', borderRadius: 50}}
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
                    }}
                    onDateChange={date => {
                      this.setState({date: date});
                    }}
                  />
                  <Text style={styles.inputTitle}>Địa chỉ</Text>
                  <TextInput
                    ref={input => {
                      this.TextInput7 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput8.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({address: data})}>
                    {this.state.address}
                  </TextInput>
                  <Text style={styles.inputTitle}>Nghề nghiệp</Text>
                  <TextInput
                    ref={input => {
                      this.TextInput8 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput9.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({job: data})}>
                    {this.state.job}
                  </TextInput>
                  <Text style={styles.inputTitle}>Cách xưng hô</Text>
                  <TextInput
                    ref={input => {
                      this.TextInput9 = input;
                    }}
                    onSubmitEditing={() => {
                      this.TextInput10.focus();
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    onChangeText={data => this.setState({yourself: data})}>
                    {this.state.yourself}
                  </TextInput>
                  <Text style={styles.inputTitle}>Dòng họ</Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={this.state.parentage}
                      style={styles.inputText}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({parentage: itemValue});
                      }}>
                      <Picker.Item label="Họ nội" value="Họ nội" />
                      <Picker.Item label="Họ ngoại" value="Họ ngoại" />
                    </Picker>
                  </View>
                  <Text style={styles.inputTitle}>Tôn giáo</Text>
                  <TextInput
                    ref={input => {
                      this.TextInput10 = input;
                    }}
                    //blurOnSubmit={false}
                    onSubmitEditing={Keyboard.dismiss}
                    style={styles.inputText}
                    onChangeText={data => this.setState({religion: data})}>
                    {this.state.religion}
                  </TextInput>
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this._postDataFamily();
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Cập nhật
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </nativeBase.Root>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 1110,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBBD00',
    width: '100%',
    paddingHorizontal: 10,
  },
  titleGroup: {
    height: 50,
    alignItems: 'center',
    //backgroundColor: '#FBBD00',
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
    top: 5,
    left: 20,
  },
  infoGroup: {
    height: 1050,
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  info: {
    height: '96%',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: 30,
    paddingBottom: 10,
  },
  titleGr: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    bottom: 10,
    paddingStart: 15,
  },
  inputTitle: {
    left: 19,
    fontWeight: 'bold',
    fontSize: 15,
  },
  inputText: {
    fontFamily: 'serif',
    left: 20,
    width: '86%',
    height: 35,
    fontSize: 16,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    padding: -10,
    //paddingVertical: -15,
    borderWidth: 1,
  },
  buttonAdd: {
    width: '100%',
    height: 70,
    //backgroundColor: '#00B2BF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    backgroundColor: '#00B2BF',
    width: '80%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 5.0,
    elevation: 10,
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
  picker: {
    fontFamily: 'serif',
    left: 20,
    width: '86%',
    height: 35,
    fontSize: 16,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
});
