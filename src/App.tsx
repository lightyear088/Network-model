import { useSelector } from 'react-redux';
import './App.css'

import NetworkModelCalculator from './components/NetworkModel/NetworkModel'
import CSVUploader from './components/parseCSV/CSVUploader'
import { selectActivities } from './components/NetworkModel/slice/NetworkModelSlice';
import React from 'react';

const App = () => {
  const activities = useSelector(selectActivities);
  return (
    <>

      {activities.length == 0 ? <CSVUploader></CSVUploader> : <NetworkModelCalculator></NetworkModelCalculator>}
    </>
  )
}

export default App
