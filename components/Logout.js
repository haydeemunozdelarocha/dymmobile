import { AlertIOS, AsyncStorage } from "react-native";
import React from "react";

export class Logout extends React.Component {
  async _userLogout() {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      AlertIOS.alert("Logout Success!")
    } catch (error) {
      console.log('AsyncStorage error: ' + error.message);
    }
  }
}