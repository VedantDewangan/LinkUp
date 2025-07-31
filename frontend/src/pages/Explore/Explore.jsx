import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Explore.css";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Post from "../../components/Post/Post";

function Explore() {
  const [allPost, setAllPost] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getAllPost = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/post/getPost`,
          {
            withCredentials: true,
          }
        );
        setAllPost(data.data);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getAllPost();
  }, []);

  return (
    <div className="page">
      <Navbar page={"Explore"} />
      <div className="all-post-container-home">
        {loading ? (
          <p
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            Loading...
          </p>
        ) : allPost.length === 0 ? (
          <p
            style={{
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
            }}
          >
            No Post
          </p>
        ) : (
          allPost.map((obj) => {
            return (
              <Post postDetails={obj} key={obj._id} setUserPost={setAllPost} />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Explore;
