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
} from 'react-native';
import * as nativeBase from 'native-base';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import url from '../../components/MainURL';
import PhoneInput from 'react-native-phone-input';

export default class AddParentNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      childID: this.props.route.params.childID,
      authId: this.props.route.params.authId,
      refreshToken: '',
      email: '',
      LeafParentEdit: {
        sex: 'Nam',
      },
    };
  }
  chosePhotoFromLibrary(i) {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (i === 1) {
        this.setState({
          LeafParentEdit: {
            ...this.state.LeafParentEdit,
            image: image.path,
          },
        });
      } else {
        this.setState({
          LeafParentEdit: {
            ...this.state.LeafParentEdit,
            image: image.path,
          },
        });
      }
    });
  }
  takePhotoFromCamera(i) {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (i === 1) {
        this.setState({
          LeafParentEdit: {
            ...this.state.LeafParentEdit,
            image: image.path,
          },
        });
      } else {
        this.setState({
          LeafParentEdit: {
            ...this.state.LeafParentEdit,
            image: image.path,
          },
        });
      }
    });
  }
  onClickAddImages(i) {
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
            this.takePhotoFromCamera(i);
            break;
          case 1:
            this.chosePhotoFromLibrary(i);
            break;
          default:
            break;
        }
      },
    );
  }
  createParent = async id => {
    var URL = url + '/api/user/parentleaf';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    _RefreshToken(userEmail, refreshToken).then(data => {
      if (data === null) {
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
              authId: this.state.authId,
              childId: id,
              firstname: this.state.LeafParentEdit.firstname,
              lastname: this.state.LeafParentEdit.lastname,
              nickname: this.state.LeafParentEdit.nickname,
              sex: this.state.LeafParentEdit.sex,
              dob: this.state.LeafParentEdit.dob,
              domicile: this.state.LeafParentEdit.address,
              dod: this.state.LeafParentEdit.dod,
              numphone: this.state.LeafParentEdit.sdt,
              burialplace: this.state.LeafParentEdit.dp,
              profileImage: this.state.LeafParentEdit.image,
              rank: this.state.LeafParentEdit.rank,
            }),
          })
            .then(response => response.json())
            .then(json => {
              console.log('parent: ' + JSON.stringify(json));
              this.props.navigation.goBack();
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  input({title = '', onChangeText = () => {}, data = ''}) {
    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <TextInput style={styles.inputText} onChangeText={onChangeText}>
          {data}
        </TextInput>
      </View>
    );
  }
  dateInput({title = '', onDateChange = () => {}, data = ''}) {
    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <DatePicker
          style={{width: '90%', borderRadius: 50}}
          date={data}
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
          onDateChange={onDateChange}
        />
      </View>
    );
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
                <Text style={styles.title}>Thêm đời đầu </Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.titleGr}>Thông tin người thân</Text>
                <View style={styles.info}>
                  <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => this.onClickAddImages(1)}>
                    {!this.state.LeafParentEdit.image ? (
                      <Image
                        source={require('../../images/avatar_default.png')}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 20,
                        }}
                      />
                    ) : (
                      <Image
                        source={{uri: this.state.LeafParentEdit.image}}
                        style={{
                          width: 130,
                          height: 130,
                          borderRadius: 65,
                        }}
                      />
                    )}
                    <Text style={styles.textAva}>+ Thêm ảnh đại diện</Text>
                  </TouchableOpacity>
                  {this.input({
                    title: 'Họ*',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          firstname: data,
                        },
                      }),
                  })}
                  {this.input({
                    title: 'Tên*',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          lastname: data,
                        },
                      }),
                  })}
                  {this.input({
                    title: 'Tên gợi nhớ*',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          nickname: data,
                        },
                      }),
                  })}
                  {this.input({
                    title: 'Thứ tự trong gia đình*',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          rank: data,
                        },
                      }),
                  })}
                  <Text style={styles.inputTitle}>Số điện thoại </Text>
                  <PhoneInput
                    ref={input => {
                      this.TextInput5 = input;
                    }}
                    blurOnSubmit={false}
                    style={styles.inputText}
                    value={this.state.phone}
                    initialCountry="vn"
                    onChangePhoneNumber={number =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          sdt: number,
                        },
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Giới tính</Text>
                  <View style={styles.inputText}>
                    <Picker
                      style={{
                        fontFamily: 'serif',
                        width: '100%',
                        height: 35,
                        fontSize: 16,
                      }}
                      selectedValue={this.state.LeafParentEdit.sex}
                      onValueChange={(itemValue, itemIndex) =>
                        this.setState({
                          LeafParentEdit: {
                            ...this.state.LeafParentEdit,
                            sex: itemValue,
                          },
                        })
                      }>
                      <Picker.Item label="Nam" value="Nam" />
                      <Picker.Item label="Nữ" value="Nữ" />
                      <Picker.Item label="Khác" value="Khác" />
                    </Picker>
                  </View>
                  {this.input({
                    title: 'Nguyên quán',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          address: data,
                        },
                      }),
                  })}
                  {this.dateInput({
                    title: 'Ngày sinh',
                    onDateChange: date => {
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          dob: date,
                        },
                      });
                    },
                    data: this.state.LeafParentEdit.dob,
                  })}
                  {this.dateInput({
                    title: 'Ngày giỗ',
                    onDateChange: date => {
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          dod: date,
                        },
                      });
                    },
                    data: this.state.LeafParentEdit.dod,
                  })}
                  {this.input({
                    title: 'Nơi an táng',
                    onChangeText: data =>
                      this.setState({
                        LeafParentEdit: {
                          ...this.state.LeafParentEdit,
                          dp: data,
                        },
                      }),
                  })}
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  //console.log(JSON.stringify(this.state.LeafParentEdit));
                  this.createParent(this.state.childID);
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Thêm
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
    height: 850,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FBBD00',
    width: '100%',
    paddingHorizontal: 10,
  },
  titleGroup: {
    height: 60,
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
    flex: 1,
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  info: {
    height: 750,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: 30,
  },
  infoExpand: {
    height: 700,
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: 30,
  },
  titleGr: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    bottom: 5,
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
    flexDirection: 'row',
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
});
