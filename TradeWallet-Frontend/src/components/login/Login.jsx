import { useState } from 'react';
import { ToastContainer,toast } from 'react-toastify';
import '../../styles/login.css';


    const Login = ({setUserInParentComponent}) => {
      const [username, setUsername] = useState('');
      const [password, setPassword] = useState('');

      const signIn = (event) => {
        event.preventDefault();
        if (username === 'admin' || password === 'admin') {
          setUserInParentComponent(prevState => ({
            ...prevState,
            user: username,
            isLoggedIn: true            
          }));
        } else {
            toast.error('Invalid username or password', {
                position: "top-right",
                autoClose: false,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
  
    };
    return (
      <>
        <div className="signin-body">
            <div className="signin-container">
                <h1>Sign in</h1>
                <form onSubmit={signIn}>
                    <label htmlFor="Email">Username</label>
                    <input type="text" id="Email" name="Email" onChange={(event) => setUsername(event.target.value)}/>
                    <label htmlFor="Password">Password</label>
                    <input type="password" id="Password" name="Password" onChange={(event) => setPassword(event.target.value)}/>
                    <input type="submit" value="Sign in" />
                </form>
            </div>
            <ToastContainer />
        </div>
      </>
    );
  };
  
  export default Login;
  