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
  UIManager,
  Platform,
  LayoutAnimation,
} from 'react-native';
import * as nativeBase from 'native-base';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import url from '../../components/MainURL';

export default class FixInfoNode extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      leafId: this.props.route.params.leafId,
      refreshToken: '',
      email: '',
      LeafSpouseEdit: '',
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
          LeafSpouseEdit: {
            ...this.state.LeafSpouseEdit,
            image: image.path,
          },
        });
      } else {
        this.setState({
          LeafSpouseEdit: {
            ...this.state.LeafSpouseEdit,
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
          LeafSpouseEdit: {
            ...this.state.LeafSpouseEdit,
            image: image.path,
          },
        });
      } else {
        this.setState({
          LeafSpouseEdit: {
            ...this.state.LeafSpouseEdit,
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
  createSpouse = async id => {
    //console.log('id to create spuse : ' + id);
    var URL = url + '/api/user/spouseleaf';
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
              authId: this.props.route.params.authId,
	          spouseId: id,
	          firstname: this.state.LeafSpouseEdit.firstname,
              lastname: this.state.LeafSpouseEdit.lastname,
              nickname: this.state.LeafSpouseEdit.nickname,
              sex: this.state.LeafSpouseEdit.sex,
              dob: this.state.LeafSpouseEdit.dob,
              domicile: this.state.LeafSpouseEdit.domicile,
              dod: this.state.LeafSpouseEdit.dod,
              burialplace: this.state.LeafSpouseEdit.dp,
              profileImage: this.state.LeafSpouseEdit.image,
            }),
          })
            .then(response => response.json())
            .then(json => {
                this.props.navigation.goBack();
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  componentDidMount() {
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
                  onPress={() => this.props.navigation.navigate('Genealogy')}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      top: 8,
                    }}
                    source={require('../../images/icons8-back-to-100.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.title}>Sửa thông tin</Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.titleGr}>Thông tin vợ/chồng người thân</Text>
                <View style={styles.info}>
                  <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => this.onClickAddImages(1)}>
                    {!this.state.LeafSpouseEdit.image ? (
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
                        source={{uri: this.state.LeafSpouseEdit.image}}
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
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          firstname: data,
                        },
                      })
                    }>
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          lastname: data,
                        },
                      })
                    }>
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên gợi nhớ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          nickname: data,
                        },
                      })
                    }>
                  </TextInput>
                  <Text style={styles.inputTitle}>Giới tính</Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          sex: data,
                        },
                      })
                    }>
                  </TextInput>
                  <Text style={styles.inputTitle}>Nguyên quán</Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          address: data,
                        },
                      })
                    }>
                  </TextInput>
                  <Text style={styles.inputTitle}>Ngày sinh</Text>
                  <DatePicker
                    style={{width: '90%', borderRadius: 50}}
                    date={this.state.LeafSpouseEdit.dob}
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
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          dob: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Ngày giỗ</Text>
                  <DatePicker
                    style={{width: '90%', borderRadius: 50}}
                    date={this.state.LeafSpouseEdit.dod}
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
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          dod: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Mộ tang </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        LeafSpouseEdit: {
                          ...this.state.LeafSpouseEdit,
                          dp: data,
                        },
                      })
                    }>
                  </TextInput>
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.createSpouse(this.state.leafId)}>
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
