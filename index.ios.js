/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var React = require('react');
var ReactNative = require('react-native');

var Login = require('./Login');

var styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});

class dymcapturaApp extends React.Component {
  render() {
    return (
      <ReactNative.NavigatorIOS
        style={styles.container}
        initialRoute={{
          title: 'Login',
          component: Login
        }}/>
    );
  }
}

ReactNative.AppRegistry.registerComponent('dymcaptura', function() { return dymcapturaApp });
