import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import '../../styles/login.css';

const Login = ({ setUserInParentComponent }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const signIn = (event) => {
        event.preventDefault();
        if (!username || !password) {
            toast.error('Please fill in all fields', { position: "top-right" });
            return;
        }

        setIsLoading(true);
        // Simulate an API call
        setTimeout(() => {
            if (username === 'admin' && password === 'admin') {
                setUserInParentComponent(prevState => ({
                    ...prevState,
                    user: username,
                    isLoggedIn: true
                }));
            } else {
                toast.error('Invalid username or password', { position: "top-right" });
            }
            setIsLoading(false);
        }, 1000);
    };

    return (
        <>
            <div className="signin-body">
                <div className="signin-container">
                    <h1>Sign in</h1>
                    <form onSubmit={signIn}>
                        <label htmlFor="Email">Username</label>
                        <input
                            type="text"
                            id="Email"
                            name="Email"
                            onChange={(event) => setUsername(event.target.value)}
                            required
                        />
                        <label htmlFor="Password">Password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                        <div className="remember-me">
                            <input type="checkbox" id="rememberMe" />
                            <label htmlFor="rememberMe">Remember Me</label>
                        </div>
                        <input
                            type="submit"
                            value={isLoading ? "Signing in..." : "Sign in"}
                            disabled={isLoading}
                        />
                        <p className="forgot-password">Forgot Password?</p>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </>
    );
};

export default Login;