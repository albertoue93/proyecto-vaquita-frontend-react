import React from 'react';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Switch, NavLink, Link, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Login from './components/Login';
import Finca from './components/fincas/index'
import Animal from './components/animales/index'
import axios from 'axios';
import * as PropTypes from 'prop-types'

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			isAuthenticated: false,
			token: null
		};
		this.authenticate = this.authenticate.bind(this);
		this.logout = this.logout.bind(this);
		this.refresh = this.refresh.bind(this);
    }
    
    componentDidMount() {
      const lsToken = localStorage.getItem('jwt'); 
      if (lsToken) {
        this.authenticate(lsToken);
      } 
    }

	authenticate(token) {
		this.setState({
			isAuthenticated: true,
			token: token
		});
		localStorage.setItem('jwt', token);
	}

	logout = async() => {
		this.setState({
			isAuthenticated: false,
			token: null,
    });
    localStorage.removeItem('jwt');
    Alert.success("You're safely logged out!");
	}

	refresh() {
		return axios.get('http://localhost:8000/api/refreshToken', {
			headers: { 'Authorization': 'Bearer ' + this.state.token }
		})
		.then((response) => {
			const token = response.data.token;
			this.authenticate(token);
		})
		.catch((error) => {
			console.log('Error!', error);
		});
	}
    render() {
      return (
        <HashRouter>
          <div>
            <Menu isAuthenticated={this.state.isAuthenticated} logout={this.logout} />
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/login' render={(props) => <Login authenticate={this.authenticate} isAuthenticated={this.state.isAuthenticated} {...props} />} />
              <PrivateRoute exact path='/finca' component={Finca} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
              <PrivateRoute exact path='/animal' component={Animal} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
            </Switch>
          </div>
        </HashRouter>
      );
    }
  } 

    const PrivateRoute = ({ component: Component, isAuthenticated, token, ...rest }) => (
        <Route {...rest} render={props => (
            isAuthenticated ? (
                <Component {...props} {...rest} token={token} isAuthenticated={isAuthenticated} />
            ) : (
                <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                }} />
            )
        )} />
    );

    const Menu = (props) => (
      <nav className="navbar navbar-expand-md navbar-dark bg-dark sticky-top">
        <button className="navbar-toggler" data-toggle="collapse" data-target="#collapse_target">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="collapse_target">
          <div className="pr-sm-5  navbar-text, text-warning">
              <Link className="nav-link" to='/'>Inicio</Link>
          </div>
          <ul className="navbar-nav">
            {
            props.isAuthenticated ?
            <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" to="/finca">
                        Fincas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/animal">
                        Animales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                        Apartos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
                        Historicos
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" href="#" onClick={() => props.logout()}>
                        Cerrar Sesión
                  </Link>
                </li>
              </ul>
                :
              <ul className="navbar-nav">
                <li className="nav-item">
                  <NavLink className="nav-link" exact activeClassName="active" to="/login">
                    Inicio de Sesión
                    </NavLink>
                </li>	
              </ul>
            }
          </ul>
        </div>
        <Alert stack={{limit: 3}} 
          timeout = {3000}
          position='top-right' effect='slide' offset={65} />
      </nav>
    );
App.propTypes = {
  isAuthenticated: PropTypes.bool
}
export default App;