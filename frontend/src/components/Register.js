import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import './Auth.css';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      setIsLoading(true);
      setError('');
      
      const result = await registerUser(data);
      
      if (result.success) {
        navigate('/profile');
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join our recruitment platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="profile.firstName">First Name</label>
              <input
                type="text"
                id="profile.firstName"
                {...register('profile.firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 1,
                    message: 'First name is required'
                  },
                  maxLength: {
                    value: 50,
                    message: 'First name cannot exceed 50 characters'
                  }
                })}
                className={errors.profile?.firstName ? 'error' : ''}
                placeholder="Enter your first name"
              />
              {errors.profile?.firstName && (
                <span className="field-error">{errors.profile.firstName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="profile.lastName">Last Name</label>
              <input
                type="text"
                id="profile.lastName"
                {...register('profile.lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 1,
                    message: 'Last name is required'
                  },
                  maxLength: {
                    value: 50,
                    message: 'Last name cannot exceed 50 characters'
                  }
                })}
                className={errors.profile?.lastName ? 'error' : ''}
                placeholder="Enter your last name"
              />
              {errors.profile?.lastName && (
                <span className="field-error">{errors.profile.lastName.message}</span>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address'
                }
              })}
              className={errors.email ? 'error' : ''}
              placeholder="Enter your email"
            />
            {errors.email && (
              <span className="field-error">{errors.email.message}</span>
            )}
          </div>

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
                },
                pattern: {
                  value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
                  message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
                }
              })}
              className={errors.password ? 'error' : ''}
              placeholder="Create a password"
            />
            {errors.password && (
              <span className="field-error">{errors.password.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              {...register('confirmPassword', {
                required: 'Please confirm your password',
                validate: value => value === password || 'Passwords do not match'
              })}
              className={errors.confirmPassword ? 'error' : ''}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="field-error">{errors.confirmPassword.message}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="profile.phone">Phone Number (Optional)</label>
            <input
              type="tel"
              id="profile.phone"
              {...register('profile.phone', {
                pattern: {
                  value: /^[\+]?[1-9][\d]{0,15}$/,
                  message: 'Please enter a valid phone number'
                }
              })}
              className={errors.profile?.phone ? 'error' : ''}
              placeholder="Enter your phone number"
            />
            {errors.profile?.phone && (
              <span className="field-error">{errors.profile.phone.message}</span>
            )}
          </div>

          <button
            type="submit"
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="auth-link">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
