/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Modal from 'react-native-modal';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  AsyncStorage,
  FlatList,
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, {Line} from 'react-native-svg';
import {ScrollView} from 'react-native-gesture-handler';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';

export default class GenealogyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageModal: '',
      isModalVisible: false,
      refreshToken: '',
      email: '',
      onShowLeafData: '',
      rootKey: this.props.route.params.data,
      render: true,
      data: [
        {
          key: '',
          name: '',
          image: '',
          children: [],
        },
      ],
      treeName: '',
    };
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  hasChildren(member) {
    if (member.children && member.children.length > 0) {
      return true;
    } else {
      return false;
    }
  }
  componentDidMount() {
    this.loadOneRoot(this.state.rootKey);
  }
  handelPress(key, array, newKey, newName, image) {
    var ar = {key: newKey, name: newName, image: image};
    console.log(ar);
    if (key === this.state.rootKey) {
      if (this.hasChildren(array)) {
        array.children.push(ar);
        this.setState({render: !this.state.render});
      } else {
        array.children = [ar];
        this.setState({render: !this.state.render});
      }
    } else {
      for (var i = 0; i < array.children.length; i++) {
        var array2 = array.children[i];
        if (array.children[i].key === key) {
          if (this.hasChildren(array.children[i])) {
            array.children[i].children.push(ar);
            this.setState({render: !this.state.render});
          } else {
            array.children[i].children = [ar];
            this.setState({render: !this.state.render});
          }
          return true;
        } else if (this.hasChildren(array2)) {
          this.handelPress(key, array2);
        }
      }
    }
  }
  removeItemOnce(arr, value) {
    var index = arr.findIndex(v => v.key === value);
    //console.log('index: ' + index);
    if (index > -1) {
      arr.splice(index, 1);
    }
    return arr;
  }
  // xoa node trong array
  handelPressDelete(key, array) {
    for (var i = 0; i < array.children.length; i++) {
      var array2 = array.children[i];
      if (array.children[i].key === key) {
        this.removeItemOnce(array.children, key);
        // console.log(JSON.stringify(array.children));
        // this.setState({render: !this.state.render});
        return true;
      } else if (this.hasChildren(array2)) {
        this.handelPressDelete(key, array2);
      }
    }
  }
  loadOneRoot = async id => {
    var URL = url + '/api/user/rootshowone';
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
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              rootId: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                treeName: json.root.treename,
                data: [
                  {
                    rootKey: this.props.route.params.data,
                    key: json.root._id,
                    image: json.root.profileImage,
                    name: json.root.firstname + ' ' + json.root.lastname,
                  },
                ],
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  loadOneLeaf = async id => {
    var URL = url + '/api/user/leafshowone';
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
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              leafId: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                onShowLeafData: json.leaf,
                imageModal: json.leaf.profileImage,
              });
              console.log(JSON.stringify(this.state.onShowLeafData));
              this.toggleModal();
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  createLeaf = async id => {
    var URL = url + '/api/user/leaf';
    _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              rootId: this.state.rootKey,
            }),
          })
            .then(response => response.json())
            .then(json => {
              // console.log(JSON.stringify(json.leaf._id));
              this.handelPress(
                id,
                this.state.data[0],
                json.leaf._id,
                json.leaf.fullname,
                json.leaf.profileImage,
              );
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  renderTree(data, level) {
    return (
      <FlatList
        data={data}
        horizontal={true}
        contentContainerStyle={{padding: 50}}
        keyExtractor={item => `${item.key}`}
        listKey={item => `${item.key}`}
        initialScrollIndex={0}
        renderItem={({item}) => {
          const {key, name, image} = item;
          const info = {key, name, image};
          return (
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                paddingLeft: this.props.siblingGap / 2,
                paddingRight: this.props.siblingGap / 2,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View style={styles.nodeStyle}>
                  <TouchableOpacity
                    onPress={() => {
                      if (item.key !== this.state.rootKey) {
                        this.loadOneLeaf(item.key);
                      }
                    }}>
                    {info.image ? (
                      <Image
                        style={styles.imageStyle}
                        source={{uri: info.image}}
                      />
                    ) : (
                      <Image
                        style={styles.imageStyle}
                        source={require('../../images/icons8-user-96.png')}
                      />
                    )}
                  </TouchableOpacity>
                  <Text
                    style={{
                      ...this.props.nodeTitleStyle,
                      textAlign: 'center',
                      color: this.props.nodeTitleColor,
                    }}>
                    {info.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      //this.handelPressDelete(item.key, this.state.data[0]);
                      this.createLeaf(item.key);
                      //this.handelPress(item.key, this.state.data[0]);
                    }}>
                    <Image
                      style={{width: 25, height: 25}}
                      source={require('../../images/icons8-add-40.png')}
                    />
                  </TouchableOpacity>
                </View>
              </View>
              {this.hasChildren(item) && (
                <Svg height="50" width="100">
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
                }}>
                {this.hasChildren(item) &&
                  item.children.map((child, index) => {
                    const {key} = child;
                    const info = {key};
                    return (
                      <View
                        key={info.key}
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
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
            <Text style={styles.title}>{this.state.treeName}</Text>
          </View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.Genealogy}>
              {this.renderTree(this.state.data, 1)}
            </View>
          </ScrollView>
        </View>
        <Modal
          backdropOpacity={0.6}
          coverScreen={false}
          isVisible={this.state.isModalVisible}
          onSwipeComplete={this.toggleModal}
          onBackButtonPress={this.toggleModal}
          swipeThreshold={200}
          swipeDirection={['left', 'right', 'down']}
          style={styles.view}>
          <View style={styles.modal}>
            <View>
              {this.state.imageModal ? (
                <Image
                  style={styles.bigImageModal}
                  source={{uri: this.state.imageModal}}
                />
              ) : (
                <Image
                  style={styles.bigImageModal}
                  source={require('../../images/icons8-user-96.png')}
                />
              )}
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                height: '15%',
                //backgroundColor: 'blue',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity style={styles.modalButton}>
                <Text style={styles.modalButtonText}>Xóa</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() =>
                  this.props.navigation.navigate('FixInfoScreen', {
                    leafId: this.state.onShowLeafData._id,
                  })
                }>
                <Text style={styles.modalButtonText}>Sửa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#AEECEF',
    height: '100%',
  },
  Genealogy: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
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
  nodeTitleStyle: {
    width: '150%',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  },
  nodeStyle: {
    backgroundColor: 'white',
    width: 100,
    height: 150,
    borderRadius: 10,
    alignItems: 'center',
    paddingTop: 5,
    borderWidth: 1,
    opacity: 0.8,
    borderColor: 'black',
  },
  imageStyle: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderWidth: 1,
    opacity: 0.8,
    borderColor: 'black',
    borderRadius: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '40%',
    width: '100%',
    backgroundColor: 'white',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalButton: {
    width: 160,
    height: '70%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#840505',
  },
  modalButtonText: {
    fontFamily: 'serif',
    fontSize: 20,
    color: '#840505',
  },
  bigImageModal: {
    width: 180,
    height: 180,
    borderRadius: 100,
    bottom: 90,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  },
});
GenealogyScreen.defaultProps = {
  titleStyle: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  titleColor: 'black',
  nodeTitleStyle: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  pathColor: 'black',
  siblingGap: 50,
  imageStyle: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
    resizeMode: 'cover',
  },
  nodeTitleColor: 'black',
  familyGap: 30,
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
