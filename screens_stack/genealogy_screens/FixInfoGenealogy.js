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
} from 'react-native';
import * as nativeBase from 'native-base';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import DatePicker from 'react-native-datepicker';
import ImagePicker from 'react-native-image-crop-picker';
import url from '../../components/MainURL';

export default class FixInfoGenealogy extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      leafId: this.props.route.params.leafId,
      refreshToken: '',
      email: '',
      LeafData: '',
      leafInfoEdit: '',
    };
  }
  chosePhotoFromLibrary() {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({
        leafInfoEdit: {
          ...this.state.leafInfoEdit,
          image: image.path,
        },
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
        leafInfoEdit: {
          ...this.state.leafInfoEdit,
          image: image.path,
        },
      });
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
  loadOneLeaf = async id => {
    var URL = url + '/api/user/leafshowone';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
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
              leafId: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                LeafData: json.leaf,
                leafInfoEdit: {
                  ...this.state.leafInfoEdit,
                  image: json.leaf.profileImage,
                  dateBirth: json.leaf.dob,
                  dateDeath: json.leaf.dod,
                },
              });
              console.log(JSON.stringify(this.state.LeafData));
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  updateLeaf = async id => {
    var URL = url + '/api/user/leafupdate';
    _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              leafId: this.state.leafId,
              firstname: this.state.leafInfoEdit.firstname,
              lastname: this.state.leafInfoEdit.lastname,
              nickname: this.state.leafInfoEdit.nickname,
              sex: this.state.leafInfoEdit.sex,
              dob: this.state.leafInfoEdit.dateBirth,
              domicile: this.state.leafInfoEdit.address,
              dod: this.state.leafInfoEdit.dateDeath,
              burialplace: this.state.leafInfoEdit.dp,
              profileImage: this.state.leafInfoEdit.image,
            }),
          })
            .then(response => response.json())
            .then(json => {
              console.log(JSON.stringify(json));
              this.props.navigation.goBack();
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  deleteLeaf = async id => {
    var URL = url + '/api/user/destroyleaf';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              leafId: id,
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
  createLeaf = async id => {
    console.log(id);
    var URL = url + '/api/user/newleaf';
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
              parentId: id,
              firstname: 'Tên',
              lastname: 'Họ',
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
    if (!this.props.route.params.authId) {
      this.loadOneLeaf(this.state.leafId);
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
                <Text style={styles.titleGr}>Thông tin người thân</Text>
                <View style={styles.info}>
                  <TouchableOpacity
                    style={styles.avatar}
                    onPress={() => this.onClickAddImages()}>
                    {!this.state.leafInfoEdit.image ? (
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
                        source={{uri: this.state.leafInfoEdit.image}}
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
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          firstname: data,
                        },
                      })
                    }>
                    {this.state.LeafData.firstname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          lastname: data,
                        },
                      })
                    }>
                    {this.state.LeafData.lastname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên gợi nhớ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          nickname: data,
                        },
                      })
                    }>
                    {this.state.LeafData.nickname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Giới tính</Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          sex: data,
                        },
                      })
                    }>
                    {this.state.LeafData.sex}
                  </TextInput>
                  <Text style={styles.inputTitle}>Nguyên quán</Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          address: data,
                        },
                      })
                    }>
                    {this.state.LeafData.domicile}
                  </TextInput>
                  <Text style={styles.inputTitle}>Ngày sinh</Text>
                  <DatePicker
                    style={{width: '90%', borderRadius: 50}}
                    date={this.state.leafInfoEdit.dateBirth}
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
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          dateBirth: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Ngày giỗ</Text>
                  <DatePicker
                    style={{width: '90%', borderRadius: 50}}
                    date={this.state.leafInfoEdit.dateDeath}
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
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          dateDeath: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Mộ tang </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        leafInfoEdit: {
                          ...this.state.leafInfoEdit,
                          dp: data,
                        },
                      })
                    }>
                    {this.state.LeafData.burialplace}
                  </TextInput>
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  if (!this.props.route.params.authId) {
                    this.updateLeaf(this.state.leafId);
                  } else {
                    this.createLeaf(this.state.leafId);
                  }
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
              <TouchableOpacity
                style={styles.button}
                disabled={!this.props.route.params.isFinalLeaf}
                onPress={() => {
                  if (!this.props.route.params.authId) {
                    this.deleteLeaf(this.state.leafId);
                  }
                }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: 'white',
                  }}>
                  Xóa
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
    height: 1000,
    alignItems: 'center',
    justifyContent: 'space-between',
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
    height: '95%',
    backgroundColor: 'white',
    width: '100%',
    justifyContent: 'space-around',
    borderRadius: 30,
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
    flexDirection: 'row',
    paddingHorizontal: 40,
    //backgroundColor: '#00B2BF',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  button: {
    backgroundColor: '#00B2BF',
    width: '45%',
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
