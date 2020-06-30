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
} from 'react-native';

export default class DisplayGenealogy extends Component {
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
            <Text style={styles.title}> GIA PHẢ</Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate('AddGenealogy')}>
              <Image
                style={{top: -1, left: -6}}
                source={require('../../images/icons8-add-40.png')}
              />
            </TouchableOpacity>
          </View>
          <Image
            style={{
              height: 65,
              width: 65,
              alignSelf: 'flex-start',
              left: 10,
              bottom: 5,
            }}
            source={require('../../images/family-tree.png')}
          />
          <View style={styles.listGenealogyBackground}>
            <Text style={styles.titleList}>Danh sách gia phả</Text>
            <View style={styles.listGenealogy}>
              <Image
                style={{height: 320, width: 320, bottom: 10}}
                source={require('../../images/pngguru.com.png')}
              />
              <Text style={styles.textWithoutGenealogy}>
                Bạn chưa có gia phả nào, nhấn vào nút Tạo gia phả để bắt đầu tạo
                cây gia phả ngay thôi!
              </Text>
            </View>
          </View>
          <View style={styles.buttonAdd}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('AddGenealogy')}>
              <Text style={styles.buttonText}>Tạo gia phả</Text>
            </TouchableOpacity>
          </View>
        </View>
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
    top: 15,
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
    bottom: 18,
    left: 15,
    fontWeight: 'bold',
  },
  listGenealogyBackground: {
    flex: 7,
    width: '100%',
    borderRadius: 30,
    backgroundColor: '#FBBD00',
    justifyContent: 'flex-end',
  },
  listGenealogy: {
    height: '90%',
    width: '100%',
    borderRadius: 30,
    bottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
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
  textWithoutGenealogy: {
    height: '18%',
    width: '80%',
    textAlign: 'center',
    fontSize: 17,
    fontFamily: 'serif',
    bottom: -10,
  },
});
