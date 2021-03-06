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
  Picker,
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import url from '../../components/MainURL';
import * as nativeBase from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import _RefreshToken from '../../components/refresh_Token';
const location = require('../../components/tinh.json');
import ModalFilterPicker from 'react-native-modal-filter-picker';

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
      firstPerson: {
        sex: 'Nam',
      },
      visible: false,
      choose: '',
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
  check() {
    if (this.props.route.params.rootId === 0) {
      return (
        this.state.genoInfo.genoName === undefined ||
        this.state.genoInfo.create === undefined ||
        this.state.firstPerson.firstName === undefined ||
        this.state.firstPerson.lastName === undefined
      );
    } else {
      return (
        this.state.genoInfo.genoName === undefined ||
        this.state.genoInfo.create === undefined
      );
    }
  }
  onPressHandel() {
    if (!this.check()) {
      if (this.props.route.params.rootId === 0) {
        this.createNewTree();
        this.props.navigation.goBack();
      } else {
        this.updateOneAuthor(this.props.route.params.rootId);
        this.props.navigation.goBack();
      }
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
  updateOneAuthor = async id => {
    var URL = url + '/api/user/authorupdate';
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
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              authId: id,
              treename: this.state.genoInfo.genoName,
              author: this.state.genoInfo.create,
              address: this.state.genoInfo.info,
              profileImage: this.state.genoInfo.image,
            }),
          })
            .then(response => response.json())
            .then(json => {})
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
              middlename: this.state.firstPerson.middleName,
              lastname: this.state.firstPerson.lastName,
              nickname: this.state.firstPerson.nickName,
              sex: this.state.firstPerson.sex,
              dob: this.state.firstPerson.dateBirth,
              domicile: this.state.firstPerson.address,
              dod: this.state.firstPerson.dateDeath,
              burialplace: this.state.firstPerson.dp,
              rank: this.state.firstPerson.rank,
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
    if (this.props.route.params.rootId !== 0) {
      this.loadOneAuthor(this.props.route.params.rootId);
    }
  }
  onShow = () => {
    this.setState({visible: true, choose: 1});
  };
  onShow2 = () => {
    this.setState({visible: true, choose: 2});
  };
  onSelect = picked => {
    if (this.state.choose === 1) {
      this.setState({
        firstPerson: {
          ...this.state.firstPerson,
          address: picked.label,
        },
        visible: false,
      });
    } else {
      this.setState({
        firstPerson: {
          ...this.state.firstPerson,
          dp: picked.label,
        },
        visible: false,
      });
    }
  };
  input({title = '', onChangeText = () => {}, data = '', keyboardType = ''}) {
    return (
      <View>
        <Text style={styles.inputTitle}>{title}</Text>
        <TextInput
          style={styles.inputText}
          onChangeText={onChangeText}
          keyboardType={keyboardType}>
          {data}
        </TextInput>
      </View>
    );
  }
  onCancel = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    return (
      <nativeBase.Root>
        <SafeAreaView
          style={{
            flex: 1,
          }}>
          <TouchableWithoutFeedback
            onPress={() => {
              Keyboard.dismiss;
            }}>
            {this.props.route.params.rootId === 0 ? (
              <ScrollView style={{flex: 1}}>
                <View style={styles.container}>
                  <View style={styles.titleGroup}>
                    <TouchableOpacity
                      onPress={() => this.props.navigation.goBack()}>
                      <Image
                        style={{
                          height: 40,
                          width: 40,
                          top: 3,
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
                      {this.input({
                        title: 'Tên gia phả*',
                        onChangeText: data =>
                          this.setState({
                            genoInfo: {
                              ...this.state.genoInfo,
                              genoName: data,
                            },
                          }),
                        data: this.state.genoInfo.genoName,
                      })}
                      {this.input({
                        title: 'Tên người tạo*',
                        onChangeText: data =>
                          this.setState({
                            genoInfo: {
                              ...this.state.genoInfo,
                              create: data,
                            },
                          }),
                        data: this.state.genoInfo.create,
                      })}
                      {this.input({
                        title: 'Mô tả gia phả',
                        onChangeText: data =>
                          this.setState({
                            genoInfo: {
                              ...this.state.genoInfo,
                              info: data,
                            },
                          }),
                        data: this.state.genoInfo.info,
                      })}
                    </View>
                  </View>
                  <View style={styles.infoFirstGenerationGroup}>
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
                        <Text style={styles.inputTitle}>
                          + Thêm ảnh đại diện
                        </Text>
                      </TouchableOpacity>
                      {this.input({
                        title: 'Họ*',
                        onChangeText: data =>
                          this.setState({
                            firstPerson: {
                              ...this.state.firstPerson,
                              firstName: data,
                            },
                          }),
                      })}
                      {this.input({
                        title: 'Đệm',
                        onChangeText: data =>
                          this.setState({
                            firstPerson: {
                              ...this.state.firstPerson,
                              middleName: data,
                            },
                          }),
                      })}
                      {this.input({
                        title: 'Tên*',
                        onChangeText: data =>
                          this.setState({
                            firstPerson: {
                              ...this.state.firstPerson,
                              lastName: data,
                            },
                          }),
                      })}
                      {this.input({
                        title: 'Tên gợi nhớ*',
                        onChangeText: data =>
                          this.setState({
                            firstPerson: {
                              ...this.state.firstPerson,
                              nickName: data,
                            },
                          }),
                      })}
                      {this.input({
                        title: 'Thứ bậc trong gia đình',
                        onChangeText: data =>
                          this.setState({
                            firstPerson: {
                              ...this.state.firstPerson,
                              rank: data,
                            },
                          }),
                        keyboardType: 'number-pad',
                      })}
                      <Text style={styles.inputTitle}>Giới tính </Text>
                      <View style={styles.inputText}>
                        <Picker
                          style={{
                            fontFamily: 'serif',
                            width: '100%',
                            height: 35,
                            fontSize: 16,
                          }}
                          selectedValue={this.state.firstPerson.sex}
                          onValueChange={(itemValue, itemIndex) =>
                            this.setState({
                              firstPerson: {
                                ...this.state.firstPerson,
                                sex: itemValue,
                              },
                            })
                          }>
                          <Picker.Item label="Nam" value="Nam" />
                          <Picker.Item label="Nữ" value="Nữ" />
                          <Picker.Item label="Khác" value="Khác" />
                        </Picker>
                      </View>
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
                      <TouchableOpacity onPress={this.onShow}>
                        {this.state.firstPerson.address ? (
                          <Text style={styles.inputText2}>
                            {this.state.firstPerson.address}
                          </Text>
                        ) : (
                          <Text style={styles.inputText2}>Chọn tỉnh thành</Text>
                        )}
                      </TouchableOpacity>
                      <ModalFilterPicker
                        visible={this.state.visible}
                        onSelect={this.onSelect}
                        onCancel={this.onCancel}
                        options={location}
                      />
                      <Text style={styles.inputTitle}>Mộ tang </Text>
                      <TouchableOpacity onPress={this.onShow2}>
                        {this.state.firstPerson.dp ? (
                          <Text style={styles.inputText2}>
                            {this.state.firstPerson.dp}
                          </Text>
                        ) : (
                          <Text style={styles.inputText2}>Chọn tỉnh thành</Text>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={styles.buttonAdd}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => {
                        this.onPressHandel();
                        console.log(JSON.stringify(this.state.firstPerson));
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
                </View>
              </ScrollView>
            ) : (
              <View style={styles.container2}>
                <View style={styles.titleGroup}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Image
                      style={{
                        height: 40,
                        width: 40,
                        top: 3,
                      }}
                      source={require('../../images/icons8-back-to-100.png')}
                    />
                  </TouchableOpacity>
                  <Text style={styles.title}>Tạo gia phả</Text>
                </View>
                <View
                  style={{
                    height: 400,
                    width: '100%',
                    backgroundColor: '#00B2BF',
                    borderRadius: 30,
                    justifyContent: 'flex-end',
                  }}>
                  <Text style={styles.titleGr}>Thông tin gia phả</Text>
                  <View
                    style={{
                      height: 360,
                      width: '100%',
                      backgroundColor: 'white',
                      justifyContent: 'space-around',
                      borderRadius: 30,
                      paddingBottom: 10,
                    }}>
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
                          genoInfo: {
                            ...this.state.genoInfo,
                            genoName: data,
                          },
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
                <View style={styles.buttonAdd}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                      //this.onPressHandel();
                      console.log(JSON.stringify(this.state.firstPerson));
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
              </View>
            )}
          </TouchableWithoutFeedback>
        </SafeAreaView>
      </nativeBase.Root>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    height: 1250,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBBD00',
    width: '100%',
    paddingHorizontal: 10,
  },
  container2: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FBBD00',
    paddingHorizontal: 10,
  },
  titleGroup: {
    height: '4%',
    alignItems: 'center',
    paddingStart: 3,
    width: '100%',
    flexDirection: 'row',
  },
  title: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
    left: 20,
  },
  infoGroup: {
    height: '32%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  info: {
    height: '89%',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    borderRadius: 30,
    paddingBottom: 10,
  },
  infoFirstGenerationGroup: {
    height: '57%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  infoFirstGeneration: {
    height: '95%',
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
    borderWidth: 1,
  },
  inputText2: {
    fontFamily: 'serif',
    left: 20,
    width: '86%',
    height: 35,
    fontSize: 16,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    padding: -10,
    borderWidth: 1,
    margin: 5,
    paddingTop: 5,
  },
  buttonAdd: {
    width: '100%',
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    bottom: 20,
  },
  button: {
    backgroundColor: '#00B2BF',
    width: '80%',
    height: '100%',
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
