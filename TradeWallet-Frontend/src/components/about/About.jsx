import '../../styles/about.css';
import Author from '../author/Author';
import userimg from '../../assets/test-image.png';

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
            <Author img={userimg} bio={'This the bio of Author 1'}/>
            <Author img={userimg} bio={'This the bio of Author 2'}/>
            <Author img={userimg} bio={'This the bio of Author 3'}/>
            <button onClick={handleLogout}>Logout</button>
        </>);
}

export default About;