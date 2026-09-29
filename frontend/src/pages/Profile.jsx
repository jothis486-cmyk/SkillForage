import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    collegeName: '',
    degree: '',
    department: '',
    cgpa: '',
    graduationYear: '',
    preferredCareer: '',
    technicalSkills: '',
    programmingLanguages: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('/api/users/profile');
        const data = res.data;
        setFormData({
          fullName: data.fullName || '',
          phoneNumber: data.phoneNumber || '',
          collegeName: data.collegeName || '',
          degree: data.degree || '',
          department: data.department || '',
          cgpa: data.cgpa || '',
          graduationYear: data.graduationYear || '',
          preferredCareer: data.preferredCareer || '',
          technicalSkills: data.technicalSkills ? data.technicalSkills.join(', ') : '',
          programmingLanguages: data.programmingLanguages ? data.programmingLanguages.join(', ') : ''
        });
      } catch (err) {
        console.error('Error fetching profile', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        technicalSkills: formData.technicalSkills.split(',').map(s => s.trim()),
        programmingLanguages: formData.programmingLanguages.split(',').map(s => s.trim())
      };
      await axios.put('/api/users/profile', payload);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setMessage('Failed to update profile.');
    }
  };

  if (loading) return <div>Loading profile...</div>;

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white shadow rounded-lg p-6"
      >
        <h2 className="text-2xl font-bold mb-6 text-gray-900">User Profile</h2>
        {message && <div className="mb-4 text-green-600 font-semibold">{message}</div>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">College Name</label>
              <input type="text" name="collegeName" value={formData.collegeName} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Degree</label>
              <input type="text" name="degree" value={formData.degree} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Department</label>
              <input type="text" name="department" value={formData.department} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">CGPA</label>
              <input type="number" step="0.01" name="cgpa" value={formData.cgpa} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Graduation Year</label>
              <input type="number" name="graduationYear" value={formData.graduationYear} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Preferred Career</label>
              <input type="text" name="preferredCareer" value={formData.preferredCareer} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2" />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Technical Skills (comma separated)</label>
            <textarea name="technicalSkills" value={formData.technicalSkills} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Programming Languages (comma separated)</label>
            <textarea name="programmingLanguages" value={formData.programmingLanguages} onChange={handleChange} rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border p-2"></textarea>
          </div>

          <div className="flex justify-end mt-4">
            <button type="submit" className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
              Save Profile
            </button>
          </div>
        </form>

        <hr className="my-8" />

        <div className="mt-8">
          <h3 className="text-xl font-bold mb-4">Resume Upload</h3>
          <form onSubmit={async (e) => {
            e.preventDefault();
            const fileInput = e.target.elements.resume;
            if (!fileInput.files[0]) return;
            const formData = new FormData();
            formData.append('resume', fileInput.files[0]);
            try {
              await axios.post('/api/users/resume', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
              });
              setMessage('Resume uploaded successfully!');
            } catch (err) {
              setMessage('Failed to upload resume.');
            }
          }} className="flex items-center space-x-4">
            <input type="file" name="resume" accept=".pdf,.docx" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100" />
            <button type="submit" className="py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-secondary-600 hover:bg-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary-500">
              Upload
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile;
