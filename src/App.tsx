import React from 'react';
import styles from './App.module.scss';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';

// import Input from './components/input/input';
const Input = React.lazy(() => import('./components/input/input'));


function App() {
  return (
    <React.Suspense fallback={<div></div>}>
      <Router>
        <Switch>
          <Route path="/input" component={Input} />
          <Redirect to="/input"/>
        </Switch>
      </Router>
    </React.Suspense>
  );
}

export default App;
