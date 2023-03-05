import "./topbar.css"
import { Link } from "react-router-dom";
import { useContext } from "react";
import { Context } from "../../context/Context";

export default function Topbar() {
    const {user, dispatch} = useContext(Context);

    const handleLogout = () => {
        dispatch({ type: "LOGOUT" });
      };
  return (
    <div className="top">
        <div className="topleft">
            <i class="topIcon fa-brands fa-linkedin"></i>
            <i className="topIcon fa-brands fa-square-twitter"></i>
            <i className="topIcon fa-brands fa-square-pinterest"></i>
            <i className="topIcon fa-brands fa-square-instagram"></i>
        </div>

        <div className="topcenter">
            <ul className="topList">
                <li className="topListItem">
                    <Link to="/" className="link">HOME</Link>
                </li>
                <li className="topListItem"><Link to="/" className="link">ABOUT</Link></li>
                <li className="topListItem"><Link to="/" className="link">CONTACT</Link></li>
                <li className="topListItem"><Link to="/write" className="link">WRITE</Link></li>
                <li className="topListItem" onClick={handleLogout}>
                    {user && "LOGOUT"}
                </li>
            </ul>
        </div>

        <div className="topright">
            {
                user ? (
                    <Link to="/settings" className="link">
                    <img
                        className="topImg"
                        src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTW9a5hlDjztL8_B2DgKDjL0OJjtAGlr3DI2OWLxPLibQ&s" alt="" />
                        </Link>

                ) :
                (
                    <ul className="topList">
                        <li className="topListItem">
                            <Link to="/login" className="link">LOGIN</Link>
                        </li>
                        <li className="topListItem">
                            <Link to="/register" className="link">REGISTER</Link>
                        </li>
                    </ul>
                )
            }
            {/* <i className="topSearchIcon fa-solid fa-magnifying-glass"></i> */}
        </div>
    </div>
  )
}
