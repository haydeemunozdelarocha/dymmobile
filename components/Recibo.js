import React from 'react';
import {
  View,
  Linking
} from 'react-native';


export default class Recibo extends React.Component {
  componentWillMount(){
    console.log('mounting');
    this.getRecibo(this.props.recibo_id);
  }

  getRecibo(recibo_id) {
    fetch(`https://dymingenieros.herokuapp.com/recibo/${recibo_id}`, {
      method: "GET"
    })
    .then((response) => Linking.openURL(`starpassprnt://v1/print/nopreview?html=${response._bodyInit}&size=3&back=dymcaptura://`))
  }
  render() {
    return(
        <View></View>
    )
  }
}
