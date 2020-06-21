/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
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
      current: '',
      currentDate: '',
      nextDate: '',
      day: '',
      id: '',
      dataEvent: [],
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

  createEvent = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    let userEmail = await AsyncStorage.getItem('email');
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
            if (this.state.day) {
              this.props.navigation.navigate('AddEvent', {
                date: this.state.day,
                id: this.state.id,
              });
            }
            console.log('id :' + this.state.id);
          });
      } catch (error) {
        console.error(error);
      }
    });
  };
  loadEvent = async () => {
    let refreshToken = await AsyncStorage.getItem('tokenRefresh');
    console.log('Loading event');
    let userEmail = await AsyncStorage.getItem('email');
    this.setState({
      refreshToken: refreshToken,
      email: userEmail,
    });
    _RefreshToken(userEmail, refreshToken).then(data => {
      var URL = url + '/api/user/eventshow';
      if (data === null) {
        console.log('ko the refresh token do token het han');
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
                dataEvent: json.event,
              });
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };
  loadOneEvent = async id => {
    console.log('Loading 1 event');
    console.log('id: ' + id);
    _RefreshToken(this.state.email, this.state.refreshToken).then(data => {
      var URL = url + '/api/user/eventshowone';
      if (data === null) {
        console.log('ko the refresh token do token het han');
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
              id: id,
            }),
          })
            .then(response => response.json())
            .then(json => {
              this.props.navigation.navigate('AddEvent', {
                date: json.event.date,
                id: id,
                address: json.event.address,
                bio: json.event.bio,
                cate: json.event.catelogy,
                event: json.event.event,
                eventImage: json.event.eventImage,
                time: json.event.time,
                onGoBack: this.loadEvent,
              });
              this.setState({
                event: json.event,
              });
              console.log('event: ' + this.state.event.id);
            })
            .catch(error => console.log(error));
        } catch (error) {
          console.error(error);
        }
      }
    });
  };

  componentDidMount() {
    this.getDate();
    const {navigation} = this.props;
    navigation.addListener('focus', async () => {
      this.loadEvent();
    });
  }
  getDate() {
    var date = new Date().getUTCDate();
    var month = new Date().getMonth() + 1;
    var year = new Date().getFullYear();
    var current = new Date();
    var followingDay = new Date(current.getTime() + 86400000);
    var nextDate = followingDay.getUTCDate();
    if (date.toString().length === 1) {
      date = '0' + date;
    }
    if (month.toString().length === 1) {
      month = '0' + month;
    }
    if (followingDay.toString().length === 1) {
      followingDay = '0' + followingDay;
    }
    this.setState({
      currentDate: year + '-' + month + '-' + date,
      nextDate: year + '-' + month + '-' + nextDate,
    });
    console.log(this.state.nextDate);
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
    console.log('id bi xoa: ' + id);
    this.setState({
      dataEvent: this.state.dataEvent.filter(x => x._id !== id),
    });
    console.log(this.state.dataEvent);
  };
  _renderItem = ({item}) => (
    <View style={styles.listContainer}>
      <View style={styles.item}>
        <Text style={styles.titleItem}>
          {item.time} - {item.bio}
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
          onPress={() => {
            this.loadOneEvent(item._id);
            console.log(item._id);
          }}>
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
    const todayEvent = this.state.dataEvent.filter(
      x => x.date === this.state.currentDate,
    );
    const nextDayEvent = this.state.dataEvent.filter(
      x => x.date === this.state.nextDate,
    );
    return (
      <SafeAreaView>
        <View style={styles.container}>
          <View style={styles.titleView}>
            <Text style={styles.title}>SỰ KIỆN </Text>
            <TouchableOpacity onPress={() => this.createEvent()}>
              <Image
                style={{top: 5}}
                source={require('../../images/icons8-add-40.png')}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.eventView}>
            <Text style={styles.titleEvent}>Sự kiện hôm nay</Text>
            <Text style={{fontSize: 15, left: 10}}>
              {this.state.currentDate}
            </Text>
            <View style={styles.eventList}>
              <FlatList
                data={todayEvent}
                renderItem={this._renderItem}
                keyExtractor={item => item._id}
                extraData={this.state.dataEvent}
              />
            </View>
            <Text style={styles.titleEvent}>Sự kiện sắp diễn ra</Text>
            <Text style={{fontSize: 15, left: 10}}>{this.state.nextDate}</Text>
            <View
              style={{
                height: '35%',
                width: '95%',
                left: 20,
                borderLeftWidth: 2,
              }}>
              <FlatList
                data={nextDayEvent}
                renderItem={this._renderItem}
                keyExtractor={item => item._id}
                extraData={this.state.dataEvent}
              />
            </View>
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
              onDayPress={day => this.setMarkedDates(day.dateString)}
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
    height: '37%',
    borderRadius: 20,
    justifyContent: 'center',
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
});
