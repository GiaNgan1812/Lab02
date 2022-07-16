import React, {useState, useEffect} from 'react'
//import fire from './firebase'
import Login from './components/Login';
import fire from './fire';
import './index.css'
import Hero from './components/Hero';

function App() {
  const [user, setUser] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); 
  //const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [hasAccount, setHasAccount] = useState(false);

  const clearInputs = () => {
    setEmail('');
    setPassword('');
  }

  const clearErrors = () => {
    setEmailError('');
    setPasswordError('');
  }
  const handleLogin = () =>   {
    clearErrors();
    fire 
      .auth()
      .signInWithEmailAndPassword(email, password)
      .catch((err) => {
        switch(err.code){
          case "auth/invalid-email":
          case "auth/user-disabled":
          case "auth/user-not-found":
            setEmailError(err.message);
            break;
          case "auth/wrong-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleSignUp = () => {
    clearErrors();
    fire 
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .catch((err) => {
        switch(err.code){
          case "auth/email-alredy-in-use":
          case "auth/invalid-email":
            setEmailError(err.message);
            break;
          case "auth/week-password":
            setPasswordError(err.message);
            break;
        }
      });
  };

  const handleLogout = () => {
    fire.auth().signOut();
  };

  const authListener = () => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        clearInputs();
        setUser(user);
      } else {
        setUser("");
      }
    })
  }

  useEffect(() => {
    authListener();
  }, []);

  return (
      <div className="App">
        {user ? (
          <Hero handleLogout = {handleLogout}/>
        ) : (
          <Login 
          handleLogin={handleLogin} 
          handleSignUp = {handleSignUp}
          //handleLogout = {handleLogout}
          hasAccount = {hasAccount} setHasAccount = {setHasAccount}
          email={email} setEmail={setEmail} emailError = {emailError}
          password = {password} setPassword = {setPassword} passwordError = {passwordError}/> 
        )}
       
        
    </div>
  );
};

export default App;
