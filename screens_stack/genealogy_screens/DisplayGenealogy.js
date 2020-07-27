/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import moment from 'moment';

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
import Svg, {Line} from 'react-native-svg';
import url from '../../components/MainURL';
import _RefreshToken from '../../components/refresh_Token';

export default class DisplayGenealogy extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      email: '',
      accessToken: '',
      data: '',
    };
  }
  deleteTree = async id => {
    var URL = url + '/api/user/destroytree';
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
            method: 'DELETE',
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
              this.deleteItem(id);
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  deleteItem = id => {
    this.setState({
      data: this.state.data.filter(x => x._id !== id),
    });
  };
  loadAllTree = async () => {
    var URL = url + '/api/user/authshowall';
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
            method: 'GET',
            headers: {
              Authorization: 'Bearer ' + data,
            },
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                data: json.auth,
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  ShareTree = async id => {
    var URL = url + '/api/user/sharetree';
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
            .then(json => {})
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  changeShare(id) {
    var index = this.state.data.findIndex(x => x._id === id);
    var x = this.state.data;
    x[index].isPublish = !x[index].isPublish;
    this.setState({
      data: x,
    });
  }
  reShareTree = async id => {
    var URL = url + '/api/user/resharetree';
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
            .then(json => {})
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  _renderItem = ({item}) => (
    <View style={styles.item}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingHorizontal: 10,
        }}>
        <View style={{flexDirection: 'row'}}>
          {item.profileImage ? (
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 60,
                left: 5,
              }}
              source={{uri: item.profileImage}}
            />
          ) : (
            <Image
              style={{
                height: 80,
                width: 80,
                borderRadius: 60,
                left: 5,
                borderColor: 'black',
                borderWidth: 1.5,
              }}
              source={require('../../images/icons8-user-96.png')}
            />
          )}
          <View>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: 20,
                  width: 22,
                  left: 15,
                }}
                source={require('../../images/family-tree.png')}
              />
              <Text style={{fontSize: 16, paddingLeft: 20}}>
                {item.treename}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                width: '100%',
              }}>
              <Image
                style={{
                  height: 20,
                  width: 22,
                  left: 15,
                }}
                source={require('../../images/icons8-maintenance-date-24.png')}
              />
              <Text style={{fontSize: 16, paddingLeft: 20}}>
                {moment(new Date(item.updatedAt)).format('YYYY-MM-DD')}
              </Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: 20,
                  width: 22,
                  left: 15,
                }}
                source={require('../../images/icons8-contact-24.png')}
              />
              <Text style={{fontSize: 16, paddingLeft: 20}}>{item.author}</Text>
            </View>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 16, left: 15}}>
                Số lượng thành viên: {item.numMem}
              </Text>
            </View>
          </View>
        </View>
        {!item.isPublish ? (
          <TouchableOpacity
            onPress={() => {
              this.changeShare(item._id);
              this.ShareTree(item._id);
            }}>
            <Image
              style={{
                top: 20,
                height: 40,
                width: 40,
              }}
              source={require('../../images/icons8-unshare-64.png')}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => {
              this.changeShare(item._id);
              this.reShareTree(item._id);
            }}>
            <Image
              style={{
                top: 20,
                height: 40,
                width: 40,
              }}
              source={require('../../images/icons8-share-64.png')}
            />
          </TouchableOpacity>
        )}
      </View>
      <Svg height="5" width="100%">
        <Line
          x1="1%"
          y1="50%"
          x2="99%"
          y2="50%"
          stroke="black"
          strokeWidth="2"
        />
      </Svg>
      <View style={{alignItems: 'flex-end'}}>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            onPress={() => {
              this.props.navigation.navigate('Genealogy', {
                data: item._id,
                name: item.treename,
              });
            }}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: 25,
                  width: 25,
                  right: 6,
                }}
                source={require('../../images/icons8-eye-24.png')}
              />
              <Text
                style={{
                  fontSize: 15,
                  paddingRight: 20,
                }}>
                Xem
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              this.props.navigation.navigate('AddGenealogy', {
                rootId: item._id,
              })
            }>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  top: 2,
                  height: 22,
                  width: 22,
                  right: 6,
                }}
                source={require('../../images/icons8-edit-property-26.png')}
              />
              <Text
                style={{
                  fontSize: 15,
                  paddingRight: 15,
                }}>
                Sửa
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.deleteTree(item._id)}>
            <View style={{flexDirection: 'row'}}>
              <Image
                style={{
                  height: 22,
                  width: 22,
                  right: 6,
                }}
                source={require('../../images/icons8-trash-26.png')}
              />
              <Text
                style={{
                  fontSize: 15,
                  paddingRight: 15,
                }}>
                Xóa
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
  componentDidMount() {
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadAllTree();
    });
  }
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
              onPress={() =>
                this.props.navigation.navigate('AddGenealogy', {rootId: 0})
              }>
              <Image
                style={{top: 5}}
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
            {this.state.data.length === 0 ? (
              <View style={styles.listGenealogy}>
                <Image
                  style={{height: 320, width: 320, bottom: 10}}
                  source={require('../../images/pngguru.com.png')}
                />
                <Text style={styles.textWithoutGenealogy}>
                  Bạn chưa có gia phả nào, nhấn vào nút (+) để bắt đầu tạo cây
                  gia phả ngay thôi!
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate('AddGenealogy', {rootId: 0})
                  }
                  style={styles.buttonAdd}>
                  <Image
                    style={{}}
                    source={require('../../images/icons8-add-40.png')}
                  />
                  <Text
                    style={{
                      left: 30,
                      textAlign: 'center',
                      fontSize: 18,
                      fontFamily: 'serif',
                    }}>
                    Tạo gia phả
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.list}>
                <FlatList
                  style={{
                    width: '100%',
                    height: '90%',
                    left: -10,
                  }}
                  data={this.state.data}
                  renderItem={this._renderItem}
                  keyExtractor={item => item._id}
                  extraData={this.state.dataFamily}
                />
              </View>
            )}
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
  item: {
    height: 120,
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    marginVertical: 15,
    marginHorizontal: 30,
    justifyContent: 'center',
  },
  listGenealogyBackground: {
    flex: 9,
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
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
  list: {
    height: '90%',
    width: '100%',
    borderRadius: 30,
    bottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonAdd: {
    width: '60%',
    flexDirection: 'row',
    height: '9%',
    alignItems: 'center',
    borderRadius: 17,
    paddingHorizontal: 20,
    backgroundColor: '#AEECEF',
    shadowColor: 'black',
    shadowOffset: {
      width: 1,
      height: 12,
    },
    shadowOpacity: 1,
    shadowRadius: 5.0,
    elevation: 10,
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
