/* eslint-disable no-shadow */
/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import Modal from 'react-native-modal';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Image,
  AsyncStorage,
  FlatList,
  ScrollView,
} from 'react-native';
import PropTypes from 'prop-types';
import Svg, {Line} from 'react-native-svg';
import _RefreshToken from '../../components/refresh_Token';
import url from '../../components/MainURL';
import {FloatingAction} from 'react-native-floating-action';

const actions = [
  {
    text: 'Chú thích',
    icon: require('../../images/icons8-add-40.png'),
    name: 'bt_note',
    position: 2,
  },
  {
    text: 'Thêm node cha cho Root',
    icon: require('../../images/icons8-add-40.png'),
    name: 'bt_addRootParent',
    position: 1,
  },
];
var chosenId = '';
var name = '';

export default class GenealogyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageModal: '',
      isModalVisible: false,
      choiceModalVisible: false,
      noteModalVisible: false,
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
  checkRoot(id) {
    for (var i = 0; i < this.state.data.length; i++) {
      if (this.state.data[i].parentId === id) {
        return false;
      }
    }
    return true;
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  toggleChoiceModal = () => {
    this.setState({
      choiceModalVisible: !this.state.choiceModalVisible,
    });
  };
  toggleNoteModal = () => {
    this.setState({
      noteModalVisible: !this.state.noteModalVisible,
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
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadAllLeaf(this.props.route.params.data);
    });
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
              var newItem = JSON.parse(JSON.stringify(data)); // clone
              var tree = this.list_to_tree(newItem);
              this.setState({
                data: data,
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
  _renderNode = ({item}) => (
    <View
      style={
        item.sex === 'Nam' ? styles.nodeMaleStyle : styles.nodeFemaleStyle
      }>
      <TouchableOpacity
        onPress={() => {
          this.loadOneLeaf(item._id);
        }}>
        {item.profileImage ? (
          <Image
            style={styles.imageStyle}
            source={{
              uri: item.profileImage,
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
        {item.firstname} {item.lastname}
      </Text>
    </View>
  );
  renderTree(data, level) {
    return (
      <ScrollView showsHorizontalScrollIndicator={false}>
        <View>
          <FlatList
            showsHorizontalScrollIndicator={false}
            data={data}
            horizontal={true}
            contentContainerStyle={{padding: 50}}
            keyExtractor={item => item._id}
            listKey={item => item._id}
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
                    <View
                      style={{
                        backgroundColor: 'white',
                        borderColor: 'red',
                        borderRadius: 20,
                        width: 9,
                        height: 9,
                        borderWidth: 0.8,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          ...this.props.nodeTitleStyle,
                          textAlign: 'center',
                        }}>
                        {item.rank}
                      </Text>
                    </View>
                    <View
                      style={
                        item.sex === 'Nam'
                          ? styles.mainNodeMaleStyle
                          : styles.mainNodeFeMaleStyle
                      }>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          right: 3,
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            this.loadOneLeaf(item._id);
                          }}>
                          {info.profileImage ? (
                            <Image
                              style={styles.mainImageStyle}
                              source={{
                                uri: info.profileImage,
                              }}
                            />
                          ) : (
                            <Image
                              style={styles.mainImageStyle}
                              source={require('../../images/icons8-user-96.png')}
                            />
                          )}
                        </TouchableOpacity>
                      </View>
                      <Text
                        style={{
                          ...this.props.nodeTitleStyle,
                          textAlign: 'center',
                          color: this.props.nodeTitleColor,
                        }}>
                        {info.firstname} {info.lastname}
                      </Text>
                      <TouchableOpacity
                        style={{
                          right: 0,
                        }}
                        onPress={() => {
                          chosenId = item._id;
                          name = info.firstname + ' ' + info.lastname;
                          this.toggleChoiceModal();
                        }}>
                        <Image
                          style={{width: 8, height: 8, bottom: 1}}
                          source={require('../../images/icons8-add-40.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    {this.findSpouse(info._id).length > 0 && (
                      <FlatList
                        style={{flexDirection: 'row'}}
                        horizontal={true}
                        keyExtractor={item => item._id}
                        data={this.findSpouse(info._id)}
                        renderItem={this._renderNode}
                      />
                    )}
                  </View>
                  {this.hasChildren(item) && (
                    <Svg height="12" width="100%">
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
                              <Svg height="6" width="100%">
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
        </View>
      </ScrollView>
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
  choiceModal() {
    return (
      <Modal
        backdropOpacity={0.6}
        coverScreen={false}
        isVisible={this.state.choiceModalVisible}
        onSwipeComplete={this.toggleChoiceModal}
        onBackButtonPress={this.toggleChoiceModal}
        swipeThreshold={200}
        swipeDirection={['left', 'right', 'down']}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: 250,
            height: 130,
            borderRadius: 30,
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            style={styles.btnChoiceModal}
            onPress={() => {
              this.props.navigation.navigate('FixInfoScreen', {
                leafId: chosenId,
                authId: this.props.route.params.data,
              });
              this.setState({data: [], tree: []});
              this.toggleChoiceModal();
            }}>
            <Image
              style={styles.imageChoiceModal}
              source={require('../../images/icons8-add-user-male-50.png')}
            />
            <Text style={styles.textChoiceModal}>Thêm con cho {name} </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btnChoiceModal}
            onPress={() => {
              this.props.navigation.navigate('FixNode', {
                leafId: chosenId,
                authId: this.props.route.params.data,
              });
              this.setState({data: [], tree: []});
              this.toggleChoiceModal();
            }}>
            <Image
              style={styles.imageChoiceModal}
              source={require('../../images/icons8-couple-50.png')}
            />
            <Text style={styles.textChoiceModal}>Thêm Vợ/Chồng cho {name}</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }
  noteModal() {
    return (
      <Modal
        backdropOpacity={0.6}
        coverScreen={false}
        isVisible={this.state.noteModalVisible}
        onSwipeComplete={this.toggleNoteModal}
        onBackButtonPress={this.toggleNoteModal}
        swipeThreshold={200}
        swipeDirection={['left', 'right', 'down']}
        style={{justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            width: '80%',
            height: '60%',
            borderRadius: 30,
            backgroundColor: 'white',
            paddingLeft: 20,
            paddingBottom: 30,
            paddingTop: 10,
            justifyContent: 'space-between',
          }}>
          <Text style={styles.title}>Chú thích</Text>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#FFCCE5',
                width: 48,
                height: 64,
                borderRadius: 6,
              }}
            />
            <Text> : Nữ</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                backgroundColor: '#FFE014',
                width: 48,
                height: 64,
                borderRadius: 6,
              }}
            />
            <Text> : Nam</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderWidth: 1.6,
                borderColor: 'red',
                width: 48,
                height: 64,
                borderRadius: 6,
              }}
            />
            <Text> : Có quan hệ huyết thống</Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <View
              style={{
                borderWidth: 1.6,
                borderColor: 'blue',
                width: 48,
                height: 64,
                borderRadius: 6,
              }}
            />
            <Text> : Không quan hệ huyết thống</Text>
          </View>
        </View>
      </Modal>
    );
  }
  handelFloatButton(name) {
    if (name === 'bt_note') {
      this.toggleNoteModal();
    } else {
      this.props.navigation.navigate('AddParentNote', {
        childID: this.state.data[0]._id,
        authId: this.props.route.params.data,
      });
    }
  }
  render() {
    return (
      <SafeAreaView style={{flex: 1}}>
        <View style={styles.titleGr}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate('DisplayGenealogy')}>
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
        <View style={styles.container}>
          <ReactNativeZoomableView
            maxZoom={3}
            minZoom={1}
            style={{top: 400, height: '100%'}}
            zoomStep={0.5}
            initialZoom={1.5}>
            {this.renderTree(this.state.tree, 1)}
          </ReactNativeZoomableView>
        </View>
        {this.choiceModal()}
        {this.noteModal()}
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
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
                bottom: 80,
                height: '20%',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => {
                  this.props.navigation.navigate('FixInfoScreen', {
                    leafId: this.state.onShowLeafData._id,
                    isFinalLeaf: this.checkRoot(this.state.onShowLeafData._id),
                    expand: 1,
                  });
                  this.clearView();
                }}>
                <Text style={styles.modalButtonText}>Sửa/Xóa</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <FloatingAction
          actions={actions}
          onPressItem={name => {
            this.handelFloatButton(name);
          }}
        />
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
  nodeFemaleStyle: {
    backgroundColor: '#FFCCE5',
    width: 24,
    height: 34,
    borderRadius: 3,
    alignItems: 'center',
    padding: 1,
    borderWidth: 0.8,
    borderColor: '#146AFF',
    justifyContent: 'space-between',
  },
  nodeMaleStyle: {
    backgroundColor: '#FFE014',
    width: 24,
    height: 34,
    borderRadius: 3,
    alignItems: 'center',
    padding: 1,
    borderWidth: 0.8,
    borderColor: '#146AFF',
    justifyContent: 'space-between',
  },
  mainNodeMaleStyle: {
    backgroundColor: '#FFE014',
    width: 24,
    height: 34,
    borderRadius: 3,
    alignItems: 'center',
    padding: 1,
    borderWidth: 0.8,
    borderColor: 'red',
  },
  mainNodeFeMaleStyle: {
    backgroundColor: '#FFCCE5',
    width: 24,
    height: 34,
    borderRadius: 3,
    alignItems: 'center',
    padding: 1,
    borderWidth: 0.8,
    borderColor: 'red',
  },
  imageStyle: {
    width: 18,
    height: 18,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 50,
    resizeMode: 'cover',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImageStyle: {
    width: 18,
    height: 18,
    left: 3,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderColor: 'black',
    borderRadius: 10,
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
    height: '60%',
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
  textChoiceModal: {
    fontFamily: 'serif',
    fontSize: 14,
    left: 15,
  },
  imageChoiceModal: {
    left: 10,
    width: 40,
    height: 40,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
  },
  btnChoiceModal: {
    flexDirection: 'row',
    backgroundColor: '#AEECEF',
    alignItems: 'center',
    height: 50,
    width: 350,
    borderRadius: 20,
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
    fontSize: 4.5,
    fontWeight: 'bold',
  },
  pathColor: 'black',
  siblingGap: 10,
  nodeTitleColor: 'black',
  familyGap: 6,
  strokeWidth: 1,
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
