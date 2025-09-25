import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import './DeleteProfileModal.css';

const DeleteProfileModal = ({ isOpen, onClose }) => {
  const { deleteAccount } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setIsDeleting(true);
      setError('');

      const result = await deleteAccount(data.password);

      if (result.success) {
        // Account deleted successfully, user will be logged out automatically
        onClose();
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleClose = () => {
    reset();
    setError('');
    setShowConfirmation(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Delete Account</h2>
          <button onClick={handleClose} className="close-button">
            ×
          </button>
        </div>

        <div className="modal-content">
          {!showConfirmation ? (
            <div className="warning-section">
              <div className="warning-icon">⚠️</div>
              <h3>Are you sure you want to delete your account?</h3>
              <p>This action cannot be undone. All your data will be permanently deleted.</p>
              <div className="warning-details">
                <p><strong>This will delete:</strong></p>
                <ul>
                  <li>Your profile information</li>
                  <li>All account data</li>
                  <li>Your login credentials</li>
                </ul>
              </div>
              <button
                onClick={() => setShowConfirmation(true)}
                className="confirm-delete-button"
              >
                Yes, Delete My Account
              </button>
              <button onClick={handleClose} className="cancel-button">
                Cancel
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="delete-form">
              <div className="confirmation-section">
                <h3>Confirm Account Deletion</h3>
                <p>To confirm account deletion, please enter your password:</p>
              </div>

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register('password', {
                    required: 'Password is required',
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  className={errors.password ? 'error' : ''}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                {errors.password && (
                  <span className="field-error">{errors.password.message}</span>
                )}
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  onClick={() => setShowConfirmation(false)}
                  className="back-button"
                  disabled={isDeleting}
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="delete-account-button"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting Account...' : 'Delete Account'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteProfileModal;
