import React from 'react';
import User from './User';
import useGetAllUsers from '../../context/useGetAllUsers';

function Users() {
  const [allUsers, loading] = useGetAllUsers();
  console.log('All users:', allUsers);  // Debugging log

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className='px-8 py-2 text-white font-semibold bg-slate-800 rounded-md'>Messages</h1>
      <div className="user-container" style={{ maxHeight: '73vh', overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        
        {allUsers.map((user, index) => (
          <User key={index} user={user} />
        ))}

      </div>
    </div>
  );
}

export default Users;
