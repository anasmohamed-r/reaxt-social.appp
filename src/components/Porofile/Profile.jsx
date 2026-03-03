import React, { useContext, useEffect } from 'react';
import { AuthUsercontext } from '../Context/AuthContextProvider/AuthContextProvider';

export default function Profile() {
  const { userData, getUserData, token } = useContext(AuthUsercontext);

  useEffect(() => {
    if (!userData && token) {
      getUserData(token);
    }
  }, [userData, token, getUserData]);

  if (!userData || !userData.user) {
    return <div className="flex justify-center items-center min-h-[60vh]">Loading profile...</div>;
  }

  const { name, username, email, dateOfBirth, profilePhoto } = userData.user;

  return (
    <div className="bg-[#f5f7fa] min-h-screen">

      <div className="w-full h-56 bg-linear-to-r from-[#1e3356] to-[#3b5b8c] rounded-b-3xl -mb-20" />

 
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-lg p-8 relative z-10 -mb-20` flex flex-col items-center">
        <div className="flex flex-col items-center w-full">
          <div className="relative -mt-20 mb-2">
            <img
              src={profilePhoto || 'https://i.pravatar.cc/150?u=a042581f4e29026704d'}
              alt="Profile"
              className="w-36 h-36 rounded-full border-4 border-white shadow-md object-cover"
            />
            <span className="absolute left-1/2 -bottom-2 transform -translate-x-1/2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">Route Posts member</span>
          </div>
          <div className="flex flex-row items-center justify-center gap-8 w-full mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-gray-500">FOLLOWERS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">3</div>
              <div className="text-xs text-gray-500">FOLLOWING</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">0</div>
              <div className="text-xs text-gray-500">BOOKMARKS</div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row gap-6 justify-between items-start">
            <div className="bg-gray-50 rounded-xl p-6 flex-1 min-w-65">
              <div className="font-semibold mb-2">About</div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 01-8 0 4 4 0 018 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v7m0 0H9m3 0h3" /></svg>
                {email}
              </div>
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Active on Route Posts
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10m-9 4h6" /></svg>
                {dateOfBirth ? new Date(dateOfBirth).toLocaleDateString() : null}
              </div>
            </div>
            <div className="flex-1 flex flex-row gap-4 min-w-65">
              <div className="bg-blue-50 rounded-xl flex-1 p-4 text-center">
                <div className="text-xs text-gray-500">MY POSTS</div>
                <div className="text-2xl font-bold">0</div>
              </div>
              <div className="bg-blue-50 rounded-xl flex-1 p-4 text-center">
                <div className="text-xs text-gray-500">SAVED POSTS</div>
                <div className="text-2xl font-bold">0</div>
              </div>
            </div>
          </div>
        </div>
      </div>

     
      <div className="max-w-3xl mx-auto mt-8">
        <div className="bg-white rounded-xl shadow flex gap-2 p-2">
          <button className="flex-1 py-2 rounded-lg font-semibold bg-blue-50 text-blue-700 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6" /></svg>
            My Posts
          </button>
          <button className="flex-1 py-2 rounded-lg font-semibold text-gray-500 flex items-center justify-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
            Saved
            <span className="ml-1 bg-blue-100 text-blue-700 rounded-full px-2 text-xs">0</span>
          </button>
        </div>
      </div>
    </div>
  );
}
