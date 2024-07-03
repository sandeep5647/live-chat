import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";

function useGetAllUsers() {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("jwt");
        const response = await axios.get("/api/user/allusers", {
          credentials: "include",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Check if the response contains the "fileteredUser" property and if it's an array
        if (response.data && Array.isArray(response.data.fileteredUser)) {
          setAllUsers(response.data.fileteredUser);
        } else {
          console.error("Error: Data fetched is not an array", response.data);
          setAllUsers([]);
        }
      } catch (error) {
        console.error("Error in useGetAllUsers: ", error);
        setAllUsers([]);
      } finally {
        setLoading(false);
      }
    };
    getUsers();
  }, []);

  return [allUsers, loading];
}

export default useGetAllUsers;
