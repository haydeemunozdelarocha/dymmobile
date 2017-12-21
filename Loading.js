var React = require('react');
var ReactNative = require('react-native');


import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image,
  NetInfo
} from 'react-native';

import Scan from './Scan';
import Login from './Login';

const connected = null;

class Loading extends React.Component {

  state = {
    connected: null
    };

  componentWillMount(){
  console.log('mounting');
  this.getWIFI();
  this.loggedIn();
}
getWIFI(){
NetInfo.isConnected.fetch().then(isConnected => {
  console.log('First, is ' + (isConnected ? 'online' : 'offline'));
});
function handleFirstConnectivityChange(isConnected) {
  console.log('Then, is ' + (isConnected ? 'online' : 'offline'));
  NetInfo.isConnected.removeEventListener(
    'change',
    handleFirstConnectivityChange
  );
}
NetInfo.isConnected.addEventListener(
  'change',
  handleFirstConnectivityChange
);
NetInfo.fetch().done((reach) => {
  console.log('Initial: ' + reach);
});
function handleFirstConnectivityChangeReach(reach) {
  console.log('First change: ' + reach);
  if (reach === "none"){
        AlertIOS.alert(
           'No hay conexión de internet',
           'Por favor inténtelo de nuevo'
          );
        connected ='no';
  } else {
    connected ='yes';
  }
  NetInfo.removeEventListener(
    'change',
    handleFirstConnectivityChangeReach
  );
}

NetInfo.addEventListener(
  'change',
  handleFirstConnectivityChangeReach
);
}

loggedIn(){
console.log('logged in?');
 fetch("https://dymingenieros.herokuapp.com/api/auth/session", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (!responseData.session){
         return this.handleResponse('Login', null)
        }
        else if(responseData.session){
          return this.handleResponse('Scan', responseData.session)
        }
      }).catch(function(err){
        console.log(err);
      })
}
handleResponse(view,session) {
  console.log('handling response')
  if (view === 'Scan') {
    this.props.navigator.push({
      title: 'Scan',
      component: Scan,
      passProps: {session: session, connection: connected}
    });
  } else if (view === 'Login'){
    this.props.navigator.push({
      title: 'Login',
      component: Login,
      passProps: {connection: connected}
    });
  }
}

  render() {
    return (
        <View>
            <Text>Loading...</Text>
      </View>
    );
  }
}

module.exports = Loading;
