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
} from 'react-native';
import DatePicker from 'react-native-datepicker';
import url from '../../components/MainURL';
import _RefreshToken from '../../components/refresh_Token';
export default class AddGenealogyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      accessToken: '',
      refreshToken: '',
      email: '',
      data: '',
      firstName: '',
      middleName: '',
      lastName: '',
      genoInfo: {
        genoName: '',
        create: '',
        info: '',
      },
      firstPerson: {
        familyName: '',
        profile: 'https://img.icons8.com/cotton/2x/person-male.png',
        nickName: '',
        dateBirth: '',
        dateDeath: '',
        dp: '',
      },
    };
  }
  CreateRoot = async () => {
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
        this.setState({
          accessToken: data,
        });
        try {
          var URL = url + '/api/user/root';
          fetch(URL, {
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + data,
            },
          })
            .then(response => response.json())
            .then(json => {
              var updateURL = url + '/api/user/rootupdate';
              try {
                fetch(updateURL, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer ' + this.state.accessToken,
                  },
                  body: JSON.stringify({
                    rootId: json.root._id,
                    treename: this.state.genoInfo.genoName,
                    author: this.state.genoInfo.create,
                    authoraddress: this.state.genoInfo.info,
                    firstname: this.state.firstName,
                    middlename: this.state.middleName,
                    lastname: this.state.lastName,
                    nickname: this.state.firstPerson.nickName,
                    dob: this.state.firstPerson.dateBirth,
                    dod: this.state.firstPerson.dateDeath,
                    burialplace: this.state.firstPerson.dp,
                    profileImage: this.state.profile,
                  }),
                })
                  .then(response => response.json())
                  .then(js => {
                    console.log('root: ' + js.root);
                  })
                  .catch(error => console.log(error));
              } catch (error) {
                console.error(error);
              }
            })
            .catch(error => console.log('error here: ' + error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  onPressHandel() {
    this.CreateRoot();
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
                  <Text style={styles.inputTitle}>Tên gia phả* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, genoName: data},
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Tên người tạo* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, create: data},
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Mô tả gia phả* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        genoInfo: {...this.state.genoInfo, info: data},
                      })
                    }
                  />
                </View>
              </View>
              <View style={styles.infoFirstGenerationGroup}>
                <Text style={styles.titleGr}>
                  Thế hệ thứ nhất/ Thủy tổ dòng họ
                </Text>
                <View style={styles.infoFirstGeneration}>
                  <Text style={styles.inputTitle}>Họ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstName: data,
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Đêm* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        middleName: data,
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Tên* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        lastName: data,
                      })
                    }
                  />
                  <Text style={styles.inputTitle}>Tên gợi nhớ* </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {
                          ...this.state.firstPerson,
                          nickName: data,
                        },
                      })
                    }
                  />
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
                  <Text style={styles.inputTitle}>Mộ tang </Text>
                  <TextInput
                    style={styles.inputText}
                    onChangeText={data =>
                      this.setState({
                        firstPerson: {...this.state.firstPerson, dp: data},
                      })
                    }
                  />
                </View>
              </View>
            </View>
            <View style={styles.buttonAdd}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => {
                  this.onPressHandel();
                  //this.props.navigation.navigate('Genealogy');
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
    height: 1000,
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
    height: '31%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  info: {
    height: '85%',
    width: '100%',
    backgroundColor: 'white',
    justifyContent: 'space-around',
    borderRadius: 30,
    paddingBottom: 10,
  },
  infoFirstGenerationGroup: {
    height: '63%',
    width: '100%',
    backgroundColor: '#00B2BF',
    borderRadius: 30,
    justifyContent: 'flex-end',
  },
  infoFirstGeneration: {
    height: '92%',
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
