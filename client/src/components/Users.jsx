import axios from "axios";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import {
  UserMinusIcon,
  UserCircleIcon,
  UserGroupIcon,
  MinusCircleIcon,
} from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

const Users = () => {
  const [recentUserCount, setRecentUserCount] = useState(0);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [adminCount, setAdminCount] = useState(0);

  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const userCount = users.length - 1;
  const usersPerPage = 5;

  const pageCount = Math.ceil(users.length / usersPerPage);

  const displayedUsers = users.slice(
    currentPage * usersPerPage,
    (currentPage + 1) * usersPerPage
  );

  const handlePageClick = (data) => {
    setCurrentPage(data.selected);
  };
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get(import.meta.env.VITE_REGISTER_URL);
      if (response.data.status === 1) {
        const userData = response.data.data;
        setUsers(userData);
        calculateUserMetrics(userData);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const calculateUserMetrics = (users) => {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.setDate(now.getDate() - 30));
    const sixtyDaysAgo = new Date(now.setDate(now.getDate() - 30));

    // Recent Users (Last 30 Days)
    const recentUsers = users.filter((user) => {
      const userDate = new Date(user.date);
      return userDate >= thirtyDaysAgo;
    });

    // Inactive Users (No login in last 60 days)
    const inactiveUsers = users.filter((user) => {
      const lastLogin = new Date(user.date);
      return lastLogin <= sixtyDaysAgo;
    });

    // Admin / Moderator Count
    const admins = users.filter(
      (user) => user.role === "admin" || user.role === "moderator"
    );

    // Update State
    setRecentUserCount(recentUsers.length);
    setInactiveCount(inactiveUsers.length);
    setAdminCount(admins.length);
  };

  const handleDelete = (id) => {
    const updatedUsers = users.filter((user) => user.id !== id);
    setUsers(updatedUsers);
    axios
      .delete(`${import.meta.env.VITE_REGISTER_URL}?userId=${id}`)
      .then(() => toast.success("User removed successfully!"))
      .catch(() => toast.error("Error deleting product:"));
  };

  return (
    <>
      <h1 className="text-2xl mb-3 font-extrabold uppercase tracking-wide text-neroBlack500 border-b-2 border-gray-200 pb-4">
        Users Control
      </h1>
      <span className="text-sm text-gray-400">
      Easily track and manage all users from this dashboard.
      </span>

      {/* Users DashBoard */}
      <div className="flex gap-5">
        {/* Users Count */}
        <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="bg-gray-100 p-3 rounded-lg">
              <UserGroupIcon className="w-8 h-8 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Active Members</p>
              <p className="text-2xl font-semibold">{userCount}</p>
            </div>
          </div>
          <button className="p-1 rounded-full hover:bg-gray-100">
            <span className="text-gray-500">...</span>
          </button>
        </div>

        <div className="flex gap-5">
          {/* Recent Users */}
          <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-blue-100 p-3 rounded-lg">
                <UserCircleIcon className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">New Users (30 Days)</p>
                <p className="text-2xl font-semibold">{recentUserCount}</p>
              </div>
            </div>
          </div>

          {/* Inactive Users */}
          <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-gray-100 p-3 rounded-lg">
                <MinusCircleIcon className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Inactive Users</p>
                <p className="text-2xl font-semibold">{inactiveCount}</p>
              </div>
            </div>
          </div>

          {/* Admin Count */}
          <div className="w-72 my-10 bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="bg-purple-100 p-3 rounded-lg">
                <UserGroupIcon className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Admins/Moderators</p>
                <p className="text-2xl font-semibold">{adminCount}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Product Table */}
      <div className="overflow-x-auto rounded-2xl mt-8">
        <table className="w-full border-collapse shadow-lg">
          <thead className="bg-neutral-800 text-white">
            <tr>
              <th className="py-3 px-6 text-left">Users</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Address</th>
              <th className="py-3 px-6 text-left">City</th>
              <th className="py-3 px-6 text-center">Role</th>
              <th className="py-3 px-6 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedUsers.map((user) => (
              <tr
                key={user.id}
                className="border-b border-neroBlack500 hover:bg-gray-100"
              >
                <td className="py-3 px-6 flex items-center gap-4">
                  <Link>
                    {user && user.profile ? (
                      <>
                        <img
                          src={`${import.meta.env.VITE_IMAGES_URL}/${
                            user.profile
                          }`}
                          alt={user.name}
                          className="w-12 h-12 object-cover rounded-full border border-neroBlack950"
                        />
                      </>
                    ) : (
                      <>
                        <UserCircleIcon className="w-12 h-12 object-cover rounded" />
                      </>
                    )}
                  </Link>

                  <span className="text-sm ">{user.name}</span>
                </td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6">
                  {user.phno ? <>{user.phno}</> : <>N/A</>}
                </td>
                <td className="py-3 px-6">
                  {user.address ? <>{user.address}</> : <>N/A</>}
                </td>
                <td className="py-3 px-6">
                  {user.city ? <>{user.city}</> : <>N/A</>}
                </td>
                <td className="py-3 px-6">{user.role}</td>
                <td className="py-3 px-6 text-center">
                  {user.role !== "admin" && (
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800 mr-5"
                    >
                      <UserMinusIcon className="w-5 h-5 inline" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length > usersPerPage && (
          <div className="flex justify-center mt-10">
            <ReactPaginate
              previousLabel={"← Previous"}
              nextLabel={"Next →"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={1}
              pageRangeDisplayed={2}
              onPageChange={handlePageClick}
              containerClassName={
                "flex items-center space-x-2 text-sm bg-white rounded-lg shadow-md p-3"
              }
              activeClassName={"bg-neroBlack950 text-white rounded-full"}
              pageLinkClassName={
                "px-3 py-1 rounded-lg hover:bg-gray-200 transition"
              }
              previousLinkClassName={
                "px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              }
              nextLinkClassName={
                "px-4 py-2 rounded-lg hover:bg-gray-200 transition"
              }
              breakClassName={"px-3 py-2"}
              disabledClassName={"text-gray-300 cursor-not-allowed"}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Users;
