import "./sidebar.css";
import {useEffect, useState} from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [cats, setCats] = useState([]);

  useEffect(() => {
    const getCats = async () => 
    {
      const res = await axios.get("/categories");
      setCats(res.data);
    }
    getCats();
  }, [])

  return (
    <div className="sidebar">

      <div className="sidebarItem">
          <span className="sidebarTitle">ABOUT ME</span>
          <img className="sidebarImg" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJbQGIynw0a8yd8FEm28VqtXo5uXPCX1OxWENaua31Dg&s" alt="" />
          <p className="sidebarPara">Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur porro reiciendis.</p>
      </div>

      <div className="sidebarItem">
          <span className="sidebarTitle">CATEGORIES</span>
          <ul className="sidebarList">
          {cats.map((c) => (
            <Link to={`/?cat=${c.name}`} className="link">
            <li className="sidebarListItem">{c.name}</li>
            </Link>
          ))}
          </ul>
      </div>

      <div className="sidebarItem">
          <span className="sidebarTitle">FOLLOW ME</span>
          <div className="sidebarSocial">
            <i class="sidebarIcon fa-brands fa-linkedin"></i>
            <i className="sidebarIcon fa-brands fa-square-twitter"></i>
            <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
            <i className="sidebarIcon fa-brands fa-square-instagram"></i>
          </div>
      </div>


    </div>
  )
}
