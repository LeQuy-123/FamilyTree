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
    };
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  loadFamily = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    console.log('Loading family');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/familyshow';
      if (data === null) {
        console.log('ko the refresh token do token het han');
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
    });
  };
  findFamily = async name => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    console.log('find family ' + name);
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/familysearch';
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
              name: name,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                dataFamily: json.result,
              });
              console.log(json);
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
      console.log('open directions');
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
    console.log(item._id);
    this.toggleModal();
  }
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadFamily();
      console.log('willFocus runs');
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
  createFamily = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/family';
      try {
        fetch(URL, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + data,
          },
        })
          .then(response => response.json())
          .then(json => {
            this.setState({
              id: json.family._id,
            });
            this.props.navigation.navigate('AddFamilyScreen', {
              id: this.state.id,
            });
            console.log('id :' + this.state.id);
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
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
        console.log('ko the refresh token do token het han');
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
              console.log(json.message);
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
    console.log('id bi xoa: ' + id);
    this.setState({
      dataFamily: this.state.dataFamily.filter(x => x._id !== id),
    });
  };
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
            <TouchableOpacity onPress={() => this.createFamily()}>
              <Image
                style={{top: -1, left: -6}}
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
          <View style={styles.listFamily}>
            <Text style={styles.titleList}>Danh sách người thân</Text>
            <View style={styles.list}>
              <FlatList
                style={{width: '100%'}}
                data={this.state.dataFamily}
                renderItem={this._renderItem}
                keyExtractor={item => item._id}
                extraData={this.state.dataFamily}
              />
            </View>
          </View>
          <View style={styles.buttonAdd}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.createFamily()}>
              <Text style={styles.buttonText}>Thêm người thân</Text>
            </TouchableOpacity>
          </View>
        </View>
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
              {this.state.image === undefined && (
                <Image
                  source={require('../../images/avatar_default.png')}
                  style={styles.modalTitleImage}
                />
              )}
              {this.state.image !== undefined && (
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
                  //source={require('../../images/icons8-call-50.png')}
                />
                <Text style={styles.modalOptionText}>Gọi điện</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.sendSMS(this.state.phone)}>
                <Image
                  style={styles.modalOptionImage}
                  //source={require('../../images/icons8-send-email-50.png')}
                />
                <Text style={styles.modalOptionText}>Nhắn tin</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.openMap(this.state.address)}>
                <Image style={styles.modalOptionImage} />
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
    fontSize: 18,
    //backgroundColor: 'blue',
    left: 15,
    top: 10,
    fontWeight: 'bold',
  },
  listFamily: {
    flex: 7,
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
    top: 20,
    bottom: 30,
    paddingBottom: 30,
  },
  buttonAdd: {
    flex: 1,
    width: '100%',
    top: 8,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#AEECEF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#FBBD00',
    width: '60%',
    height: '60%',
    borderRadius: 15,
    bottom: 5,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 10,
    marginHorizontal: 70,
    backgroundColor: 'white',
    borderRadius: 20,
    right: 20,
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
    bottom: 30,
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
    //backgroundColor: 'blue',
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
    borderRadius: 60,
    borderWidth: 1.5,
    borderColor: '#840505',
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
});
