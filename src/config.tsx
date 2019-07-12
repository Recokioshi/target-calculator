import * as firebase from "firebase";

const config = {
  apiKey: "AIzaSyDAyZxQyGgETbrIPkf_WN1WmSswz_jvgCg",
  authDomain: "target-calculator-orange.firebaseapp.com",
  databaseURL: "https://target-calculator-orange.firebaseio.com",
  projectId: "target-calculator-orange",
  storageBucket: "target-calculator-orange.appspot.com",
  messagingSenderId: "674756641290",
  appId: "1:674756641290:web:db84505268ec4037"
};

export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
