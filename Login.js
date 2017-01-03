var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

var Captura = require('./Captura');

import {
  AppRegistry,
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image
} from 'react-native';
getProveedores();
var USERNAME = 'id_username';

var Form = t.form.Form;

var Person = t.struct({
  username: t.String,
  password: t.String
});

const Proveedores = {};
const options = {
  fields: {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false
    },
    password: {
      autoCapitalize: 'none',
      password: true,
      autoCorrect: false
    }
  }
}
function getProveedores() {
       fetch("http://localhost:3000/api/proveedores", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData)
        for (var i = 0; i < responseData.length; i ++){
          Proveedores[responseData[i].id] = responseData[i].razon_social;
        }
              console.log(Proveedores)
      })
}
class Login extends React.Component {

  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  async _userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      AlertIOS.alert("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

_handleResponse(response) {
  console.log('handling response')
  console.log(response)
  if (response.username) {
    console.log('sending component')
    this.props.navigator.push({
      title: 'Captura',
      component: Captura,
      passProps: {username: response.username, proveedores: Proveedores}
    });
  } else {
    this.setState({ message: 'Wrong username or password.'});
  }
}
  _userLogin() {
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      fetch("http://localhost:3000/api/auth/signin", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: value.username,
          password: value.password
        })
      })
      .then((response) => response.json())
      .then((responseData) => this._handleResponse(responseData))
  .catch(error =>
     this.setState({
      isLoading: false,
      message: 'Something bad happened ' + error
   }))
      .done();
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
        <Image source={require('./Resources/dym-logo.png')} style={styles.image}/>
        </View>
        <View style={styles.row}>
          <Form
            ref="form"
            type={Person}
            options={options}
          />
        </View>
        <View style={styles.row}>
          <TouchableHighlight style={styles.button} onPress={this._userLogin.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 50,
    padding: 20,
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 30,
    alignSelf: 'center',
    marginBottom: 30
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
    alignSelf: 'center'
  },
  button: {
    height: 36,
    backgroundColor: '#48BBEC',
    borderColor: '#48BBEC',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
image: {
  height: 84
}
});

module.exports = Login;
