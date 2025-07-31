import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import { useEffect, useState } from "react";
import Post from "../../components/Post/Post";
import socket from "../../socket";
function Home() {
  const { user } = useAuth();
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
        const arr = data.data.filter(
          (post) =>
            post.user._id === user._id || user.following.includes(post.user._id)
        );
        setAllPost(arr);
      } catch (error) {
        console.log(error);
      }
      setLoading(false);
    };
    getAllPost();
  }, []);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
    });

    return () => {
      socket.off("connect");
    };
  }, []);

  return (
    <div className="page">
      <Navbar page={"Home"} />
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
            Start Following Pepople 😼 Today.
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

export default Home;
