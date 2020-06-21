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
} from 'react-native';
import * as nativeBase from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AsyncStorage} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageType: '',
      accessToken: null,
      myRefreshToken: '',
      id: this.props.route.params.id,
      image: this.props.route.params.eventImage,
      date: this.props.route.params.date,
      name: this.props.route.params.event,
      time: this.props.route.params.time,
      type: this.props.route.params.type,
      bio: this.props.route.params.bio,
      cate: this.props.route.params.cate,
      address: this.props.route.params.address,
      event: [],
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
        imageType: image.mime,
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
        image: image.path,
        imageType: image.mime,
      });
    });
  }
  onClickAddImages() {
    const Buttons = ['Chup anh', 'Chon anh tu thu vien', 'Thoat'];
    nativeBase.ActionSheet.show(
      {
        options: Buttons,
        cancelButtonIndex: 2,
        title: 'Tai avatar moi',
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
  _postDataEvent = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    _RefreshToken(email, refreshToken).then(data => {
      var URL = url + '/api/user/eventupdate';
      try {
        fetch(URL, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + data,
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
            this.setState({event: json.event});
          })
          .catch(error => {
            console.log('error: ' + error.toString());
            throw error;
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
  componentDidMount() {
    if (!this.state.date) {
      this._loadOneEvent();
    }
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
                <View style={{flexDirection: 'row', left: -50}}>
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
                  <Text style={styles.Title2}>Chỉnh sửa sự kiện</Text>
                </View>
                <View style={styles.containerInfo}>
                  <Text style={styles.Title1}> Thông tin sự kiện </Text>
                  <View style={styles.InfoEdit}>
                    <Text style={styles.testTitle}>Tên sự kiện </Text>
                    <TextInput
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.nextTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({name: data})}>
                      {this.props.route.params.event}
                    </TextInput>
                    <Text style={styles.testTitle}>Ngày diễn ra </Text>
                    <Text
                      style={{
                        width: '90%',
                        height: 40,
                        fontSize: 16,
                        borderColor: 'darkgrey',
                        paddingStart: 10,
                        paddingTop: 10,
                        borderRadius: 10,
                        borderWidth: 1,
                      }}>
                      {this.props.route.params.date}
                    </Text>
                    <Text style={styles.testTitle}>Thời gian diễn ra </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.nextTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.thirdTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({time: data})}>
                      {this.props.route.params.time}
                    </TextInput>
                    <Text style={styles.testTitle}>Nhóm </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.thirdTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.fourthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data => this.setState({bio: data})}>
                      {this.props.route.params.bio}
                    </TextInput>
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
                      {this.props.route.params.cate}
                    </TextInput>
                    <Text style={styles.testTitle}>Địa điểm </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.sixthTextInput = input;
                      }}
                      onChangeText={data => this.setState({address: data})}>
                      {this.props.route.params.address}
                    </TextInput>
                    <Text style={styles.testTitle}>Hình ảnh sự kiện </Text>
                    <TouchableOpacity
                      style={styles.avatar}
                      onPress={() => this.onClickAddImages()}>
                      {this.state.image === undefined && (
                        <Image
                          source={require('../../images/avatar_default.png')}
                          style={{
                            width: 100,
                            height: 100,
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
                      <Text style={styles.textAva}>+ Ảnh sự kiện</Text>
                    </TouchableOpacity>
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
                    onPress={() => {
                      this._postDataEvent();
                      this.props.navigation.navigate('Event');
                    }}>
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
  },
});
