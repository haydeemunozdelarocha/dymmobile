var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image
} from 'react-native';
import Captura from './Captura';

var Form = t.form.Form;
var camion_id;

var options = {
  fields: {
    camion_id:{
      autoFocus: true
  }
}
}


var styles = StyleSheet.create({
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


class Scan extends React.Component {
state = {
      options: options,
      value: null,
      camion: null
    };

componentWillMount(){
  console.log('mounting')

}

getForm(state) {
  console.log('geting form');
  var form = t.struct({
          camion_id: t.String
    });

    return(form);
}

  onChange(value) {
    // tcomb immutability helpers
    // https://github.com/gcanti/tcomb/blob/master/GUIDE.md#updating-immutable-instances

}

submit() {
    var value = this.refs.form.getValue();
    console.log(value)
    if (value.camion_id) { // if validation fails, value will be null
      fetch("https://dymingenieros.herokuapp.com/api/camiones/buscar/"+value.camion_id, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      })
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData);
        if (responseData.length === 0){
          AlertIOS.alert(
           'Número de camión inválido',
           'Por favor inténtelo de nuevo'
          );
        }
        this.handleResponse(responseData[0])
      }).catch(function(err){
        console.log(err);
      })
}
}

handleResponse(response) {
  console.log('handling response')
  console.log("numero: "+response.numero)
  if (response) {
    console.log('sending component')
    this.props.navigator.push({
      title: 'Captura',
      component: Captura,
      passProps: {camion_id: response.numero}
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

module.exports = Scan;
