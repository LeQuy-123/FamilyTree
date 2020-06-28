/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import moment from 'moment';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  AsyncStorage,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import url from '../../components/MainURL';
import _RefreshToken from '../../components/refresh_Token';
LocaleConfig.locales.fr = {
  monthNames: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
  monthNamesShort: [
    'Janv.',
    'Févr.',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juil.',
    'Août',
    'Sept.',
    'Oct.',
    'Nov.',
    'Déc.',
  ],
  dayNames: [
    'Dimanche',
    'Lundi',
    'Mardi',
    'Mercredi',
    'Jeudi',
    'Vendredi',
    'Samedi',
  ],
  dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  today: "Aujourd'hui",
};
LocaleConfig.defaultLocale = 'fr';
export default class EventScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshToken: '',
      email: '',
      selectedDate: '',
      markedDates: {},
      markedDate: moment(new Date()).format('YYYY-MM-DD'),
      current: '',
      day: '',
      id: '',
      dataEvent: [],
      newDataEvent: [],
      newDataEvent1: [],
    };
  }
  setMarkedDates(key) {
    this.setState({day: key});
    let markedDates = {};
    if (typeof this.state.markedDates[key] !== 'undefined') {
      markedDates = {
        [key]: {
          selected: !this.state.markedDates[key].selected,
        },
      };
    } else {
      markedDates = {[key]: {selected: true}};
    }

    this.setState(prevState => {
      return {...prevState, markedDates};
    });
  }

  createEvent = async day => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    if (day) {
      _RefreshToken(userEmail, refreshToken).then(data => {
        var URL = url + '/api/user/event';
        try {
          fetch(URL, {
            method: 'POST',
            headers: {
              Authorization: 'Bearer ' + data,
            },
          })
            .then(response => response.json())
            .then(json => {
              this.setState({
                id: json.event._id,
              });

              this.props.navigation.navigate('AddEvent', {
                date: day,
                id: this.state.id,
              });
            });
        } catch (error) {
          console.error(error);
        }
      });
    }
  };
  loadEvent = async () => {
    let accessToken = await AsyncStorage.getItem('accessToken');
    var URL = url + '/api/user/eventshow';
    if (accessToken === null) {
      this.props.navigation.navigate('Login');
    } else {
      try {
        fetch(URL, {
          method: 'GET',
          headers: {
            Authorization: 'Bearer ' + accessToken,
          },
        })
          .then(response => response.json())
          .then(json => {
            this.setState({
              dataEvent: json.event,
            });
            console.log(json.event);
          })
          .catch(error => console.log(error));
      } catch (error) {
        console.error(error);
      }
    }
  };
  checkEvent(day) {
    return moment(day, 'YYYYMMDD').isBetween(
      moment(this.state.markedDate).subtract(1, 'days'),
      moment(this.state.markedDate).add(4, 'days'),
    );
  }
  loadOneEvent = async id => {
    _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
      var URL = url + '/api/user/eventshowone';
      if (data === null) {
        this.props.navigation.navigate('Login');
      } else {
        this.props.navigation.navigate('AddEvent', {id: id});
        console.log('Loading 1 event' + id);
      }
    });
  };

  componentDidMount() {
    this.getData();
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadEvent();
    });
  }
  async getData() {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
  }
  _deleteEvent = async id => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let email = await AsyncStorage.getItem('email');
    _RefreshToken(email, refreshToken).then(data => {
      var URL = url + '/api/user/destroyevent';
      if (data === null) {
        console.log('ko the refresh token do token het han');
      } else {
        try {
          fetch(URL, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              Authorization: 'Bearer ' + data,
            },
            body: JSON.stringify({
              id: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              console.log(json.message);
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
      dataEvent: this.state.dataEvent.filter(x => x._id !== id),
    });
  };
  _renderItem = ({item}) => (
    <View style={styles.listContainer}>
      <View style={styles.item}>
        <Text style={styles.titleItem}>
          {item.time} - {item.date} - {item.bio}
        </Text>
        <Text style={styles.titleItem}>{item.event}</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          flexDirection: 'row',
        }}>
        <TouchableOpacity
          style={{padding: 15}}
          onPress={() => this.loadOneEvent(item._id)}>
          <Image
            style={{height: 30, width: 30}}
            source={require('../../images/icons8-event-accepted-30.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => this._deleteEvent(item._id)}>
          <Image
            style={{height: 30, width: 30}}
            source={require('../../images/icons8-delete-view-24.png')}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
  render() {
    const event = this.state.dataEvent.filter(x => this.checkEvent(x.date));
    const newEvent = this.state.dataEvent.filter(x => !this.checkEvent(x.date));
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.titleView}>
            <Text style={styles.title}>SỰ KIỆN </Text>
            <TouchableOpacity
              onPress={() => {
                if (this.state.day) {
                  this.createEvent(this.state.day);
                }
              }}>
              <Image
                style={{top: 5}}
                source={require('../../images/icons8-add-40.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.eventView}>
            {this.state.dataEvent.length !== 0 ? (
              <View>
                <View>
                  <Text style={styles.titleEvent}>Sự kiện săp sảy ra</Text>
                  <Text style={{fontSize: 16, left: 10}}>
                    {this.state.markedDate}
                  </Text>
                  <FlatList
                    style={styles.eventList}
                    data={event}
                    renderItem={this._renderItem}
                    keyExtractor={item => item._id}
                    extraData={event}
                  />
                </View>
                <View>
                  <Text style={styles.titleEvent}>Các sự kiện khác</Text>
                  <FlatList
                    style={styles.eventList}
                    data={newEvent}
                    renderItem={this._renderItem}
                    keyExtractor={item => item._id}
                    extraData={newEvent}
                  />
                </View>
              </View>
            ) : (
              <View style={{paddingVertical: 30, alignItems: 'center'}}>
                <Image
                  style={{
                    height: '65%',
                    width: '85%',
                  }}
                  source={require('../../images/2989972.jpg')}
                />
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 18,
                    fontFamily: 'serif',
                  }}>
                  Đây là nơi ghi chép các sự kiện, hội họp, đám cưới, đám chay,
                  giỗ chạp của gia đình mình cần ghi nhờ.
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    this.createEvent(this.state.markedDate);
                  }}
                  style={styles.buttonContainer}>
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
                    Tạo sự kiện
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.backGround}>
            <Calendar
              style={{width: '80%', height: 255}}
              theme={{
                calendarBackground: '#AEECEF',
                textSectionTitleColor: 'black',
                selectedDayBackgroundColor: '#FBBD00',
                selectedDayTextColor: 'black',
                todayTextColor: '#00adf5',
                dayTextColor: '#2d4150',
                textDisabledColor: '#d9e1e8',
                dotColor: 'red',
                selectedDotColor: 'red',
                arrowColor: 'black',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: 'black',
                textDayFontWeight: 'bold',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: 'bold',
                textDayFontSize: 13,
                textMonthFontSize: 15,
                textDayHeaderFontSize: 15,
              }}
              onMonthChange={month => {
                console.log('month changed', month);
              }}
              current={this.state.current}
              markedDates={this.state.markedDates}
              onDayPress={day => {
                this.setMarkedDates(day.dateString);
              }}
              markingType={'multi-dot'}
              monthFormat={'yyyy-MM'}
              showSixWeeks={true}
            />
          </View>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00B2BF',
    height: '100%',
    justifyContent: 'flex-end',
  },
  backGround: {
    backgroundColor: '#AEECEF',
    alignItems: 'center',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  eventView: {
    height: '55%',
    bottom: 15,
    borderRadius: 30,
    backgroundColor: '#FBBD00',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  titleEvent: {
    padding: 5,
    fontFamily: 'serif',
    fontWeight: 'bold',
    fontSize: 18,
  },
  eventList: {
    backgroundColor: 'white',
    height: '38%',
    borderRadius: 20,
  },
  titleView: {
    flex: 1,
    top: 9,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 20,
  },
  title: {
    fontSize: 35,
    fontFamily: 'serif',
    paddingStart: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  item: {
    padding: 3,
    marginVertical: 8,
    marginHorizontal: 16,
    borderLeftWidth: 2,
    borderLeftColor: 'red',
  },
  titleItem: {
    fontSize: 15,
  },
  listContainer: {
    paddingEnd: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    top: 5,
  },
  buttonContainer: {
    width: '60%',
    flexDirection: 'row',
    height: '13%',
    top: 20,
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
});
