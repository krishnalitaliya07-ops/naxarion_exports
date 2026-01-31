import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { apiConnector } from '../../services/apiconnector';
import { adminEndpoints } from '../../services/apis';

const { GET_ALL_CONTACTS_API } = adminEndpoints;

const AdminContacts = () => {
  const [loading, setLoading] = useState(true);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await apiConnector(
        'GET',
        GET_ALL_CONTACTS_API,
        null,
        { Authorization: `Bearer ${token}` }
      );

      if (response.data.success) {
        setContacts(response.data.data.contacts || []);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
      toast.error('Failed to load contact messages');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <i className="fas fa-circle-notch fa-spin text-4xl text-indigo-500"></i>
          <p className="text-slate-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 mb-2 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
            <i className="fas fa-envelope text-white text-xl"></i>
          </div>
          Contact Messages
        </h1>
        <p className="text-sm text-slate-600">View and respond to customer inquiries</p>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border-2 border-slate-200 p-6">
        <h3 className="text-lg font-black text-slate-900 mb-4">All Messages</h3>
        {contacts.length > 0 ? (
          <div className="space-y-4">
            {contacts.map((contact) => (
              <div key={contact._id} className="border-2 border-slate-200 rounded-xl p-4 hover:border-indigo-500 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-bold text-slate-900">{contact.name}</p>
                    <p className="text-sm text-slate-600">{contact.email}</p>
                  </div>
                  <span className="text-xs text-slate-500">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-sm text-slate-700">{contact.message}</p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <i className="fas fa-envelope text-6xl text-slate-300 mb-3"></i>
            <p className="text-slate-600">No messages found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminContacts;
