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
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, {Line} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
const Sample = require('../../sample.json');

export default class GenealogyScreen extends Component {
  constructor(props) {
    super(props);
  }

  hasChildren(member) {
    return member.children && member.children.length;
  }

  renderTree(data, level) {
    return (
      <FlatList
        data={data}
        horizontal={true}
        contentContainerStyle={{padding: 50}}
        keyExtractor={(item, index) => `${item.name} + ${item.spouse}`}
        listKey={(item, index) => `${item.name} + ${item.spouse}`}
        initialScrollIndex={0}
        renderItem={({item, index}) => {
          const {name, spouse, profile, id} = item;
          const info = {name, spouse, profile};
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: this.props.siblingGap / 3,
                paddingRight: this.props.siblingGap / 3,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <TouchableOpacity
                  onLongPress={() => console.log(item.id)}
                  onPress={() =>
                    this.props.navigation.navigate('FixInfoScreen')
                  }>
                  <View
                    style={{
                      ...this.props.nodeStyle,
                      //backgroundColor: 'blue',
                    }}>
                    <Image
                      style={{...this.props.imageStyle}}
                      source={{uri: info.profile}}
                    />
                    <Text
                      style={{
                        ...this.props.nodeTitleStyle,
                        color: this.props.nodeTitleColor,
                      }}>
                      {info.name}
                      {level}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              {this.hasChildren(item) && (
                <Svg height="50" width="20">
                  <Line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="150"
                    stroke={this.props.pathColor}
                    strokeWidth={this.props.strokeWidth}
                  />
                </Svg>
              )}
              <View
                style={{
                  flexDirection: 'row',
                  //backgroundColor: 'blue',
                }}>
                {this.hasChildren(item) &&
                  item.children.map((child, index) => {
                    const {name, profile} = child;
                    const info = {name, profile};
                    return (
                      <View
                        key={child.name + child.spouse}
                        style={{
                          flexDirection: 'row',
                        }}>
                        <View>
                          <Svg height="50" width="100%">
                            <Line
                              x1="50%"
                              y1="0"
                              x2="50%"
                              y2="100%"
                              stroke={this.props.pathColor}
                              strokeWidth={this.props.strokeWidth}
                            />
                            {/* Right side horizontal line */}
                            {this.hasChildren(item) &&
                              item.children.length !== 1 &&
                              item.children.length - 1 !== index && (
                                <Line
                                  x1="100%"
                                  y1={this.props.strokeWidth / 2}
                                  x2="50%"
                                  y2={this.props.strokeWidth / 2}
                                  stroke={this.props.pathColor}
                                  strokeWidth={this.props.strokeWidth}
                                />
                              )}
                            {/* Left side horizontal line */}
                            {this.hasChildren(item) &&
                              item.children.length !== 1 &&
                              index !== 0 && (
                                <Line
                                  x1="50%"
                                  y1={this.props.strokeWidth / 2}
                                  x2="0"
                                  y2={this.props.strokeWidth / 2}
                                  stroke={this.props.pathColor}
                                  strokeWidth={this.props.strokeWidth}
                                />
                              )}
                          </Svg>
                          {this.renderTree([child], level + 1)}
                        </View>
                        {}
                        <View
                          style={{
                            height: this.props.strokeWidth,
                            backgroundColor:
                              this.hasChildren(item) &&
                              item.children.length - 1 !== index
                                ? this.props.pathColor
                                : 'transparent',
                            width:
                              this.hasChildren(child) &&
                              child.children.length - 1 !== index
                                ? level * this.props.familyGap
                                : 0,
                          }}
                        />
                      </View>
                    );
                  })}
              </View>
            </View>
          );
        }}
      />
    );
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.titleGr}>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('DisplayGenealogy')
                }>
                <Image
                  style={{
                    height: 40,
                    width: 40,
                    top: 2,
                  }}
                  source={require('../../images/icons8-back-to-100.png')}
                />
              </TouchableOpacity>
              <Text style={styles.title}>Tên gia phả</Text>
            </View>
            <View style={styles.Genealogy}>
              {this.renderTree(this.props.data, 1)}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEECEF',
  },
  Genealogy: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEECEF',
  },
  titleGr: {
    height: 60,
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#FBBD00',
    paddingStart: 20,
  },
  title: {
    color: 'black',
    fontSize: 23,
    fontWeight: 'bold',
    left: 15,
  },
});
GenealogyScreen.defaultProps = {
  title: 'My Family Tree',
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleColor: 'black',
  data: Sample,
  nodeStyle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'cover',
  },
  nodeTitleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pathColor: 'black',
  siblingGap: 30,
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  nodeTitleColor: 'black',
  familyGap: 20,
  strokeWidth: 5,
};

GenealogyScreen.propTypes = {
  title: PropTypes.string,
  titleStyle: PropTypes.object,
  data: PropTypes.array,
  nodeStyle: PropTypes.object,
  nodeTitleStyle: PropTypes.object,
  pathColor: PropTypes.string,
  siblingGap: PropTypes.number,
  imageStyle: PropTypes.object,
  nodeTitleColor: PropTypes.string,
  familyGap: PropTypes.number,
  strokeWidth: PropTypes.number,
  titleColor: PropTypes.string,
};
