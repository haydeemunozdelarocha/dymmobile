import React from 'react';
import t from 'tcomb-form-native';
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
} from 'react-native';
import Captura from './Captura';

const Form = t.form.Form;
const options = {
  fields: {
    camion_id:{
      autoFocus: true
    }
  }
};

export default class Scan extends React.Component {
  state = {
    options: options,
    value: null,
    camion: null
  };

  getForm() {
    var form = t.struct({
      camion_id: t.String
    });

    return form;
  }

  submit() {
    let value = this.refs.form.getValue();

    if (value.camion_id) {
      fetch(`https://dymingenieros.herokuapp.com/api/camiones/buscar/${value.camion_id}`, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((responseData) => {
        if (responseData.length === 0) {
          AlertIOS.alert(
            'Número de camión inválido',
            'Por favor inténtelo de nuevo'
          );
        }

        return this.handleResponse(responseData[0])
      }).catch(function(err){
        console.log(err);
      })
    }
  }

  handleResponse(response) {
    if (response) {
      this.props.navigator.push({
        title: 'Captura',
        component: Captura,
        passProps: { camion_id: response.numero }
      });
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <Form
              ref="form"
              type={this.getForm(this.state)}
              options={this.state.options}
              onChange={this.onChange.bind(this)}
              value={this.state.value}
          />
          <TouchableHighlight style={styles.button} onPress={this.submit.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Buscar Camión</Text>
          </TouchableHighlight>
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height:1000,
    justifyContent: 'center',
    marginTop: 10,
    padding: 10,
    backgroundColor: '#ffffff',
  },
  row:{
    flex:1
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
    alignSelf: 'stretch',
    justifyContent: 'center'
  },
  scrollView: {
    backgroundColor: 'gray'
  }
});
