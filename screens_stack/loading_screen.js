/* eslint-disable react/no-string-refs */
/* eslint-disable no-undef */
import React, {Component} from 'react';
import {StyleSheet, View, SafeAreaView, Text} from 'react-native';

export default class Loading extends Component {
  render() {
    return (
      <SafeAreaView style={styleslogin.container}>
        <View style={styleslogin.background}>
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
    flex: 6,
    paddingTop: 250,
    paddingStart: 10,
    fontFamily: 'serif',
    color: '#FFD555',
    fontWeight: 'bold',
  },
});
