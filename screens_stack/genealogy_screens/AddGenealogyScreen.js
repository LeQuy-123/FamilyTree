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
import DatePicker from 'react-native-datepicker';
import url from '../../components/MainURL';
export default class AddGenealogyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView
          style={{
            backgroundColor: '#FBBD00',
          }}>
          <View style={styles.container}>
            <View style={styles.titleGroup}>
              <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
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
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Tên người tạo* </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Mô tả gia phả* </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
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
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Đêm* </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Tên* </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Tên gợi nhớ* </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
                <Text style={styles.inputTitle}>Ngày sinh</Text>
                <DatePicker
                  style={{width: '90%'}}
                  date={new Date()}
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
                  // onDateChange={date => {
                  //   this.setState({date: date});
                  // }}
                />
                <Text style={styles.inputTitle}>Ngày giỗ</Text>
                <DatePicker
                  style={{width: '90%'}}
                  date={new Date()}
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
                  // onDateChange={date => {
                  //   this.setState({date: date});
                  // }}
                />
                <Text style={styles.inputTitle}>Mộ tang </Text>
                <TextInput
                  style={styles.inputText}
                  //onChangeText={data => this.setState({TextInput_Address: data})}
                />
              </View>
            </View>
          </View>
          <View style={styles.buttonAdd}>
            <TouchableOpacity style={styles.button}>
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
