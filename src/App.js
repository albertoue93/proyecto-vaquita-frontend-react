import React from 'react';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Switch,Link, Redirect } from 'react-router-dom';
import Home from './components/Home';
import Clients from './components/Home';
import Login from './components/Login';
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

	logout() {
		this.setState({
			isAuthenticated: false,
			token: null
    });
    localStorage.removeItem('jwt');
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
						<PrivateRoute exact path='/' component={Clients} isAuthenticated={this.state.isAuthenticated} token={this.state.token} refresh={this.refresh} />
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
                  <Link className="nav-link" to="/">
                        Fincas
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/">
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
                  <Link className="nav-link" href="#" onClick={props.logout}>
                        Cerrar Sesión
                  </Link>
                </li>
              </ul>
                :
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link" exact activeClassName="active" to="/login">
                    Inicio de Sesión
                    </Link>
                </li>	
              </ul>
            }
          </ul>
        </div>
      </nav>
    );
App.propTypes = {
  isAuthenticated: PropTypes.bool
}
export default App;