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

export default class FamilyScreen extends Component {
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
              onPress={() => this.props.navigation.navigate('AddFamilyScreen')}>
              <Image
                style={{top: -1, left: -6}}
                source={require('../../images/icons8-add-40.png')}
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              alignSelf: 'flex-start',
              alignItems: 'center',
              height: 40,
              width: '65%',
              borderRadius: 10,
              bottom: 10,
              left: 10,
              paddingLeft: 10,
              flexDirection: 'row',
            }}>
            <Image
              style={{width: 30, height: 30}}
              source={require('../../images/icons8-search-contacts-50.png')}
            />
            <TextInput
              style={{paddingLeft: 10}}
              placeholder="Tìm kiếm người thân"
            />
          </View>

          <View style={styles.listFamily}>
            <Text style={styles.titleList}>Danh sách người thân</Text>
            <View style={styles.list} />
          </View>
          <View style={styles.buttonAdd}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.props.navigation.navigate('AddFamilyScreen')}>
              <Text style={styles.buttonText}>Thêm người thân</Text>
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
    //backgroundColor: 'blue',
    bottom: 35,
    left: 15,
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
    height: 490,
    width: '100%',
    borderRadius: 30,
    backgroundColor: 'white',
    bottom: 20,
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
});
