import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import '../../styles/login.css';

const Login = ({ setUserInParentComponent }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    const signIn = async (event) => {
        event.preventDefault();

        if (!username || !password) {
            toast.error('Please fill in all fields', { position: "top-right" });
            return;
        }

        setIsLoading(true);
        const url = `http://127.0.0.1:5000/user/authenticate-user/${username}/${password}`;

        try {
            const res = await fetch(url);

            if (!res.ok) {
                setUserInParentComponent(prev => ({
                    ...prev,
                    isLoggedIn: false,
                }));
                toast.error('Login failed! Please check your credentials.', {
                    autoClose: false,
                });
            } else {
                const data = await res.json();
                setUserInParentComponent(prev => ({
                    ...prev,
                    user: data.username,
                    userId: data.id,
                    isLoggedIn: true,
                }));
                navigate('/home');
            }
        } catch (error) {
            toast.error(`Failed to authenticate user ${username}: ${error}`, { autoClose: false });
        } finally {
            setIsLoading(false);
        }
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
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <label htmlFor="Password">Password</label>
                        <input
                            type="password"
                            id="Password"
                            name="Password"
                            onChange={(e) => setPassword(e.target.value)}
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