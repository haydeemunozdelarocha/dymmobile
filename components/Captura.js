import React from 'react';
import t from 'tcomb-form-native';
import moment from 'moment';

import {
  StyleSheet,
  ScrollView,
  Text,
  TouchableHighlight,
  AlertIOS,
} from 'react-native';
import Recibo from './Recibo';
import { RNS3 } from 'react-native-aws3';

const Form = t.form.Form;

const formOptions = {
  fields: {
    concepto_flete: {
      maxLength: 20,
      editable: true
    },
    proveedor_id:{
      maxLength: 20,
      editable: true
    },
    material_id:{
      maxLength: 20,
      editable: true
    },
    zona_id:{
      maxLength: 20,
      editable: true
    },
    photoURL:{
      editable: false
    }
  }
};

export default class Captura extends React.Component {
  state = {
    options: formOptions,
    value: '8215259515',
    field:'',
    proveedores: {},
    materiales: {},
    zonas: {},
    camion: null
  };

  componentWillMount(){
    this.getProveedores();
    this.getZonas();
  }

  getMateriales(proveedor_id) {
    fetch(`https://dymingenieros.herokuapp.com/api/materiales/${proveedor_id}`, {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let materiales = {};
      console.log(responseData);

      for (var i = 0; i < responseData.length; i++) {
        materiales[responseData[i].id.toString()] = responseData[i].nombre_concepto;
      }
      this.setState({ materiales: materiales })
    })
  }

  getZonas() {
    fetch("https://dymingenieros.herokuapp.com/api/zonas", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let zonas = {};

      for (var i = 0; i < responseData.length; i ++){
        zonas[responseData[i].zonas_id] = responseData[i].nombre_zona;
      }
      this.setState({zonas: zonas})
    })
  }

  getProveedores() {
    fetch("https://dymingenieros.herokuapp.com/api/proveedores", {
      method: "GET",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then((response) => response.json())
    .then((responseData) => {
      let proveedores = {};

      for (let i = 0; i < responseData.length; i ++) {
        proveedores[responseData[i].id] = responseData[i].razon_social;
      }
      this.setState({proveedores: proveedores})
    })
  }

  getForm(state) {
    let form = t.struct({
      concepto_flete: t.enums({82:'Acarreo Interno', 92:'Acarreo Externo'}),
      proveedor_id: t.enums(state.proveedores),
      material_id: t.enums(state.materiales),
      zona_id: t.enums(state.zonas),
      photoURL: t.String
    });

    return(form);
  }

  onChange(value) {
    this.setState({
      value:value
    });

    if (value.concepto_flete) {
      if (value.proveedor_id && !value.material_id) {
        this.getMateriales(value.proveedor_id)
      }
    }
  }

  submit() {
    var value = this.refs.form.getValue();
    if (value) {
      fetch("https://dymingenieros.herokuapp.com/api/acarreos", {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          numero: this.props.camion_id,
          concepto_flete: Number(value.concepto_flete),
          zona_id: Number(value.zona_id),
          material_id: Number(value.material_id),
          photo: value.photoURL
        })
      })
      .then((response) => response.json())
      .then((responseData) => this.handleResponse(responseData))
      .catch(function(err) {
        console.log(err);
      })
    }
  }

  handleResponse(response) {
    if (response) {
      this.props.navigator.push({
        title: 'Recibo',
        component: Recibo,
        passProps: { recibo_id: response.recibo }
      });
    }
  }

  savePhoto(directory,filename) {
    let photo;
    let date = Date.now();
    let formattedDate = moment(date).format('DD-MM-YY-hh-mm-ss');
    const file = {
      uri:`http://10.5.5.9:8080/videos/DCIM/${directory}/${filename}`,
      name: `${formattedDate}.jpg`,
      type:'image/jpeg'
    };
    const options = {
      bucket: 'dymingenieros',
      region: 'us-east-1',
      accessKey: process.env.AWS_ACCESS_KEY_ID,
      secretKey: process.env.AWS_SECRET_ACCESS_KEY,
      successActionStatus: 201
    };

    RNS3.put(file, options).progress((e) => console.log(e.loaded / e.total)).then(response => {
      if (response.status !== 201) {
        AlertIOS.alert(
            'Error',
            'No se pudo cargar la imagen. Por favor inténtelo de nuevo'
        );
      }
      photo = response.body.postResponse.location;
    }).then(()=> {
      this.state.value.photoURL = photo;
      return this.setState(this.state);
    });
  }

  getPhoto() {
    let lastDirectory;
    let lastFile;
    fetch("http://10.5.5.9:8080/gp/gpMediaList")
      .then((response) => {
        if (response.status === 200) {
          let result = JSON.parse(response._bodyText);
          lastDirectory = result.media[result.media.length - 1];
          lastFile = lastDirectory.fs[lastDirectory.fs.length - 1];
        } else {
          return AlertIOS.alert(
            'Conexión de cámara falló',
            'Por favor inténtelo de nuevo'
          );
        }
      }).catch(error => console.log('error', error))
      .then(() => {
        if (lastDirectory) {
          return this.savePhoto(lastDirectory.d, lastFile.n);
        }
      })
  }

  takePhoto() {
    fetch("http://10.5.5.9:8080/gp/gpControl/command/mode?p=1", {
      method: "GET"
    }).then((response) => {
      if (response.status !== 200) {
        return AlertIOS.alert(
            'Cámara desconectada',
            'Por favor inténtelo de nuevo'
        );
      }
    }).then(() => {
      return fetch("http://10.5.5.9:8080/gp/gpControl/command/shutter?p=1", {
        method: "GET"
      })
    }).then((response) => {
      if (response.status !== 200){
        return AlertIOS.alert(
          'Cámara desconectada',
          'Por favor inténtelo de nuevo'
        );
      }
    }).then(() => {
      return fetch("http://10.5.5.9:8080/gp/gpControl/command/shutter?p=0", {
        method: "GET"
      })
    }).then((response) => {
      if (response.status !== 200) {
        return AlertIOS.alert(
            'Cámara desconectada',
            'Por favor inténtelo de nuevo'
        );
      }
    }).then(() => {
      return this.getPhoto();
    });

  }

  render() {
    return (
        <ScrollView style={styles.container}>
          <Form
              ref="form"
              type={this.getForm(this.state)}
              options={this.state.options}
              onChange={this.onChange.bind(this)}
              value={this.state.value}
          />
          <TouchableHighlight style={styles.button} onPress={this.takePhoto.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Photo</Text>
          </TouchableHighlight>
          <TouchableHighlight style={styles.button} onPress={this.submit.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableHighlight>
        </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 1000,
    marginTop: 20,
    padding: 10,
    backgroundColor: '#ffffff',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '80%'
  },
  row:{
    flex: 1
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
    justifyContent: 'center',
    marginBottom: 10
  },
  scrollView: {
    backgroundColor: 'gray'
  }
});
