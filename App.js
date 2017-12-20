import React from 'react'
import { StyleSheet, Text, View, Vibration, Platform, FlatList, List } from 'react-native'
import { Divider } from 'react-native-elements'
import Triangle from 'react-native-triangle'
import moment from 'moment'
import _ from 'lodash'

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {}
  }

  componentDidMount() {
    this.interval = setInterval(() => this.getCurrencyPrice([
      ['bitcoin', 'USD', 'Bitcoin'],
      ['nav-coin', 'USD', 'Nav Coin']
    ]), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  componentDidUpdate(prevProps, prevState) {
    // console.log(this.state)
  }

  async getCurrencyPrice(currencies) {
    _.map(currencies, async (currency) => {
      const raw = await fetch(`https://api.coinmarketcap.com/v1/ticker/${currency[0]}/?convert=${currency[1]}`)
      const response = await raw.json()
      this.setState({
        ...this.state,
        tickers: {
          ...this.state.tickers,
          [response[0].symbol]: {
            [currency[1]]: {
              volume: response[0][`24h_volume_${currency[1].toLowerCase()}`],
              market_cap: response[0][`market_cap_${currency[1].toLowerCase()}`],
              change: {
                one_hour: response[0].percent_change_1h,
                twentyfour_hours: response[0].percent_change_24h,
                seven_days: response[0].percent_change_7d,
              },
              price: response[0][`price_${currency[1].toLowerCase()}`],
              updated: response[0].last_updated,
              base: response[0].symbol,
              target: currency[1]
            }
          }
        }
      })
    })
  }
  render() {
    return (
      <View style={styles.container}>
        {_.map(this.state.tickers, (currencyInfo, i) =>
          <View key={i}>
            <List>
              <FlatList
                data={currencyInfo}
                renderItem={({ item }) => (
                  <ListItem
                    roundAvatar
                    title={`${item.name.first} ${item.name.last}`}
                    subtitle={item.email}
                    avatar={{ uri: item.picture.thumbnail }}
                  />
                )}
              />
            </List>
          </View>
        )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
