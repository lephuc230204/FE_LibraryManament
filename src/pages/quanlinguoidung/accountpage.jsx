import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../assets/css/accountpage.css';

import NavBar from '../../components/navbar.jsx';
import SearchBar from '../../components/searchbar.jsx';
import SortBy from '../../components/sortby.jsx';
import AddButton from '../../components/addbutton.jsx';
import { FaUserPlus } from 'react-icons/fa';

const AccountPage = () => {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const fetchTableData = async () => {
      try {
        const response = await axios.get('https://api.example.com/users');
        setUserData(response.data.users);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchTableData();
  }, []);

  return (
    <div className="account-page">
      <div className="account-page-container">
        <NavBar />
        <div className="main-content">
        <div className="top-bar">
          <div className="top-row">
            <SearchBar />
            <SortBy />
          </div>
        <div className="add-button">
          <AddButton label="Add member" Icon={FaUserPlus} />
        </div>
      </div>
          <table className="account-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>CardID</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Password</th>
                <th>Birthday</th>
              </tr>
            </thead>
            <tbody>
              {userData.map((user, index) => (
                <tr key={index}>
                  <td>{user.name}</td>
                  <td>{user.id}</td>
                  <td>{user.cardID}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.password}</td>
                  <td>{user.birthday}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
