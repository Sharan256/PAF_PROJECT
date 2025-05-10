import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import './WorkoutStatus.css';
import { FaRunning, FaDumbbell, FaCalendarAlt } from 'react-icons/fa';
import { GiPushups } from 'react-icons/gi';
import { MdEdit, MdDelete } from 'react-icons/md';

const WorkoutStatus = () => {
  const [workouts, setWorkouts] = useState([]);
  const [formData, setFormData] = useState({
    distance: '',
    pushUps: '',
    weightLifting: '',
    date: format(new Date(), 'yyyy-MM-dd')
  });
  const [editingWorkout, setEditingWorkout] = useState(null);

  const validateForm = () => {
    const distance = parseFloat(formData.distance);
    const pushUps = parseInt(formData.pushUps);
    const weightLifting = parseFloat(formData.weightLifting);
    const selectedDate = new Date(formData.date);
    const today = new Date();

    if (distance < 0 || distance > 500) {
      alert('Distance must be between 0 and 500');
      return false;
    }
    if (pushUps < 0) {
      alert('Push-ups cannot be negative');
      return false;
    }
    if (weightLifting < 0) {
      alert('Weight lifting cannot be negative');
      return false;
    }
    if (selectedDate > today) {
      alert('Cannot select future dates');
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newWorkout = {
      id: Date.now(),
      ...formData,
      date: formData.date
    };

    if (editingWorkout) {
      setWorkouts(workouts.map(w => 
        w.id === editingWorkout.id ? newWorkout : w
      ));
      setEditingWorkout(null);
    } else {
      setWorkouts([newWorkout, ...workouts]);
    }

    setFormData({
      distance: '',
      pushUps: '',
      weightLifting: '',
      date: format(new Date(), 'yyyy-MM-dd')
    });
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    setFormData({
      distance: workout.distance,
      pushUps: workout.pushUps,
      weightLifting: workout.weightLifting,
      date: workout.date
    });
  };

  const handleDelete = (id) => {
    setWorkouts(workouts.filter(w => w.id !== id));
  };

  return (
    <div className="workout-status-container">
      <h2 className="workout-title">Workout Status</h2>
      
      <form onSubmit={handleSubmit} className="workout-form">
        <div className="form-grid">
          <div className="form-group">
            <label>
              <FaRunning className="input-icon" />
              Distance Run (km)
            </label>
            <input
              type="number"
              value={formData.distance}
              onChange={(e) => setFormData({...formData, distance: e.target.value})}
              min="0"
              max="500"
              step="0.1"
              required
              placeholder="Enter distance"
            />
          </div>

          <div className="form-group">
            <label>
              <GiPushups className="input-icon" />
              Push-ups
            </label>
            <input
              type="number"
              value={formData.pushUps}
              onChange={(e) => setFormData({...formData, pushUps: e.target.value})}
              min="0"
              required
              placeholder="Enter push-ups count"
            />
          </div>

          <div className="form-group">
            <label>
              <FaDumbbell className="input-icon" />
              Weight Lifting (kg)
            </label>
            <input
              type="number"
              value={formData.weightLifting}
              onChange={(e) => setFormData({...formData, weightLifting: e.target.value})}
              min="0"
              step="0.1"
              required
              placeholder="Enter weight"
            />
          </div>

          <div className="form-group">
            <label>
              <FaCalendarAlt className="input-icon" />
              Date
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({...formData, date: e.target.value})}
              max={format(new Date(), 'yyyy-MM-dd')}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">
          {editingWorkout ? 'Update Workout' : 'Add Workout'}
        </button>
      </form>

      <div className="workouts-list">
        <h3 className="recent-workouts-title">Recent Workouts</h3>
        {workouts.map(workout => (
          <div key={workout.id} className="workout-item">
            <div className="workout-details">
              <div className="workout-date">
                <FaCalendarAlt className="workout-icon" />
                <span>{workout.date}</span>
              </div>
              <div className="workout-metrics">
                <div className="metric">
                  <FaRunning className="metric-icon" />
                  <span>{workout.distance} km</span>
                </div>
                <div className="metric">
                  <GiPushups className="metric-icon" />
                  <span>{workout.pushUps} push-ups</span>
                </div>
                <div className="metric">
                  <FaDumbbell className="metric-icon" />
                  <span>{workout.weightLifting} kg</span>
                </div>
              </div>
            </div>
            <div className="workout-actions">
              <button onClick={() => handleEdit(workout)} className="edit-btn">
                <MdEdit className="action-icon" />
                Edit
              </button>
              <button onClick={() => handleDelete(workout.id)} className="delete-btn">
                <MdDelete className="action-icon" />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutStatus; 