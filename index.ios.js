/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

var React = require('react');
var ReactNative = require('react-native');

var Loading = require('./Loading');

var styles = ReactNative.StyleSheet.create({
  container: {
    flex: 1
  }
});

class dymcapturaApp extends React.Component {

  render() {
    return (
      <ReactNative.NavigatorIOS
        navigationBarHidden = {true}
        style={styles.container}
        initialRoute={{
          title: 'Loading',
          component: Loading
        }}/>
    );
  }
}

ReactNative.AppRegistry.registerComponent('dymcaptura', function() { return dymcapturaApp });
