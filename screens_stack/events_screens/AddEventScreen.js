/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import moment from 'moment';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  Alert,
  Picker,
} from 'react-native';
import * as nativeBase from 'native-base';
import DatePicker from 'react-native-datepicker';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AsyncStorage} from 'react-native';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
import DateTimePicker from '@react-native-community/datetimepicker';

export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageType: '',
      email: '',
      refreshToken: '',
      id: '',
      date: this.props.route.params.date,
      name: '',
      time: '',
      type: '',
      bio: 'Bên nội',
      cate: '',
      address: '',
      event: [],
      showTimePicker: false,
    };
  }
  _postDataEvent = async id => {
    if (this.state.name && this.state.date) {
      _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
        var URL = url + '/api/user/eventupdate';
        console.log(this.state.bio);
        try {
          fetch(URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              id: id,
              event: this.state.name,
              address: this.state.address,
              bio: this.state.bio,
              catelogy: this.state.cate,
              date: this.state.date,
              time: this.state.time,
              eventImage: this.state.image,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.props.navigation.navigate('Event');
            })
            .catch(error => {
              console.log('error: ' + error.toString());
              throw error;
            });
        } catch (error) {
          console.error(error);
        }
      });
    } else {
      Alert.alert('Vui lòng nhập đầy đủ tên và thời gian diễn ra sự kiên!');
    }
  };
  loadOneEvent = async id => {
    _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
      var URL = url + '/api/user/eventshowone';
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
              id: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              if (json.event.bio) {
                this.setState({
                  event: json.event,
                  name: json.event.event,
                  date: json.event.date,
                  id: id,
                  address: json.event.address,
                  bio: json.event.bio,
                  cate: json.event.catelogy,
                  eventImage: json.event.eventImage,
                  time: json.event.time,
                });
              } else {
                this.setState({
                  event: json.event,
                  name: json.event.event,
                  date: json.event.date,
                  id: id,
                  address: json.event.address,
                  cate: json.event.catelogy,
                  eventImage: json.event.eventImage,
                  time: json.event.time,
                });
              }
              if (this.props.route.params.date) {
                this.setState({date: this.props.route.params.date});
              }
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  onChange = selectedDate => {
    var date = moment(new Date(selectedDate.nativeEvent.timestamp)).format(
      'HH:mm',
    );
    this.setState({
      time: date,
      showTimePicker: false,
    });
  };
  componentDidMount() {
    this.getData().then(() => {
      if (this.props.route.params.id) {
        this.loadOneEvent(this.props.route.params.id);
      }
    });
  }
  async getData() {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: email,
    });
  }
  goBack() {
    this.props.navigation.navigate('Event');
  }
  createEvent = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/event';
      try {
        fetch(URL, {
          method: 'POST',
          headers: {
            Authorization: 'Bearer ' + data,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: this.state.id,
            event: this.state.name,
            address: this.state.address,
            bio: this.state.bio,
            catelogy: this.state.cate,
            date: this.state.date,
            time: this.state.time,
            eventImage: this.state.image,
          }),
        })
          .then(response => response.json())
          .then(json => {
            this.props.navigation.navigate('Event');
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
  render() {
    return (
      <nativeBase.Root>
        <KeyboardAwareScrollView
          scrollEnabled={true}
          contentContainerStyle={{flexGrow: 1}}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              <View
                style={{
                  flexDirection: 'row',
                  alignSelf: 'flex-start',
                  left: 30,
                }}>
                <TouchableOpacity onPress={() => this.goBack()}>
                  <Image
                    style={{
                      height: 40,
                      width: 40,
                      top: 6,
                    }}
                    source={require('../../images/icons8-back-to-100.png')}
                  />
                </TouchableOpacity>
                <Text style={styles.Title2}>Chỉnh sửa sự kiện</Text>
              </View>
              <View style={styles.containerInfo}>
                <Text style={styles.Title1}> Thông tin sự kiện </Text>
                <View style={styles.InfoEdit}>
                  <Text style={styles.testTitle}>Tên sự kiện </Text>
                  <TextInput
                    style={styles.inputText}
                    onSubmitEditing={() => {
                      this.fourthTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={data => this.setState({name: data})}>
                    {this.state.name}
                  </TextInput>
                  <Text style={styles.testTitle}>Ngày diễn ra </Text>
                  <DatePicker
                    style={{
                      width: '90%',
                      height: 40,
                      borderColor: 'darkgrey',
                    }}
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
                  <Text style={styles.testTitle}>Thời gian diễn ra </Text>
                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => this.setState({showTimePicker: true})}>
                      <Image
                        style={{width: 38, height: 38}}
                        source={require('../../images/icons8-time-64.png')}
                      />
                    </TouchableOpacity>
                    <TextInput
                      style={styles.inputTime}
                      ref={input => {
                        this.nextTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.fourthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({time: data})}>
                      {this.state.time}
                    </TextInput>
                  </View>
                  {this.state.showTimePicker && (
                    <DateTimePicker
                      style={styles.inputText}
                      mode="time"
                      value={new Date()}
                      onChange={data => this.onChange(data)}
                    />
                  )}
                  <Text style={styles.testTitle}>Nhóm </Text>
                  <View style={styles.picker}>
                    <Picker
                      selectedValue={this.state.bio}
                      onValueChange={(itemValue, itemIndex) => {
                        this.setState({bio: itemValue});
                      }}>
                      <Picker.Item label="Bên nội" value="Bên nội" />
                      <Picker.Item label="Bên ngoại" value="Bên ngoại" />
                    </Picker>
                  </View>
                  <Text style={styles.testTitle}>Mô tả</Text>
                  <TextInput
                    ref={input => {
                      this.fourthTextInput = input;
                    }}
                    style={styles.inputText}
                    onSubmitEditing={() => {
                      this.sixthTextInput.focus();
                    }}
                    blurOnSubmit={false}
                    onChangeText={data => this.setState({cate: data})}>
                    {this.state.cate}
                  </TextInput>
                  <Text style={styles.testTitle}>Địa điểm </Text>
                  <TextInput
                    style={styles.inputText}
                    ref={input => {
                      this.sixthTextInput = input;
                    }}
                    onChangeText={data => this.setState({address: data})}>
                    {this.state.address}
                  </TextInput>
                </View>
              </View>
              <View style={styles.ComboButton}>
                <TouchableOpacity
                  style={styles.Button2}
                  onPress={() => {
                    if (this.props.route.params.id) {
                      this._postDataEvent(this.props.route.params.id);
                    } else {
                      this.createEvent();
                    }
                  }}>
                  <Text style={styles.ButtonText2}>Cập nhật</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
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
    height: '100%',
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
    height: '93%',
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingStart: 25,
    justifyContent: 'space-around',
    paddingBottom: 30,
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
  Button2: {
    bottom: 10,
    borderRadius: 15,
    height: '100%',
    width: '75%',
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
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    fontSize: 15,
    paddingVertical: -15,
    borderWidth: 1,
  },
  inputTime: {
    width: '79%',
    height: 40,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    paddingVertical: -15,
    borderWidth: 1,
    fontSize: 15,
  },
  picker: {
    width: '90%',
    height: 40,
    fontSize: 15,
    borderColor: 'darkgrey',
    paddingStart: 10,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
  },
  avatar: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textAva: {
    fontSize: 18,
    color: 'darkgrey',
  },
});
