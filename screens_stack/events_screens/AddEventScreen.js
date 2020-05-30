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
  Alert,
} from 'react-native';
import * as nativeBase from 'native-base';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {AsyncStorage} from 'react-native';

import DatePicker from 'react-native-datepicker';

export default class FixAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      myEmail: '',
      date: '',
      image: '',
      imageType: '',
      TextInput_Name: ' ',
      TextInput_NickName: ' ',
      TextInput_Number: 'Chưa cập nhật',
      TextInput_Gender: 'Chưa cập nhật',
      TextInput_Address: 'Chưa cập nhật',
      baseUrl: 'https://familytree1.herokuapp.com/api/user/update',
      accessToken: null,
      myRefreshToken: '',
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
                      source={require('../account_screens/icons8-back-to-100.png')}
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
                        this.secondTextInput.focus();
                      }}
                      blurOnSubmit={false}
                      onChangeText={data =>
                        this.setState({TextInput_Name: data})
                      }
                    />
                    <Text style={styles.testTitle}>Thời gian diễn ra </Text>
                    <Text style={styles.inputText} />
                    <Text style={styles.testTitle}>Loại sự kiện </Text>
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
                      onChangeText={data =>
                        this.setState({TextInput_Number: data})
                      }
                    />
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
                      onChangeText={data =>
                        this.setState({TextInput_Gender: data})
                      }
                    />
                    <Text style={styles.testTitle}>Địa điểm </Text>
                    <TextInput
                      style={styles.inputText}
                      ref={input => {
                        this.sixthTextInput = input;
                      }}
                      onChangeText={data =>
                        this.setState({TextInput_Address: data})
                      }
                    />
                    <Text style={styles.testTitle}>Hình ảnh sự kiện </Text>
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
                  <TouchableOpacity style={styles.Button2}>
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
    height: '92%',
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
    start: 10,
  },
});
