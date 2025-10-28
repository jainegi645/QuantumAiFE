import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AppContext } from '@/context/AppContext';

const Unauthorized: React.FC = () => {
  const context = useContext(AppContext);
  const backendUrl = context?.backendUrl ?? '';
  const [requested, setRequested] = useState(false);

  useEffect(() => {
    // show informational toast when landing here
    toast.error('You are not authorized to access that page.');
  }, []);

  const requestAccess = async () => {
    try {
      setRequested(true);
      // send request to backend asking for educator access
      await axios.post(backendUrl + '/api/user/request-access', { requestedRole: 'educator' });
      toast.success('Request for access submitted. Admins will review your request.');
    } catch (err: any) {
      toast.error(err?.message || 'Failed to submit request');
      setRequested(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary p-8">
      <div className="max-w-md w-full bg-white rounded shadow p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
        <p className="text-gray-600 mb-6">You do not have permission to view this page.</p>

        <div className="flex gap-3 justify-center">
          <Link to="/" className="inline-block bg-gray-200 text-gray-800 px-4 py-2 rounded">Go Home</Link>
          <button
            onClick={requestAccess}
            disabled={requested}
            className="inline-block bg-blue-600 text-white px-4 py-2 rounded"
          >
            {requested ? 'Requested' : 'Request Access'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
