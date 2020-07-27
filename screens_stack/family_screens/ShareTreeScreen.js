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

export default class ShareTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      email: '',
      accessToken: '',
      data: '',
    };
  }
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
              this.props.navigation.navigate('ViewTree', {
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
        </View>
      </View>
    </View>
  );
  loadShareTree = async id => {
    var URL = url + '/api/user/publictree';
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    console.log(id);
    _RefreshToken(userEmail, refreshToken).then(data => {
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userId: id,
            }),
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
  componentDidMount() {
    this.loadShareTree(this.props.route.params.id);
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
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <Image
                style={{
                  height: 50,
                  width: 50,
                  borderRadius: 30,
                  borderColor: 'white',
                  borderWidth: 2,
                }}
                source={require('../../images/icons8-go-back-80.png')}
              />
            </TouchableOpacity>
            <Text style={styles.title}> CHIA SẺ GIA PHẢ</Text>
          </View>
          <View style={styles.listGenealogyBackground}>
            <Text style={styles.titleList}>Danh sách gia phả được chia sẻ</Text>
            {this.state.data.length === 0 ? (
              <View style={styles.listGenealogy}>
                <Image
                  style={{height: 320, width: 320, bottom: 10}}
                  source={require('../../images/pngguru.com.png')}
                />
                <Text style={styles.textWithoutGenealogy}>
                  Bạn chưa có gia phả nào được chia sẻ, hãy mời người thân sử
                  dụng ứng dụng này và chia sẻ nào
                </Text>
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
