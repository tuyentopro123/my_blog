import "./Home.scss"
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar";
import Body from "../../components/Body/Body";
import Helmet from '../../components/Helmet/Helmet'



const Home = () => {
  const user = useSelector((state)=> state.auth.login?.currentUser)
  const navigate = useNavigate()

  return (
    <Helmet title="Home">
      <main className="home">
        <Navbar/>
        <Body/>
      </main>
    </Helmet>
  );
};

export default Home;
