/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';

import {StyleSheet, View, SafeAreaView, Text, Image} from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <SafeAreaView style={styleslogin.container}>
        <View style={styleslogin.background}>
          <Image
            style={{
              height: 150,
              width: 150,
              top: -50,
              left: 5,
            }}
            source={{
              uri:
                'https://mellullaby.herokuapp.com/api/normal/image/amadeus-1589026468500-genealogy-logo.png',
            }}
          />
          <Text style={styleslogin.header_text1_1}> Genealogy </Text>
        </View>
      </SafeAreaView>
    );
  }
}
const styleslogin = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  background: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#00B2BF',
  },
  header_text1_1: {
    fontSize: 55,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
  },
});
