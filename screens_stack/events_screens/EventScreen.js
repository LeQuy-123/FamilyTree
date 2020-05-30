/* eslint-disable react-native/no-inline-styles */
import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';

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
      selectedDate: '',
      markedDates: {},
      current: '',
      day: '',
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
  AddEvent() {
    if (this.state.day) {
      this.props.navigation.navigate('AddEvent', {date: this.state.day});
    }
    console.log(this.state.day);
  }
  render() {
    return (
      <SafeAreaView>
        <ScrollView>
          <View style={styles.container}>
            <View style={styles.titleView}>
              <Text style={styles.title}>SỰ KIỆN </Text>
              <TouchableOpacity onPress={() => this.AddEvent()}>
                <Image
                  style={{top: 5}}
                  source={require('./icon/icons8-add-40.png')}
                />
              </TouchableOpacity>
            </View>
            <View style={styles.eventView} />
            <View style={styles.backGround}>
              <Calendar
                style={{width: '76%'}}
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
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00B2BF',
    height: 700,
    justifyContent: 'flex-end',
  },
  backGround: {
    backgroundColor: '#AEECEF',
    alignItems: 'center',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  eventView: {
    height: '45%',
    bottom: 30,
    borderRadius: 40,
    backgroundColor: '#FBBD00',
  },
  titleView: {
    bottom: 40,
    //flex: 1,
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
});
