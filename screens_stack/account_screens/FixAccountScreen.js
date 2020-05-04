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
import ImagePicker from 'react-native-image-crop-picker';
import * as nativeBase from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import DatePicker from 'react-native-datepicker';

export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    //set value in state for initial date
    this.state = {
      date: '',
      image: '',
      TextInput_Name: ' ',
      TextInput_NickName: ' ',
      TextInput_Number: 'Chưa cập nhật',
      TextInput_Gender: 'Chưa cập nhật',
      TextInput_Address: 'Chưa cập nhật',
    };
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
                <View style={{flexDirection: 'row'}}>
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}>
                    <Image
                      style={{
                        height: 40,
                        width: 40,
                        top: 8,
                      }}
                      source={require('./icons8-back-to-100.png')}
                    />
                  </TouchableOpacity>
                  <Text style={styles.Title2}>Chỉnh sửa thông tin cá nhân</Text>
                </View>
                <View style={styles.containerInfo}>
                  <Text style={styles.Title1}> Thông tin cá nhân </Text>
                  <View style={styles.InfoEdit}>
                    <TouchableOpacity
                      style={styles.avatar}
                      onPress={this.onClickAddImages}>
                      {this.state.image === '' && (
                        <Image
                          source={require('./icons8-camera-50.png')}
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
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                          }}
                        />
                      )}
                      <Text style={styles.textAva}>+ Thêm ảnh đại điện</Text>
                    </TouchableOpacity>
                    <Text style={styles.testTitle}>Tên: </Text>
                    <TextInput
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.secondTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Name: data})
                      }
                    />
                    <Text style={styles.testTitle}>Họ:</Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.secondTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.thirdTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_NickName: data})
                      }
                    />
                    <Text style={styles.testTitle}>Số điện thoại: </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.thirdTextInput = input;
                      }}
                      onSubmitEditing={() => {
                        this.fourthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Number: data})
                      }
                    />
                    <Text style={styles.testTitle}>Giới tính: </Text>
                    <TextInput
                      ref={input => {
                        this.fourthTextInput = input;
                      }}
                      style={styles.inputText}
                      onSubmitEditing={() => {
                        this.sixthTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Gender: data})
                      }
                    />
                    <Text style={styles.testTitle}>Ngày sinh: </Text>
                    <DatePicker
                      style={{
                        width: '90%',
                        borderRadius: 30,
                      }}
                      date={this.state.date}
                      mode="date"
                      locale="ja"
                      placeholder="select date"
                      format="YYYY-MM-DD"
                      minDate="01-01-1900"
                      maxDate="01-01-2100"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateInput: {
                          height: 30,
                          backgroundColor: '#F4F4F4',
                          borderWidth: 1,
                          borderRadius: 10,
                          borderColor: '#707070',
                        },
                      }}
                      onDateChange={date => {
                        this.props.onDateChange &&
                          this.props.onDateChange(date);
                        this.setState({date});
                      }}
                    />
                    <Text style={styles.testTitle}>Địa chỉ: </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.sixthTextInput = input;
                      }}
                      onChangeText={data =>
                        this.setState({TextInput_Address: data})
                      }
                    />
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
                    onPress={() =>
                      this.props.navigation.navigate('Account', {
                        NameOJB: this.state.TextInput_Name,
                        NameOJB2: this.state.TextInput_NickName,
                        DateOJB: this.state.date,
                        NumberOJB: this.state.TextInput_Number,
                        EmailOJB: this.state.TextInput_Email,
                        GenderOJB: this.state.TextInput_Gender,
                        AddressOJB: this.state.TextInput_Address,
                        ImageOJB: this.state.image,
                      })
                    }>
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
  onClickAddImages = () => {
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
  };

  chosePhotoFromLibrary = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({image: image.path});
      // console.log(image);
    });
  };
  takePhotoFromCamera = () => {
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: true,
    }).then(image => {
      this.setState({image: image.path});
      //console.log(image);
    });
  };
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingVertical: 0,
  },
  container: {
    flex: 1,
    height: 700,
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
    height: '92%',
    borderRadius: 30,
    backgroundColor: 'white',
    alignItems: 'flex-start',
    paddingStart: 25,
    justifyContent: 'center',
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
    start: 10,
  },
});
