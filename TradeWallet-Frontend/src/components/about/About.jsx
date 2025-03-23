import '../../styles/about.css';
import Author from '../author/Author';
import userimg from '../../assets/Tradde-Wallet-Logo.png';

const   About = ({ setUserInParentComponent }) => {
    const handleLogout = (event) => {
        event.preventDefault();
        setUserInParentComponent(prevState => ({
            ...prevState,
            isLoggedIn: false
        }));
    };

    return (
        <>
            <h1>About us</h1>
            <Author img={userimg} bio={'This the bio of "Nivedita Vats"'}/>
            <Author img={userimg} bio={'This the bio of "Sidhansh Chopda"'}/>
            <Author img={userimg} bio={'This the bio of "Ayushi Sharma"'}/>
            <Author img={userimg} bio={'This the bio of "Kuldeep Singhji Rathore"'}/>
            <button onClick={handleLogout}>Logout</button>
        </>);
}

export default About;
