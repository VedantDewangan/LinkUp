import Navbar from "../../components/Navbar/Navbar";
import { FaSearch } from "react-icons/fa";
import "./Search.css";
import axios from "axios";
import toast from "react-hot-toast";
import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { RiVerifiedBadgeFill } from "react-icons/ri";

function Search() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState(null);
  const navigate = useNavigate();

  const searchUser = async (e) => {
    e.preventDefault();
    if (search.length < 3) {
      toast("Please Enter atleast 3 characters");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/search?name=${search}`,
        { withCredentials: true }
      );
      setUsers(data.users.filter((item) => item._id !== user._id));
    } catch (error) {
      console.log(error);
      toast;
    }
    setLoading(false);
  };

  return (
    <div className="page">
      <Navbar page={"Search"} />
      <div className="all-post-container-home search-page-container">
        <form onSubmit={searchUser}>
          <div>
            <span>
              <FaSearch />
            </span>
            <input
              type="text"
              required
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
              placeholder="Search User"
            />
          </div>
          <button type="submit">Search</button>
        </form>
        <div>
          {loading ? (
            <p
              style={{
                textAlign: "center",
              }}
            >
              Loading...
            </p>
          ) : users ? (
            users.length === 0 ? (
              <p style={{ textAlign: "center" }}>No User Found</p>
            ) : (
              <div className="search-con">
                {users.map((obj) => {
                  return (
                    <div key={obj._id} className="search-user-con">
                      <img src={obj.profilePhoto} alt="" />
                      <div
                        onClick={() => {
                          navigate(`/profile/${obj._id}`);
                        }}
                        className="search-user-con-details"
                      >
                        <p className="search-user-con-details-fullname">
                          {obj.fullName}
                          <span
                            style={{
                              display: `${obj.verified ? "block" : "none"}`,
                            }}
                          >
                            <RiVerifiedBadgeFill />
                          </span>
                        </p>
                        <p className="search-user-con-details-username">
                          @{obj.userName}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : (
            <div className="null-search-user">
              <span>
                <i className="fa-solid fa-users"></i>
              </span>
              <p className="null-search-user-heading">Discover</p>
              <p className="null-search-user-subheading">
                Start typing to search for users by name or username.
              </p>
              <p className="null-search-user-subheading">
                Connect with amazing people in the community!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
