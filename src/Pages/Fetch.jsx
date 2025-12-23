import { useEffect, useState } from "react";
import "./css/Fetch.css";

const BASE_URL = "https://jsonplaceholder.typicode.com/posts";

const Fetch = () => {
    

    const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true);
      try {
        const res = await fetch(BASE_URL);
        const data = await res.json(); 
        console.log(data);
      } catch (error) {
        console.log("Error: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="container">
        <h2>Fetch API in ReactJS</h2>
        <ul>
          <li>Something</li>
        </ul>
      </div>
    </div>
  );
};

export default Fetch;
