var React = require('react');
var ReactNative = require('react-native');

import {
  Text,
  View,
  TouchableHighlight,
  Image,
  Linking
} from 'react-native';


class Recibo extends React.Component {
state = {
    recibo:{}
    };


componentWillMount(){
  console.log('mounting');
  this.getRecibo(this.props.recibo_id);
}
getRecibo(recibo_id){
  console.log('getting recibo')
       fetch("https://dymingenieros.herokuapp.com/recibo/"+recibo_id, {
        method: "GET"
        })
      .then((response) => {
          console.log(response._bodyInit);
          Linking.openURL("starpassprnt://v1/print/nopreview?html="+response._bodyInit+"&size=3&back=dymcaptura://")
        })
}
render(){
  console.log(this.state.recibo)
  return(
    <View>
    </View>
    )
}
}
export default Recibo;
