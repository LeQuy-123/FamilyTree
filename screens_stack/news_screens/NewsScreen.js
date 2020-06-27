/* eslint-disable react-native/no-inline-styles */
import React, {PureComponent} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Image,
  TouchableOpacity,
  FlatList,
  Linking,
} from 'react-native';
import key from '../../components/APIkey';

export default class NewsScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      news1Data: [],
      news2Data: [],
    };
  }
  loadNews1 = async () => {
    var requestOptions = {
      method: 'GET',
      redirect: 'follow',
    };

    fetch(
      'https://api.breakingapi.com/news?api_key=' +
        key +
        '&type=headlines&locale=vi-VN&q=Lịch sử Việt Nam&output=json',
      requestOptions,
    )
      .then(response => response.json())
      .then(json => {
        // const news1 = json.articles.slice(1, 10);
        // const news2 = json.articles.slice(11, 20);
        // this.setState({news1Data: news1, news2Data: news2});
        console.log(json.message);
      })
      .catch(error => console.log('error', error));
  };
  componentDidMount() {
    this.loadNews1();
  }
  goTolink = link => {
    if (Linking.canOpenURL(link)) {
      Linking.openURL(link);
    }
  };
  _renderItem = ({item}) => (
    <TouchableOpacity onPress={() => this.goTolink(item.link)}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: 30,
        }}>
        {item.primary_image_link && (
          <Image
            style={{width: 200, height: 150}}
            source={{uri: item.primary_image_link}}
          />
        )}
        {!item.primary_image_link && (
          <Image
            style={{width: 200, height: 150, backgroundColor: 'blue'}}
            //source={{uri: item.primary_image_link}}
          />
        )}
        <Text
          style={{
            width: 300,
            height: 50,
            fontSize: 16,
            fontFamily: 'serif',
          }}>
          {item.title}
        </Text>
      </View>
    </TouchableOpacity>
  );
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <View>
          <View style={styles.news1}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>TIN TỨC</Text>
            </View>
            <View style={styles.tinNoiBat}>
              <Text
                style={{
                  height: 50,
                  fontSize: 16,
                  left: 15,
                  top: 4,
                  fontFamily: 'serif',
                  fontWeight: 'bold',
                }}>
                Tin nổi bật
              </Text>
              <FlatList
                style={{
                  alignSelf: 'center',
                  width: '90%',
                  bottom: 20,
                }}
                horizontal={true}
                data={this.state.news1Data}
                renderItem={this._renderItem}
                keyExtractor={item => item.title}
                extraData={this.state.news1Data}
                initialNumToRender={1}
              />
            </View>
          </View>
          <View style={styles.dongHoIcon}>
            <Text style={styles.title2}>Lịch sử các dòng họ Việt Nam</Text>
            <View style={styles.dongHoIcon2}>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/L%C3%AA_(h%E1%BB%8D)',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Lê</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/Nguy%E1%BB%85n',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Nguyễn</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/Tr%E1%BA%A7n#:~:text=Danh%20t%E1%BB%AB%20h%E1%BB%8D%20Tr%E1%BA%A7n%20b%E1%BA%AFt,th%C3%A0nh%20l%E1%BA%ADp%20qu%E1%BB%91c%20gia%20ri%C3%AAng.&text=Theo%20S%E1%BB%AD%20k%C3%BD%20T%C6%B0%20M%C3%A3,ch%E1%BB%A9%20kh%C3%B4ng%20ph%E1%BA%A3i%20h%E1%BB%8D%20H%E1%BB%93.',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Trần</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/%C4%90%E1%BB%97_(h%E1%BB%8D)',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Đỗ</Text>
              </View>
            </View>
            <View style={styles.dongHoIcon2}>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/%C4%90%C3%A0o_(h%E1%BB%8D)',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Đào</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL('https://vi.wikipedia.org/wiki/Hoàng_(họ)')
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Hoàng</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/T%C3%B4n_(h%E1%BB%8D)',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Tôn</Text>
              </View>
              <View style={styles.iconContainer}>
                <TouchableOpacity
                  onPress={() =>
                    Linking.openURL(
                      'https://vi.wikipedia.org/wiki/Phan_(họ)#:~:text=Phan%20Nhân%20Tường%20(1514-1756,sử%2C%20Tri%20thẩm%20hình%20viện.&text=Phan%20Thanh%20Giản%20(1796-1867,)%2C%20đại%20thần%20nhà%20Nguyễn.',
                    )
                  }>
                  <Image style={styles.icon} />
                </TouchableOpacity>
                <Text style={{paddingLeft: 10}}>Phan</Text>
              </View>
            </View>
          </View>
          <View style={styles.news2}>
            <Text
              style={{
                fontSize: 18,
                left: 15,
                top: 8,
                fontFamily: 'serif',
                fontWeight: 'bold',
              }}>
              Tin phổ biến
            </Text>
            <View
              style={{
                alignSelf: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                height: '80%',
                width: '92%',
                borderRadius: 25,
                backgroundColor: '#FBBD00',
              }}>
              <FlatList
                style={{
                  alignSelf: 'center',
                  width: '90%',
                }}
                horizontal={true}
                data={this.state.news2Data}
                renderItem={this._renderItem}
                keyExtractor={item => item.title}
                extraData={this.state.news2Data}
                initialNumToRender={1}
              />
            </View>
          </View>
        </View>
      </SafeAreaView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#00B2BF',
  },
  news1: {
    height: '43%',
    width: '100%',
    backgroundColor: '#00B2BF',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  dongHoIcon: {
    height: '17%',
    width: '100%',
  },
  icon: {
    width: 30,
    height: 30,
    backgroundColor: '#FBBD00',
    borderRadius: 30,
    borderWidth: 1,
    borderColor: 'white',
  },
  iconContainer: {flexDirection: 'row', alignItems: 'center', width: 100},
  dongHoIcon2: {
    height: '40%',
    width: '100%',
    flexDirection: 'row',
    //justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 60,
  },
  news2: {
    height: '40%',
    width: '100%',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    backgroundColor: '#AEECEF',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  title: {
    fontSize: 35,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    bottom: 5,
  },
  title2: {
    fontSize: 18,
    fontFamily: 'serif',
    color: 'white',
    fontWeight: 'bold',
    left: 10,
  },
  titleContainer: {
    width: '90%',
    flexDirection: 'row',
    //backgroundColor: 'blue',
  },
  tinNoiBat: {
    height: '70%',
    width: '92%',
    borderRadius: 25,
    backgroundColor: '#FBBD00',
    bottom: 10,
    //backgroundColor: 'blue',
  },
});
