import Layout from '../../components/Layout';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import {authSpotify, authYouTube, getCookie} from '../../actions/auth'
import jwt from 'jsonwebtoken'
import Router from 'next/router'

const UserIndex = () => {
    const [values, setValues] = useState({
        s_text: "",
        y_text: ""
    })

    const {s_text, y_text} = values;

    const getSpotify = () => {
        const token = getCookie("token");
        if(!token){
            return "There is no user signed in"
        }
        const user = jwt.decode(token);
        if(user.email) {
            Router.push("http://18.224.76.50:8000/auth/spotify?user_email="+user.email)
        }else {
            console.log("No user email found")
        }
    }

    const getYouTube = () => {
        const token = getCookie("token");
        if(!token){
            return "There is no user signed in"
        }
        const user = jwt.decode(token);
        if(user.email) {
            Router.push("http://18.224.76.50:8000/auth/youtube?user_email="+user.email)
        }else {
            console.log("No user email found")
        }
    }

    return (
        <Layout>
            <h2>User Dashboard</h2>
            <div>
                <Link href="/playlists">
                    <button className="btn btn-primary">Get PlayList</button>
                </Link>
            </div>
            <br/>
            <div>
                <button className="btn btn-secondary" onClick={getSpotify}>Authorize Spotify</button>
            </div>
            <br/>
            <div>
                <button className="btn btn-secondary" onClick={getYouTube}>Authorize YouTube</button>
            </div>
            <br/>
            <div>
                <Link href='/smartyAddress'>
                    <button className="btn btn-primary">Add Address</button>
                </Link>
            </div>
        </Layout>
    );
};

export default UserIndex;