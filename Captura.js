var React = require('react');
var ReactNative = require('react-native');
var t = require('tcomb-form-native');
var moment = require('moment');

import {
  AppRegistry,
  StyleSheet,
  ScrollView,
  Text,
  View,
  TouchableHighlight,
  AlertIOS,
  Image
} from 'react-native';
import Recibo from './Recibo';
import {RNS3} from 'react-native-aws3';

var Form = t.form.Form;
var photoURL;

var options = {
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
  },photoURL:{
    editable: false
  }
}
};

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


class Captura extends React.Component {
state = {
      options: options,
      value: null,
      field:'',
      proveedores:{},
      materiales:{},
      zonas:{},
      camion:null
    };

componentWillMount(){
  console.log('mounting')
  this.getProveedores();
  this.getZonas();
}

getMateriales(proveedor_id){
  console.log('getting materiales')
       fetch("https://dymingenieros.herokuapp.com/api/materiales/"+proveedor_id, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
      .then((response) => response.json())
      .then((responseData) => {
        var materiales = {};
        for(var i = 0; i < responseData.length; i++){
          materiales[responseData[i].id.toString()] = responseData[i].nombre_concepto;
        }
        this.setState({materiales:materiales})
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
        var Zonas = {};
        for (var i = 0; i < responseData.length; i ++){
          Zonas[responseData[i].zonas_id] = responseData[i].nombre_zona;
        }
              this.setState({zonas: Zonas})
      })
}
getProveedores() {
  console.log('getting proveedores')
       fetch("https://dymingenieros.herokuapp.com/api/proveedores", {
        method: "GET",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
        })
      .then((response) => response.json())
      .then((responseData) => {
        var Proveedores={};
        for (var i = 0; i < responseData.length; i ++){
          Proveedores[responseData[i].id] = responseData[i].razon_social;
        }
              this.setState({proveedores: Proveedores})
      })
}
getForm(state) {
  console.log('geting form');
  var form = t.struct({
          concepto_flete: t.enums({82:'Acarreo Interno', 92:'Acarreo Externo'}),
          proveedor_id: t.enums(state.proveedores),
          material_id: t.enums(state.materiales),
          zona_id: t.enums(state.zonas),
          photoURL: t.String
    });

    return(form);
}

  onChange(value) {
    // tcomb immutability helpers
    // https://github.com/gcanti/tcomb/blob/master/GUIDE.md#updating-immutable-instances
    this.setState({value:value});
            if(value.concepto_flete){

              if (value.proveedor_id && !value.material_id){
                this.getMateriales(value.proveedor_id)
              }
            }
}

submit() {
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
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
      .then((responseData) => {
        this.handleResponse(responseData)
      }).catch(function(err){
        console.log(err);
      })
}
}
handleResponse(response) {
  console.log('handling response')
  if (response) {
    console.log('sending component')
    this.props.navigator.push({
      title: 'Recibo',
      component: Recibo,
      passProps: {recibo_id: response.recibo}
    });
  }
}
// http://10.5.5.9:8080/videos/DCIM/" + directory + "/" + filename
savePhoto(directory,filename){
  var photo;
  console.log('saving photo');
  var date =Date.now();
  var formattedDate = moment(date).format('DD-MM-YY-hh-mm-ss');
  const file = {
    uri:"http://10.5.5.9:8080/videos/DCIM/" + directory + "/" + filename,
    name: formattedDate+'.jpg',
    type:'image/jpeg'
  };
  const options = {
    bucket: 'dymingenieros',
    region: 'us-east-1',
    accessKey: 'AKIAIDV3FMAAZZF2FFPA',
    secretKey: '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',
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
}).then(()=>{
      this.state.value.photoURL = photo;
      return this.setState(this.state);
    });
}

getPhoto(){
  var lastDirectory;
  var lastFile;
  console.log('getting photo')
        fetch("http://10.5.5.9:8080/gp/gpMediaList")
        .then((response) => {
          if (response.status === 200){
            var result = JSON.parse(response._bodyText);
            lastDirectory = result.media[result.media.length - 1];
            lastFile = lastDirectory.fs[lastDirectory.fs.length - 1];
          }
          else{
          return AlertIOS.alert(
           'Conexión de cámara falló',
           'Por favor inténtelo de nuevo'
          );
        }
        })
        .then(()=>{
          if(lastDirectory){
             return this.savePhoto(lastDirectory.d,lastFile.n);
          }
    });
}

takePhoto(){
  console.log('taking photo')
        fetch("http://10.5.5.9:8080/gp/gpControl/command/mode?p=1", {
        method: "GET"
      }).then((response) => {
        if(response.status === 200){
          console.log('taking photo');
        } else {
          return AlertIOS.alert(
           'Cámara desconectada',
           'Por favor inténtelo de nuevo'
          );
        }
      }).then(()=>{
      return fetch("http://10.5.5.9:8080/gp/gpControl/command/shutter?p=1", {
        method: "GET"
      })
      }).then((response) => {
        if(response.status === 200){
          console.log('taking photo');
        } else {
          return AlertIOS.alert(
           'Cámara desconectada',
           'Por favor inténtelo de nuevo'
          );
        }
      }).then(()=>{
      return fetch("http://10.5.5.9:8080/gp/gpControl/command/shutter?p=0", {
        method: "GET"
      })
    }).then((response) => {
        if(response.status === 200){
          console.log('closing shutter')
        } else {
          return AlertIOS.alert(
           'Cámara desconectada',
           'Por favor inténtelo de nuevo'
          );
        }
    }).then(()=>{
        return this.getPhoto();
      })

}

  render() {
    return (
        <ScrollView>
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

module.exports = Captura;
