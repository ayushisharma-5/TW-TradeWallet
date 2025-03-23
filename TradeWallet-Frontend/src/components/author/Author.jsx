import '../../styles/author.css'
import userpic from '../../assets/Trade-Wallet-Logo.png'

const Author = ({img, bio }) => {
    return (<>
        <div className="author-container">
            <img className="user-img" src={userpic}/>
            <p className='user-bio'> {bio}</p>
        </div>
    </>);
}

export default Author;
