import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { userAPI } from '../services/api';
import DeleteProfileModal from './DeleteProfileModal';
import './Profile.css';

const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  useEffect(() => {
    if (user?.profile) {
      reset({
        firstName: user.profile.firstName || '',
        lastName: user.profile.lastName || '',
        phone: user.profile.phone || '',
        bio: user.profile.bio || '',
        city: user.profile.location?.city || '',
        country: user.profile.location?.country || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      setMessage('');

      const profileData = {
        profile: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          bio: data.bio,
          location: {
            city: data.city,
            country: data.country
          }
        }
      };

      const response = await userAPI.updateProfile(profileData);
      
      if (response.success) {
        updateUser(response.data.user);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(response.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred while updating profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return (
      <div className="profile-container">
        <div className="loading">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-info">
          <h1>Profile</h1>
          <p>Manage your account information</p>
        </div>
        <div className="profile-actions">
          <button 
            onClick={() => setShowDeleteModal(true)} 
            className="delete-account-button"
          >
            Delete Account
          </button>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </div>

      {message && (
        <div className="success-message">
          {message}
        </div>
      )}

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="profile-card">
        <div className="profile-card-header">
          <h2>Personal Information</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="edit-button"
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </button>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmit)} className="profile-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="firstName">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  {...register('firstName', {
                    required: 'First name is required',
                    minLength: { value: 1, message: 'First name is required' },
                    maxLength: { value: 50, message: 'First name cannot exceed 50 characters' }
                  })}
                  className={errors.firstName ? 'error' : ''}
                />
                {errors.firstName && (
                  <span className="field-error">{errors.firstName.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="lastName">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  {...register('lastName', {
                    required: 'Last name is required',
                    minLength: { value: 1, message: 'Last name is required' },
                    maxLength: { value: 50, message: 'Last name cannot exceed 50 characters' }
                  })}
                  className={errors.lastName ? 'error' : ''}
                />
                {errors.lastName && (
                  <span className="field-error">{errors.lastName.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                type="tel"
                id="phone"
                {...register('phone', {
                  pattern: {
                    value: /^[\+]?[1-9][\d]{0,15}$/,
                    message: 'Please enter a valid phone number'
                  }
                })}
                className={errors.phone ? 'error' : ''}
              />
              {errors.phone && (
                <span className="field-error">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  {...register('city', {
                    maxLength: { value: 100, message: 'City name cannot exceed 100 characters' }
                  })}
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && (
                  <span className="field-error">{errors.city.message}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="country">Country</label>
                <input
                  type="text"
                  id="country"
                  {...register('country', {
                    maxLength: { value: 100, message: 'Country name cannot exceed 100 characters' }
                  })}
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && (
                  <span className="field-error">{errors.country.message}</span>
                )}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea
                id="bio"
                rows="4"
                {...register('bio', {
                  maxLength: { value: 500, message: 'Bio cannot exceed 500 characters' }
                })}
                className={errors.bio ? 'error' : ''}
                placeholder="Tell us about yourself..."
              />
              {errors.bio && (
                <span className="field-error">{errors.bio.message}</span>
              )}
            </div>

            <div className="form-actions">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="save-button"
                disabled={isLoading}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        ) : (
          <div className="profile-details">
            <div className="detail-row">
              <div className="detail-item">
                <label>Name</label>
                <p>{user.profile.firstName} {user.profile.lastName}</p>
              </div>
              <div className="detail-item">
                <label>Email</label>
                <p>{user.email}</p>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <label>Phone</label>
                <p>{user.profile.phone || 'Not provided'}</p>
              </div>
              <div className="detail-item">
                <label>Location</label>
                <p>
                  {user.profile.location?.city && user.profile.location?.country
                    ? `${user.profile.location.city}, ${user.profile.location.country}`
                    : 'Not provided'
                  }
                </p>
              </div>
            </div>

            {user.profile.bio && (
              <div className="detail-item">
                <label>Bio</label>
                <p>{user.profile.bio}</p>
              </div>
            )}

            <div className="detail-row">
              <div className="detail-item">
                <label>Member Since</label>
                <p>{new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="detail-item">
                <label>Last Login</label>
                <p>
                  {user.lastLogin
                    ? new Date(user.lastLogin).toLocaleDateString()
                    : 'Never'
                  }
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <DeleteProfileModal 
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </div>
  );
};

export default Profile;
