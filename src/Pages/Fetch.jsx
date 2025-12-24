import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import "./css/Fetch.css";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

/**
 * @typedef {Object} Post
 * @property {number} id
 * @property {string} title
 */

const Fetch = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const savedPosts = JSON.parse(localStorage.getItem("posts") || "[]");
    if (savedPosts.length > 0) {
      setPosts(savedPosts);
      console.log("Data stored in local storage successfully", savedPosts);
      return;
    } else {
      const fetchPosts = async () => {
        setIsLoading(true);
        try {
          const res = await fetch(BASE_URL);
          const posts = await res.json();
          setPosts(posts);
          console.log(posts);
        } catch (error) {
          console.log("Error: ", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchPosts();
    }
  }, []);

  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("posts", JSON.stringify(posts));
    }
  }, [posts, isInitialized]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const handleUpdate = async (id) => {
    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: "Updated Title" }),
      });
      const updatedPost = await res.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === id ? updatedPost : post))
      );
    } catch (error) {
      console.log("Error updating post: ", error);
    }
  };

  const startEdit = (id, currentTitle) => {
    setEditId(id);
    setEditTitle(currentTitle);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      });
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (error) {
      console.log("Error deleting post: ", error);
    }
  };

  return (
    <div>
      <div className="container">
        <h2>Fetch API in ReactJS</h2>
        {isLoading && <div>Loading...</div>}
        {!isLoading && (
          <ul>
            {posts.map((post) => {
              return (
                <li key={post.id}>
                  {editId === post.id ? (
                    <>
                      <input
                        type="text"
                        className="inputText"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => handleUpdate(post.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleUpdate(post.id);
                          }
                        }}
                        autoFocus
                      />
                      <button >save</button>
                    </>
                  ) : (
                    <>
                      <div className="postsItems">
                        <div>{post.title}</div>
                        <div>
                          <FontAwesomeIcon
                            className="editBtn"
                            icon={faPenToSquare}
                          />
                          <FontAwesomeIcon
                            className="editBtn"
                            icon={faTrash}
                            onClick={() => handleDelete(post.id)}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Fetch;
