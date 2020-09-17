import React from 'react';
import styles from './App.module.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// import Input from './components/input/input';
const Input = React.lazy(() => import('./page/input/input-page'));
const Select = React.lazy(() => import('./page/select/select-page'));
const Calendar = React.lazy(() => import('./page/calendar/calendar-page'));


function App() {
  return (
    <React.Suspense fallback={<div></div>}>
      <Router>
        <Switch>
          <Route path="/input" component={Input} />
          <Route path="/select" component={Select} />
          <Route path="/calendar" component={Calendar} />
          <Redirect to="/input"/>
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;
