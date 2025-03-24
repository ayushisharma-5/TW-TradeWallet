import React from 'react';
import '../../styles/about.css';
import teamMember1 from '../../assets/ayushi.jpeg'; 
import teamMember2 from '../../assets/kuldeep.jpeg';
import teamMember3 from '../../assets/nivedita.jpeg';
import teamMember4 from '../../assets/sudhansh.jpeg';

const About = () => {
    return (
        <div className="about-container">
            <h1>About TradeWallet</h1>
            <div className="about-content">
                <div className="about-section">
                    <h2>Our Mission</h2>
                    <p>
                        At TradeWallet, our mission is to provide a seamless and intuitive platform for managing your investments. 
                        Whether you're a seasoned trader or just starting out, we aim to empower you with the tools and insights 
                        needed to make informed decisions.
                    </p>
                </div>
                <div className="about-section">
                    <h2>Our Team</h2>
                    <div className="team-members">
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/ayushi-sharma-50059042/" target="_blank" rel="noopener noreferrer">
                                <img src={teamMember1} alt="Ayushi Sharma" className="team-member-image" />
                            <h3>Ayushi Sharma</h3>
                            </a>
                        </div>
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/kmr230005/" target="_blank" rel="noopener noreferrer">    
                                <img src={teamMember2} alt="Kuldeepsinhji Rathod" className="team-member-image" />
                            <h3>Kuldeepsinhji Rathod</h3>
                            </a>
                        </div>
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/nivedita-vats/" target="_blank" rel="noopener noreferrer">
                                <img src={teamMember3} alt="Nivedita Vats" className="team-member-image" />
                            <h3>Nivedita Vats</h3>
                            </a>
                        </div>
                        <div className="team-member">
                            <a href="https://www.linkedin.com/in/sudhansh-chopda/" target="_blank" rel="noopener noreferrer">    
                                <img src={teamMember4} alt="Sudhansh Chopda" className="team-member-image" />
                            <h3>Sudhansh Chopda</h3>
                            </a>
                        </div>
                    </div>
                </div>
                <div className="about-section">
                    <h2>Why Choose Us?</h2>
                    <ul>
                        <li>Real-time market data and analytics</li>
                        <li>User-friendly interface</li>
                        <li>Secure and reliable platform</li>
                        <li>24/7 customer support</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default About;