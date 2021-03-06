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

export default class ViewTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageModal: '',
      isModalVisible: false,
      refreshToken: '',
      email: '',
      onShowLeafData: '',
      rootKey: this.props.route.params.data,
      data: [],
      tree: [],
      spouse: [],
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
    this.loadAllLeaf(this.props.route.params.data);
  }
  list_to_tree(list) {
    var map = {},
      node,
      roots = [],
      i;
    for (i = 0; i < list.length; i += 1) {
      map[list[i]._id] = i; // initialize the map
      list[i].children = []; // initialize the children
    }

    for (i = 0; i < list.length; i += 1) {
      node = list[i];
      if (node.parentId !== this.props.route.params.data) {
        // if you have dangling branches check that map[node.parentId] exists
        list[map[node.parentId]].children.push(node);
      } else {
        roots.push(node);
      }
    }
    return roots;
  }
  loadAllLeaf = async id => {
    var URL = url + '/api/user/leafshowall';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
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
              authId: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              const data = json.leaf.filter(x => x.isSpouse === false);
              const dataSpouse = json.leaf.filter(x => x.isSpouse === true);
              var arr = this.state.data.concat(data);
              var newItem = JSON.parse(JSON.stringify(arr)); // clone i team
              var tree = this.list_to_tree(newItem);
              this.setState({
                data: arr,
                tree: tree,
                spouse: dataSpouse,
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
              this.toggleModal();
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
          const {_id, firstname, lastname, profileImage} = item;
          const info = {
            _id,
            firstname,
            lastname,
            profileImage,
          };
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
                      this.loadOneLeaf(item._id);
                    }}>
                    {info.profileImage ? (
                      <Image
                        style={styles.imageStyle}
                        source={{
                          uri: info.profileImage,
                        }}
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
                    {info.firstname} {info.lastname}
                  </Text>
                </View>
                <View style={styles.nodeStyle}>
                  {this.findSpouse(info._id).length > 0 ? (
                    <View
                      style={{flex: 1, width: '100%', alignItems: 'center'}}>
                      <Text style={{fontSize: 18}}>Vợ/Chồng</Text>
                      <FlatList
                        style={{flex: 1, width: '100%'}}
                        keyExtractor={item => item._id}
                        data={this.findSpouse(info._id)}
                        renderItem={({item}) => (
                          <TouchableOpacity
                            style={{
                              borderBottomWidth: 1,
                              borderTopWidth: 1,
                              width: '100%',
                            }}
                            key={item.key}
                            onPress={() => this.loadOneLeaf(item._id)}>
                            <Text style={{fontSize: 15}}>
                              {item.firstname} {item.lastname}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{textAlign: 'center', fontFamily: 'serif'}}>
                        Vợ/Chồng
                      </Text>
                    </View>
                  )}
                </View>
              </View>
              {this.hasChildren(item) && (
                <Svg height="30" width="100%">
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
                          <Svg height="30" width="100%">
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
  clearView() {
    this.setState({data: [], tree: []});
    this.toggleModal();
  }
  findSpouse(id) {
    const dataSpouse = this.state.spouse.filter(x => x.spouseId === id);
    return dataSpouse;
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.container}>
          <View style={styles.titleGr}>
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                style={{
                  height: 40,
                  width: 40,
                  top: 2,
                }}
                source={require('../../images/icons8-back-to-100.png')}
              />
            </TouchableOpacity>
            <Text style={styles.title}>{this.props.route.params.name}</Text>
          </View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.Genealogy} autoFocus="true">
              {this.renderTree(this.state.tree, 1)}
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
            <View style={{flexDirection: 'row', paddingHorizontal: 20}}>
              {this.state.onShowLeafData.profileImage ? (
                <Image
                  style={styles.bigImageModal}
                  source={{uri: this.state.onShowLeafData.profileImage}}
                />
              ) : (
                <Image
                  style={styles.bigImageModal}
                  source={require('../../images/icons8-user-96.png')}
                />
              )}
              <Text
                style={{
                  fontFamily: 'serif',
                  fontSize: 22,
                  fontWeight: 'bold',
                  top: 15,
                  left: 5,
                }}>
                {this.state.onShowLeafData.firstname}{' '}
                {this.state.onShowLeafData.lastname}
              </Text>
            </View>
            <View style={styles.modalInfo}>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                }}>
                <Text style={styles.modalInfoText}>Tên thường gọi</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.nickname}
                </Text>
                <Text style={styles.modalInfoText}>Ngày sinh</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.dob}
                </Text>
                <Text style={styles.modalInfoText}>Giới tính</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.sex}
                </Text>
              </View>
              <View style={{flex: 1, justifyContent: 'space-around'}}>
                <Text style={styles.modalInfoText}>Ngày mất</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.dod}
                </Text>
                <Text style={styles.modalInfoText}>Nơi yên nghỉ</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.burialplace}
                </Text>
                <Text style={styles.modalInfoText}>Địa chỉ</Text>
                <Text style={styles.modalOptionText}>
                  {this.state.onShowLeafData.domicile}
                </Text>
              </View>
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
    padding: 5,
    borderWidth: 1,
    opacity: 0.8,
    borderColor: 'black',
    justifyContent: 'space-between',
  },
  imageStyle: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    borderTopEndRadius: 30,
    borderTopStartRadius: 30,
    justifyContent: 'space-between',
    height: '45%',
    width: '100%',
    backgroundColor: 'white',
  },
  view: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalButton: {
    width: '80%',
    height: '60%',
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
    width: 140,
    height: 140,
    borderRadius: 100,
    bottom: 70,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  modalOptionText: {
    fontFamily: 'serif',
    fontSize: 16,
    left: 5,
    bottom: 5,
  },
  modalInfo: {
    height: '70%',
    bottom: 70,
    flexDirection: 'row',
    width: '100%',
    paddingLeft: 20,
  },
  modalInfoText: {
    fontFamily: 'serif',
    fontSize: 17,
    fontWeight: 'bold',
  },
});
ViewTree.defaultProps = {
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

ViewTree.propTypes = {
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
