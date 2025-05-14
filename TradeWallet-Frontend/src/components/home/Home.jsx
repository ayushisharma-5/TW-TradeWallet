import PropTypes from "prop-types";
import '../../styles/Home.css';

const Home = () => {
    return (<>
        <h1>hello</h1>
    </>);
}

Home.propTypes = {
    user: PropTypes.object.isRequired,
    onLogout: PropTypes.object.isRequired,
}

export default Home;