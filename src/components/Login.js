import React from 'react';
import '../App.css';
import axios from 'axios';
import Alert from 'react-s-alert';
import { GoogleLogin } from 'react-google-login';
import { Redirect } from 'react-router-dom';

class Login extends React.Component {
    constructor() {
		super();
		this.state = {
			email: '',
			password: '',
			error: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	responseGoogle(response){
		console.log(response)
		console.log(response.profileObj.name)
		console.log(response.profileObj.email)
		console.log(response.profileObj.imageUrl);
	
	  }
    
    handleChange(event) {
		const name = event.target.name;
		this.setState({
			[name]: event.target.value
		});
    }
    
    handleSubmit(event) {
		event.preventDefault();
		axios.post('http://localhost:8000/api/signin', {
			email: this.state.email,
			password: this.state.password
		})
		.then((response) => {
			this.setState({ error: '' });
			const token = response.data.token;
			this.props.authenticate(token);
			Alert.success("You're successfully logged in!");
			this.props.history.push("/login");
		})
		.catch((error) => {
			console.log(error);
			if (error.response.status === 401) {
				this.setState({ error: 'Username or password not recognised.' });
			}
		});
    }
    
    render() {
		if (this.props.isAuthenticated && this.props.location.state !== undefined) {
			return (
				<Redirect to={this.props.location.state.from} />
			);
		}
		return (
			<div  className="login-container">
                <div className="login-content">
				<h1>Inicio de Sesión</h1>
				{this.state.error !== '' ?
					<p className="text-danger">{this.state.error}</p>
					:
					null
				}
				{this.props.isAuthenticated ?
					<p className="text-info">Ya iniciaste Sesión previamente.</p>
					:
					<form onSubmit={this.handleSubmit}>
						<div className='form-group'>
							<input
								name='email'
								type='email'
								className='form-control' 
								placeholder='Email'
								value={this.state.email}
								onChange={this.handleChange} />
						</div>
						<div className='form-group'>
							<input 
								name='password'
								type='password' 
								className='form-control' 
								placeholder='Contraseña'
								value={this.state.password}
								onChange={this.handleChange} />
						</div>
						<div className="form-item">
							<input type='submit' className='btn btn-block btn-primary' value='Iniciar Sesión' />
						</div>
						<hr></hr>
						<GoogleLogin
							clientId="526770419242-9j8gt35vmf5cl8t65ui0gdhsnn87ekkl.apps.googleusercontent.com"
							buttonText="Ingresar con Google"
							onSuccess={this.responseGoogle}
							onFailure={this.responseGoogle}
							cookiePolicy={'single_host_origin'}
						/>
					</form>	
				}
                </div>
			</div>
		);
	}
}

export default Login;