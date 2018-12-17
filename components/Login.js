import React from 'react';
import t from 'tcomb-form-native';
import Scan from  './Scan';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image
} from 'react-native';

const Form = t.form.Form;

const User = t.struct({
  username: t.String,
  password: t.String
});

const options = {
  fields: {
    username: {
      autoCapitalize: 'none',
      autoCorrect: false,
    },
    password: {
      autoCapitalize: 'none',
      password: true,
      autoCorrect: false,
      secureTextEntry: true
    }
  }
};

export default class Login extends React.Component {
  async _onValueChange(item, selectedValue) {
    try {
      await AsyncStorage.setItem(item, selectedValue);
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }

  _handleResponse(response) {
    this._onValueChange('@User', response.username);
    this._onValueChange('@Password', response.password);

    if (response.username) {
      this.props.navigator.push({
        title: 'Scan',
        component: Scan,
        passProps: {username: response.username}
      });
    } else {
      this.setState({ message: 'Wrong username or password.'});
    }
  }

  _userLogin() {
    console.log(this.refs.form);
    let userInput = this.refs.form.getValue();

    if (userInput) {
      fetch("https://dymingenieros.herokuapp.com/api/auth/signin", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: userInput.username,
          password: userInput.password
        })
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log('response', responseData);
        this._handleResponse(responseData);
      })
      .catch(error =>
        this.setState({
          isLoading: false,
          message: 'Something bad happened ' + error
        }))
      .done()
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <View style={styles.row}>
            <Image source={require('../assets/dym-logo.png')} style={styles.image}/>
          </View>
          <View style={styles.row}>
            <Form
                ref="form"
                type={User}
                options={options}
                value={{
                  username: 'jane@dym.com',
                  password: 'hello123'
                }}
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

const styles = StyleSheet.create({
  container: {
    flex:1,
    justifyContent: 'center',
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
    height: 84,
    alignSelf: 'center',
    marginBottom: 30
  }
});
