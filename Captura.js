var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');

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

const Proveedores = {};
var Acarreo;

var Form = t.form.Form;

var styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    marginTop: 70,
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

class Captura extends React.Component {
  constructor(props) {
    super(props);
}


getForm() {
  console.log('geting form');
  var form = t.struct({
          camion_id: t.String,
          concepto_flete: t.Number,
          proveedor_id: t.enums(this.props.proveedores),
          material_id: t.Number,
          zona_id: t.Number,
          photo_url: t.String
    });
  console.log(form);
    return(form);
}

getFormOptions() {
    return({
      fields: {
        camion_id: {
          autoCapitalize: 'none',
          autoCorrect: false,
          autoFocus: true
        },
        photo_url: {
          autoCapitalize: 'none',
          password: true,
          autoCorrect: false
        }
      }
    });
}

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
        </View>
        <View style={styles.row}>
        <t.form.Form
            type={this.getForm()}
            options={this.getFormOptions()}
        />
        </View>
        <View style={styles.row}>
          <TouchableHighlight style={styles.button} onPress={this._userLogin} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Ver Ticket</Text>
          </TouchableHighlight>
        </View>
        </View>
    );
  }
}

module.exports = Captura;
