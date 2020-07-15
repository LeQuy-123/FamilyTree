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
  TouchableWithoutFeedback,
  Keyboard,
  AsyncStorage,
  Alert,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import url from '../../components/MainURL';
import * as nativeBase from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import _RefreshToken from '../../components/refresh_Token';
export default class AddGenealogyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rootId: this.props.route.params.rootId,
      accessToken: '',
      refreshToken: '',
      email: '',
      data: '',
      genoInfo: '',
      dataRoot: '',
      firstPerson: '',
    };
  }
  chosePhotoFromLibrary(i) {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      if (i === 0) {
        this.setState({
          firstPerson: {
            ...this.state.firstPerson,
            image: image.path,
          },
        });
      } else {
        this.setState({
          genoInfo: {
            ...this.state.genoInfo,
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
      if (i === 0) {
        this.setState({
          firstPerson: {
            ...this.state.firstPerson,
            image: image.path,
          },
        });
      } else {
        this.setState({
          genoInfo: {
            ...this.state.genoInfo,
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
  updateRoot = async id => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var updateURL = url + '/api/user/rootupdate';
      try {
        fetch(updateURL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + data,
          },
          body: JSON.stringify({
            rootId: id,
            treename: this.state.genoInfo.genoName,
            author: this.state.genoInfo.create,
            authoraddress: this.state.genoInfo.info,
            firstname: this.state.firstName,
            lastname: this.state.lastName,
            nickname: this.state.firstPerson.nickName,
            dob: this.state.firstPerson.dateBirth,
            dod: this.state.firstPerson.dateDeath,
            burialplace: this.state.firstPerson.dp,
            sex: this.state.firstPerson.sex,
            profileImage: this.state.firstPerson.image,
          }),
        })
          .then(response => response.json())
          .then(js => {
            console.log(JSON.stringify(js));
          })
          .catch(error => console.log(error));
      } catch (error) {
        console.error(error);
      }
    });
  };
  check() {
    return (
      this.state.genoInfo.genoName === undefined ||
      this.state.genoInfo.create === undefined ||
      this.state.firstPerson.firstName === undefined ||
      this.state.firstPerson.lastName === undefined
    );
  }
  onPressHandel() {
    if (!this.check()) {
      this.createNewTree();
      this.props.navigation.goBack();
    } else {
      Alert.alert(
        'Thông báo',
        'Vui lòng nhập đầy đủ thông tin tên gia phả, người tạo, tên và họ tổ tiên trước khi tạo gia phả!',
      );
    }
  }
  loadOneAuthor = async id => {
    var URL = url + '/api/user/authshowone';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    console.log(id);
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
              authId: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              console.log(JSON.stringify(json.auth));
              this.setState({
                genoInfo: {
                  genoName: json.auth.treename,
                  create: json.auth.author,
                  info: json.auth.address,
                  image: json.auth.profileImage,
                },
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  createNewTree = async () => {
    var URL = url + '/api/user/newtree';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    // console.log('geno info: ' + JSON.stringify(this.state.genoInfo));
    // console.log('person info: ' + JSON.stringify(this.state.firstPerson));
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
              treename: this.state.genoInfo.genoName,
              author: this.state.genoInfo.create,
              address: this.state.genoInfo.info,
              imgauth: this.state.genoInfo.image,
              firstname: this.state.firstPerson.firstName,
              lastname: this.state.firstPerson.lastName,
              nickname: this.state.firstPerson.nickName,
              sex: this.state.firstPerson.sex,
              dob: this.state.firstPerson.dateBirth,
              domicile: this.state.firstPerson.address,
              dod: this.state.firstPerson.dateDeath,
              burialplace: this.state.firstPerson.dp,
              imgroot: this.state.firstPerson.image,
            }),
          })
            .then(response => response.json())
            .then(json => {
              //console.log(JSON.stringify(json));
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  componentDidMount() {
    if (this.props.route.params.authId !== 0) {
      this.loadOneAuthor(this.props.route.params.authId);
    }
  }
  render() {
    return (
      <SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            Keyboard.dismiss;
          }}>
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
                <Text style={styles.title}>Tạo gia phả</Text>
              </View>
              <View style={styles.infoGroup}>
                <Text style={styles.titleGr}>Thông tin gia phả</Text>
                <View style={styles.info}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                    onPress={() => this.onClickAddImages(1)}>
                    {this.state.genoInfo.image ? (
                      <Image
                        source={{uri: this.state.genoInfo.image}}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 60,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../images/avatar_default.png')}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 20,
                        }}
                      />
                    )}
                    <Text style={styles.inputTitle}>
                      + Thêm ảnh hiển thị cho gia phả
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.inputTitle}>Tên gia phả* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, genoName: data},
                      })
                    }>
                    {this.state.genoInfo.genoName}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên người tạo* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, create: data},
                      })
                    }>
                    {this.state.genoInfo.create}
                  </TextInput>
                  <Text style={styles.inputTitle}>Mô tả gia phả </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, info: data},
                      })
                    }>
                    {this.state.genoInfo.info}
                  </TextInput>
                </View>
              </View>
              <View
                pointerEvents={this.props.route.params.authId ? 'none' : 'auto'}
                style={styles.infoFirstGenerationGroup}>
                <Text style={styles.titleGr}>
                  Thế hệ thứ nhất/ Thủy tổ dòng họ
                </Text>
                <View style={styles.infoFirstGeneration}>
                  <TouchableOpacity
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 20,
                    }}
                    onPress={() => this.onClickAddImages(0)}>
                    {this.state.firstPerson.image ? (
                      <Image
                        source={{uri: this.state.firstPerson.image}}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 60,
                        }}
                      />
                    ) : (
                      <Image
                        source={require('../../images/avatar_default.png')}
                        style={{
                          width: 120,
                          height: 120,
                          borderRadius: 20,
                        }}
                      />
                    )}
                    <Text style={styles.inputTitle}>+ Thêm ảnh đại diện</Text>
                  </TouchableOpacity>
                  <Text style={styles.inputTitle}>Họ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          firstName: data,
                        },
                      })
                    }>
                    {this.state.dataRoot.firstname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          lastName: data,
                        },
                      })
                    }>
                    {this.state.dataRoot.lastname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Tên gợi nhớ </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          nickName: data,
                        },
                      })
                    }>
                    {this.state.dataRoot.nickname}
                  </TextInput>
                  <Text style={styles.inputTitle}>Giới tính </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          sex: data,
                        },
                      })
                    }>
                    {this.state.dataRoot.sex}
                  </TextInput>
                  <Text style={styles.inputTitle}>Ngày sinh</Text>
                  <DatePicker
                    style={{width: '90%'}}
                    date={this.state.firstPerson.dateBirth}
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
                        left: 5,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 40,
                      },
                    }}
                    onDateChange={date => {
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          dateBirth: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Ngày giỗ</Text>
                  <DatePicker
                    style={{width: '90%'}}
                    date={this.state.firstPerson.dateDeath}
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
                        left: 5,
                        top: 4,
                        marginLeft: 0,
                      },
                      dateInput: {
                        marginLeft: 40,
                      },
                    }}
                    onDateChange={date => {
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          dateDeath: date,
                        },
                      });
                    }}
                  />
                  <Text style={styles.inputTitle}>Nơi sống </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {...this.state.firstPerson, address: data},
                      })
                    }>
                    {this.state.dataRoot.burialplace}
                  </TextInput>
                  <Text style={styles.inputTitle}>Mộ tang </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {...this.state.firstPerson, dp: data},
                      })
                    }>
                    {this.state.dataRoot.burialplace}
                  </TextInput>
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.onPressHandel();
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
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 1100,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBBD00',
    width: '100%',
    paddingHorizontal: 10,
  },
  titleGroup: {
    height: '4%',
    alignItems: 'center',
    paddingStart: 3,
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
    height: '33%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  info: {
    height: '88%',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    borderRadius: 30,
    paddingBottom: 10,
  },
  infoFirstGenerationGroup: {
    height: '60%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  infoFirstGeneration: {
    height: '93%',
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
});
