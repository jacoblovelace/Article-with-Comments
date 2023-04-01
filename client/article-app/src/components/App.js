import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';
import './App.css';
import Article from './Article';
import Comments from './Comments';

function App () {

    const [user, setUser] = useState({});

    /* decode credentials from Google sign in response and update user state*/
    function handleSignIn(response) {
        var userObj = jwt_decode(response.credential);
        setUser(userObj);
        document.getElementById("sign-in").hidden = true;
    }

    /* update user state to reflect sign out */
    function handleSignOut(e) {
        setUser({});
        document.getElementById("sign-in").hidden = false;
    }

    /* call initialize on mount AND when user state updates */
    useEffect(() => {
        /* global google */
        google.accounts.id.initialize(
            {
                client_id: "1064746388758-47stn24n7jmlkm2a2ecgobj8sgsr7c2m.apps.googleusercontent.com",
                callback: handleSignIn
            }
        );

        google.accounts.id.renderButton(document.getElementById("sign-in"), {theme: "outline", size: "medium"});
    }, [user]);

    return (
        <div className='app-container'>
            <div className="nav-bar">
                <div className="app-title">
                    <h2>TechTrends</h2>
                    <h1>Today</h1>
                </div>
                <div className="nav-right">
                    {Object.keys(user).length !== 0 &&
                        <div className="nav-dropdown">
                            <span>{user.name}</span>
                            <img src={user.picture} alt="user"></img>
                            <div className="nav-dropdown-content">
                                <button id="sign-out" onClick={ (e) => handleSignOut(e)}>Sign Out</button>
                            </div>
                            <i className="nav-dropdown-arrow"></i>
                        </div>
                    }
                    <div id="sign-in"></div>
                </div>
            </div>
            
            <Article />
            <Comments user = {user}/>
        </div>
    )
}

export default App;