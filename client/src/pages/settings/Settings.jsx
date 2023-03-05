import './settings.css'
import Sidebar from "../../components/sidebar/Sidebar"
import { useContext, useState } from 'react'
import { Context } from '../../context/Context'
import axios from 'axios'

export default function Settings() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [success, setSuccess] = useState(false);

    const {user, dispatch} = useContext(Context);

    const handleSubmit = async (e) => {
        e.preventDefault();
        dispatch({ type: "UPDATE_START" });
        const updatedUser = {
          userId: user._id,
          username,
          email,
          password,
        };
        
        try {
          const res = await axios.put("/users/" + user._id, updatedUser);
          setSuccess(true);
          dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
        } catch (err) {
          dispatch({ type: "UPDATE_FAILURE" });
        }
      };

  return (
    <div className='settings'>
        <div className="settingsWrapper">
            <div className="settingsTitle">
                <span className="settingsUpdateTitle">Update your account</span>
                {/* <span className="settingsDeleteTitle">Delete your account</span> */}
            </div>
            <form className="settingsForm" onSubmit={handleSubmit}>
                <label >Profile Picture</label>
                <div className="settingsPP">
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW9a5hlDjztL8_B2DgKDjL0OJjtAGlr3DI2OWLxPLibQ&s" alt="" />
                    {/* <label htmlFor="fileInput">
                        <i className="settingsPPIcon fa-regular fa-circle-user"></i>
                    </label> */}
                    <input type="file" id="fileInput" style={{display:"none"}} />
                </div>
                <label >USERNAME</label>
                <input type="text" placeholder={user.username} onChange={(e) => setUsername(e.target.value)}/>
                <label >EMAIL</label>
                <input type="email" placeholder={user.email} onChange={(e) => setEmail(e.target.value)}/>
                <label >PASSWORD</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)}/>
                <button className="settingsSubmit" type="submit">Update</button>
                {success && (
                    <span
                    style={{ color: "green", textAlign: "center", marginTop: "20px" }}
                    >
                    Profile has been updated...
                    </span>
                )}
            </form>
        </div>
        <Sidebar />
    </div>
  )
}
