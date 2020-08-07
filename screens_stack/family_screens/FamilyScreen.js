/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
  AsyncStorage,
  Linking,
  Platform,
  Alert,
} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
import Modal from 'react-native-modal';
import Svg, {Line} from 'react-native-svg';

export default class FamilyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      srName: '',
      email: '',
      dataFamily: [],
      id: '',
      currentID: '',
      isModalVisible: false,
      isModalVisible2: false,
      image: '',
      parentage: 'Họ nội',
      firstName: '',
      middleName: '',
      lastName: '',
      familyEmail: '',
      nickName: '',
      phone: '',
      sex: '',
      address: '',
      job: '',
      yourself: '',
      religion: '',
      date: '',
      friend: [],
    };
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  toggleModal2 = () => {
    this.setState({
      isModalVisible2: !this.state.isModalVisible2,
    });
  };
  loadFamily = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/familyshow';
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + data,
            },
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                dataFamily: json.family,
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
      this._getFriend(data);
    });
  };
  findFamily = async name => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/familysearch';
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
              name: name.trim(),
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                dataFamily: json.result,
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  makeCall = phone => {
    if (phone) {
      let phoneNumber = '';

      if (Platform.OS === 'android') {
        phoneNumber = 'tel:${' + phone + '}';
      } else {
        phoneNumber = 'telprompt:${' + phone + '}';
      }
      Linking.openURL(phoneNumber);
    } else {
      Alert.alert('Người thân này chưa đươc cập nhật số điện thoại');
    }
  };
  sendSMS = phone => {
    if (phone) {
      let phoneNumber = '';

      if (Platform.OS === 'android') {
        phoneNumber = 'sms:' + phone;
      } else {
        phoneNumber = 'sms:/open?addresses=' + phone;
      }
      Linking.openURL(phoneNumber);
    } else {
      Alert.alert('Người thân này chưa đươc cập nhật số điện thoại');
    }
  };
  openMap(address) {
    if (address) {
      if (Platform.OS === 'android') {
        Linking.openURL('geo:' + address);
      } else {
        Linking.openURL('maps:' + address);
      }
    } else {
      Alert.alert('Người thân này chưa đươc cập nhật địa chỉ');
    }
  }
  setOneFamily(item) {
    this.setState({
      currentID: item._id,
      image: item.profileImage,
      parentage: item.parentage,
      firstName: item.firstname,
      middleName: item.middlename,
      lastName: item.lastname,
      familyEmail: item.email,
      nickName: item.nickname,
      phone: item.numphone,
      sex: item.sex,
      address: item.address,
      job: item.job,
      yourself: item.yourself,
      religion: item.religion,
      date: item.datebirth,
    });
    this.toggleModal();
  }
  // modalOff() {
  //   this.setState({
  //     isModalVisible: false,
  //     isModalVisible2: false,
  //   });
  // }
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadFamily();
    });
  }
  _renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.setOneFamily(item)}>
      <View style={styles.item}>
        <View style={{flexDirection: 'row'}}>
          {item.profileImage !== '' && (
            <Image
              style={styles.imageOnList}
              source={{uri: item.profileImage}}
            />
          )}
          {item.profileImage === '' && (
            <Image
              style={styles.imageOnList}
              source={require('../../images/icons8-user-96.png')}
            />
          )}
          <View
            style={{
              alignItems: 'flex-start',
              left: -20,
              justifyContent: 'flex-start',
            }}>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <Image
                style={{
                  height: 19,
                  width: 19,
                }}
                source={require('../../images/icons8-contact-24.png')}
              />
              <Text style={styles.textStyle}>
                {item.firstname} {item.middlename} {item.lastname}
              </Text>
            </View>
            {item.parentage !== '' && item.parentage !== undefined && (
              <View
                style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={styles.iconOnList}
                  source={require('../../images/icons8-family-32.png')}
                />
                <Text style={styles.textStyle}>{item.parentage}</Text>
              </View>
            )}
            {item.numphone !== '' && item.numphone !== undefined && (
              <View
                style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={styles.iconOnList}
                  source={require('../../images/icons8-number-pad-32.png')}
                />
                <Text style={styles.textStyle}>{item.numphone}</Text>
              </View>
            )}
            {item.address !== '' && item.address !== undefined && (
              <View
                style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={styles.iconOnList}
                  source={require('../../images/icons8-address-24.png')}
                />
                <Text style={styles.textStyle}>{item.address}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
  loadFamilyId(id) {
    this.props.navigation.navigate('AddFamilyScreen', {
      id: id,
    });
  }
  _deleteFamily = async id => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    _RefreshToken(email, refreshToken).then(data => {
      var URL = url + '/api/user/destroyfamily';
      if (data === null) {
      } else {
        try {
          fetch(URL, {
            method: 'DELETE',
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
              this.deleteItem(id);
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  deleteItem = id => {
    this.setState({
      dataFamily: this.state.dataFamily.filter(x => x._id !== id),
    });
  };
  _getFriend = async token => {
    var URL = url + '/api/user/friends';
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
          var friend = [];
          json.friends.forEach(function(item, index) {
            friend.push(item.userId);
          });
          this.setState({friend: friend});
        });
    } catch (error) {
      console.error(error);
    }
  };
  _renderItem2 = ({item}) => (
    <View>
      <View style={styles.item2}>
        <View style={{flexDirection: 'row'}}>
          {item.profileImage !== '' && (
            <Image
              style={styles.imageOnList2}
              source={{uri: item.profileImage}}
            />
          )}
          {item.profileImage === '' && (
            <Image
              style={styles.imageOnList2}
              source={require('../../images/icons8-user-96.png')}
            />
          )}
          <View
            style={{
              alignItems: 'flex-start',
              left: -20,
              justifyContent: 'flex-start',
            }}>
            <View style={{justifyContent: 'center', flexDirection: 'row'}}>
              <Image
                style={{
                  height: 19,
                  width: 19,
                }}
                source={require('../../images/icons8-contact-24.png')}
              />
              <Text style={styles.textStyle}>{item.username}</Text>
            </View>
            {item.email !== '' && item.email !== undefined && (
              <View
                style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={styles.iconOnList}
                  source={require('../../images/icons8-family-32.png')}
                />
                <Text style={styles.textStyle}>{item.email}</Text>
              </View>
            )}
            {item.numphone !== '' && item.numphone !== undefined && (
              <View
                style={{justifyContent: 'flex-start', flexDirection: 'row'}}>
                <Image
                  style={styles.iconOnList}
                  source={require('../../images/icons8-number-pad-32.png')}
                />
                <Text style={styles.textStyle}>{item.numphone}</Text>
              </View>
            )}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate('Geno', {id: item._id});
                }}
                style={{
                  top: 4,
                  borderRadius: 10,
                  height: 25,
                  width: 170,
                  backgroundColor: '#FBBD00',
                  justifyContent: 'center',
                  alignItems: 'center',
                  shadowColor: 'black',
                  shadowOffset: {
                    width: 1,
                    height: 12,
                  },
                  shadowOpacity: 1,
                  shadowRadius: 5.0,
                  elevation: 10,
                }}>
                <Text>Xem gia phả được chia sẻ</Text>
              </TouchableOpacity>
              <Image
                style={{
                  top: 5,
                  width: 22,
                  height: 22,
                  left: 10,
                }}
                source={require('../../images/icons8-share-64.png')}
              />
            </View>
          </View>
        </View>
      </View>
      <Svg height="10" width="100%">
        <Line
          x1="15%"
          y1="0%"
          x2="85%"
          y2="0%"
          stroke="black"
          strokeWidth="3"
        />
      </Svg>
    </View>
  );
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}> GIA ĐÌNH</Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('AddFamilyScreen', {id: 0})
              }>
              <Image
                style={{top: 5}}
                source={require('../../images/icons8-add-40.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.searchText}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../images/icons8-search-contacts-50.png')}
            />
            <TextInput
              style={{paddingLeft: 10}}
              placeholder="Tìm kiếm người thân"
              onChangeText={data => this.setState({srName: data})}
              onSubmitEditing={() => this.findFamily(this.state.srName)}
            />
          </View>
          {this.state.dataFamily.length > 0 ? (
            <View style={styles.listFamily}>
              <Text style={styles.titleList}>Danh sách người thân</Text>
              <View style={styles.list}>
                <FlatList
                  style={{width: '100%', height: '100%', top: -10}}
                  data={this.state.dataFamily}
                  renderItem={this._renderItem}
                  keyExtractor={item => item._id}
                  extraData={this.state.dataFamily}
                />
              </View>
            </View>
          ) : (
            <View style={styles.listFamily}>
              <Text
                style={{
                  fontFamily: 'serif',
                  height: '5%',
                  fontSize: 25,
                  left: 15,
                  top: 10,
                  fontWeight: 'bold',
                }}>
                Danh sách người thân
              </Text>
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  //backgroundColor: 'blue',
                }}>
                <Image
                  style={{
                    height: '62%',
                    width: '81%',
                  }}
                  source={require('../../images/1833517.png')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'serif',
                  }}>
                  Bạn chưa có thông tin của người thân nào trong danh sách, bắt
                  đầu chép thông tin người thân bằng cách nhấn vào nút dấu (+)
                  phía dưới ngay thôi!
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddFamilyScreen', {id: 0})
                  }
                  style={styles.buttonContainer}>
                  <Image source={require('../../images/icons8-add-40.png')} />
                  <Text
                    style={{
                      left: 15,
                      textAlign: 'center',
                      fontSize: 18,
                      fontFamily: 'serif',
                    }}>
                    Thêm người thân
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          <View style={styles.buttonAdd}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.toggleModal2()}>
              <Image
                style={{width: 30, height: 30, right: 10}}
                source={require('../../images/icons8-family-100.png')}
              />
              <Text style={styles.buttonText}>Liên kết người thân</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          backdropOpacity={0.6}
          coverScreen={false}
          isVisible={this.state.isModalVisible2}
          onSwipeComplete={this.toggleModal2}
          onBackButtonPress={this.toggleModal2}
          swipeThreshold={200}
          swipeDirection={['left', 'right', 'down']}
          style={{alignItems: 'center', justifyContent: 'center'}}>
          <View
            style={{
              backgroundColor: 'white',
              width: '95%',
              height: '80%',
              borderRadius: 30,
              top: 20,
            }}>
            <Text
              style={{
                fontFamily: 'serif',
                height: '5%',
                fontSize: 20,
                left: 15,
                top: 10,
                fontWeight: 'bold',
              }}>
              Danh sách liên kết
            </Text>
            <Svg height="15" width="100%">
              <Line
                x1="5%"
                y1="100%"
                x2="95%"
                y2="100%"
                stroke="black"
                strokeWidth="5"
              />
            </Svg>
            <FlatList
              style={{width: '100%', height: '100%', top: 10}}
              data={this.state.friend}
              renderItem={this._renderItem2}
              keyExtractor={item => item._id}
              extraData={this.state.friend}
            />
          </View>
        </Modal>
        <Modal
          backdropOpacity={0.6}
          coverScreen={false}
          isVisible={this.state.isModalVisible}
          onSwipeComplete={this.toggleModal}
          onBackButtonPress={this.toggleModal}
          swipeThreshold={200}
          swipeDirection={['left', 'right', 'down']}
          style={styles.view}>
          <View style={styles.modal}>
            <View style={styles.modalTitle}>
              {!this.state.image ? (
                <Image
                  source={require('../../images/avatar_default.png')}
                  style={styles.modalTitleImage}
                />
              ) : (
                <Image
                  source={{uri: this.state.image}}
                  style={styles.modalTitleImage}
                />
              )}
              <View style={styles.modalTitleInfo}>
                <Text
                  style={{
                    fontFamily: 'serif',
                    fontSize: 18,
                    fontWeight: 'bold',
                  }}>
                  {this.state.firstName} {this.state.middleName}{' '}
                  {this.state.lastName}
                </Text>
                <Text
                  style={{
                    fontFamily: 'serif',
                    fontSize: 16,
                    bottom: 10,
                    color: '#840505',
                  }}>
                  {this.state.yourself}
                </Text>
              </View>
            </View>
            <View style={styles.modalOption}>
              <TouchableOpacity onPress={() => this.makeCall(this.state.phone)}>
                <Image
                  style={styles.modalOptionImage}
                  source={require('../../images/icons8-call-male-100.png')}
                />
                <Text style={styles.modalOptionText}>Gọi điện</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.sendSMS(this.state.phone)}>
                <Image
                  style={styles.modalOptionImage}
                  source={require('../../images/icons8-sms-96.png')}
                />
                <Text style={styles.modalOptionText}>Nhắn tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.openMap(this.state.address)}>
                <Image
                  style={styles.modalOptionImage}
                  source={require('../../images/icons8-address-100.png')}
                />
                <Text style={styles.modalOptionText}>Chỉ đường</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.modalInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                }}>
                <Text style={styles.modalInfoText}>Dòng họ</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.parentage}
                </Text>
                <Text style={styles.modalInfoText}>Ngày sinh</Text>
                <Text style={styles.modalOptionText}>{this.state.date}</Text>
                <Text style={styles.modalInfoText}>Giới tính</Text>
                <Text style={styles.modalOptionText}>{this.state.sex}</Text>
              </View>
              <View style={{flex: 1, justifyContent: 'space-around'}}>
                <Text style={styles.modalInfoText}>Số điện thoại</Text>
                <Text style={styles.modalOptionText}>{this.state.phone}</Text>
                <Text style={styles.modalInfoText}>Email</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.familyEmail}
                </Text>
                <Text style={styles.modalInfoText}>Địa chỉ</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.address}{' '}
                </Text>
              </View>
            </View>
            <View style={styles.modalButton}>
              <TouchableOpacity
                style={styles.modalButtonBoder}
                onPress={() => {
                  this._deleteFamily(this.state.currentID);
                  this.toggleModal();
                }}>
                <Text style={styles.modalButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButtonBoder}
                onPress={() => {
                  this.toggleModal();
                  this.loadFamilyId(this.state.currentID);
                }}>
                <Text style={styles.modalButtonText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00B2BF',
  },
  titleContainer: {
    top: 10,
    flex: 1,
    width: '92%',
    flexDirection: 'row',
    //backgroundColor: '#00B2BF',
    //backgroundColor: 'blue',
  },
  title: {
    flex: 1,
    fontSize: 35,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  titleText: {
    fontSize: 35,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
  },
  titleList: {
    fontFamily: 'serif',
    height: '5%',
    fontSize: 20,
    left: 15,
    top: 5,
    fontWeight: 'bold',
  },
  listFamily: {
    flex: 7.5,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FBBD00',
    justifyContent: 'flex-end',
  },
  list: {
    height: '95%',
    width: '100%',
    alignItems: 'center',
    alignSelf: 'center',
    top: 15,
    paddingBottom: 20,
  },
  buttonAdd: {
    height: '10%',
    width: '100%',
    top: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#AEECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#FBBD00',
    width: '60%',
    height: '55%',
    borderRadius: 15,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 5.0,
    elevation: 10,
  },
  buttonText: {
    color: '#840505',
    fontFamily: 'serif',
    fontSize: 16,
  },
  searchText: {
    backgroundColor: 'white',
    alignSelf: 'center',
    alignItems: 'center',
    height: 40,
    width: '90%',
    borderRadius: 10,
    bottom: 10,
    paddingLeft: 10,
    flexDirection: 'row',
  },
  item: {
    height: 80,
    width: '80%',
    marginTop: 25,
    marginHorizontal: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    right: 20,
    flexDirection: 'row',
  },
  item2: {
    height: 80,
    width: '80%',
    marginBottom: 10,
    backgroundColor: 'white',
    left: 40,
    borderRadius: 20,
    flexDirection: 'row',
  },
  textStyle: {
    fontFamily: 'serif',
    fontSize: 14,
    left: 5,
  },
  iconOnList: {
    height: 20,
    width: 20,
  },
  imageOnList: {
    height: 80,
    width: 80,
    borderRadius: 50,
    backgroundColor: '#AEECEF',
    right: 30,
    bottom: 25,
    borderWidth: 1,
    borderColor: 'white',
  },
  imageOnList2: {
    height: 80,
    width: 80,
    borderRadius: 50,
    backgroundColor: '#AEECEF',
    right: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modal: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    height: '53%',
    width: '100%',
    backgroundColor: 'white',
  },
  modalTitle: {
    flex: 1.3,
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    flexDirection: 'row',
    width: '100%',
  },
  modalTitleImage: {
    height: 150,
    width: 150,
    bottom: 80,
    left: 35,
    borderRadius: 80,
    backgroundColor: '#00B2BF',
  },
  modalTitleInfo: {
    left: 45,
    justifyContent: 'space-around',
  },
  modalOption: {
    flex: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalOptionImage: {
    height: 70,
    width: 70,
  },
  modalOptionText: {
    fontFamily: 'serif',
    fontSize: 15,
    left: 5,
  },
  modalInfo: {
    flexDirection: 'row',
    flex: 2.5,
    width: '100%',
    backgroundColor: 'white',
    paddingLeft: 20,
  },
  modalInfoText: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: 'bold',
  },
  modalButton: {
    flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
  },
  modalButtonBoder: {
    width: 160,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#840505',
  },
  modalButtonText: {
    fontFamily: 'serif',
    fontSize: 18,
    color: '#840505',
  },
  buttonContainer: {
    width: '60%',
    flexDirection: 'row',
    height: 50,
    top: 10,
    alignItems: 'center',
    borderRadius: 17,
    paddingHorizontal: 20,
    backgroundColor: '#AEECEF',
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
