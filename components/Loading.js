import React from 'react';
import {
  Text,
  View,
  AlertIOS,
  NetInfo
} from 'react-native';

import Scan from './Scan';
import Login from './Login';

let connected = null;

export class Loading extends React.Component {
  componentWillMount() {
    this.getWIFI();
    this.loggedIn();
  }

  getWIFI() {
    function handleFirstConnectivityChange() {
      NetInfo.isConnected.removeEventListener('change', handleFirstConnectivityChange);
    }

    NetInfo.isConnected.addEventListener('change', handleFirstConnectivityChange);

    function handleFirstConnectivityChangeReach(reach) {
      if (reach === "none") {
        AlertIOS.alert(
            'No hay conexión de internet',
            'Por favor inténtelo de nuevo'
        );
        connected = false;
      } else {
        connected = true;
      }

      NetInfo.removeEventListener('change', handleFirstConnectivityChangeReach);
    }

    NetInfo.addEventListener('change', handleFirstConnectivityChangeReach);
  }

  loggedIn() {
    fetch("https://dymingenieros.herokuapp.com/api/auth/session", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      if (!responseData.session) {
        return this.handleResponse('Login', null)
      }
      else if (responseData.session) {
        return this.handleResponse('Scan', responseData.session)
      }
    }).catch(function(err){
      console.log(err);
    })
  }

  handleResponse(view,session) {
    if (view === 'Scan') {
      this.props.navigator.push({
        title: 'Scan',
        component: Scan,
        passProps: {session: session, connection: connected}
      });
    } else if (view === 'Login') {
      this.props.navigator.push({
        title: 'Login',
        component: Login,
        passProps: { connection: connected }
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
