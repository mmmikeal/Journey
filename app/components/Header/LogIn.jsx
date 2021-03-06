
const React = require('react'),
  {connect} = require('react-redux'),
  actions = require('actions'),
  {Link} = require('react-router');


var LogIn = React.createClass({
  logout:	function(){
    var {dispatch} = this.props;
    $.ajax({
      type:'GET',
      url:'auth/logout',
      success:function(response){
        dispatch(actions.loggedInUser(''));
      }
    });
  },
  render: function () {
    var {User} = this.props;
    if(!User){
      return(
        <form className='navbar-form navbar-right' role='search' action='/auth/login' method='POST'>
          <div className='login-form form-group'>
            <input type='text' className='loginInput' name='username' placeholder='Username'/>
          </div>
          <div className='login-form form-group'>
            <input type='password' className='loginInput' name='password' placeholder='Password'/>
          </div>
          <button type='submit' className='btn btn-nav'>Login</button>
          <Link to='/SignUp' activeClassName='active-link'>
           Sign Up
          </Link>
        </form>
      );
    }else{
      return(
        <h4 className='navbar-form navbar-right'>
          <p className='navbar-text navbar-right'>You are logged in as
           <a id='username' href='/myprofile'> {User} </a>
            <a onClick={()=>{this.logout();}}
             className='glyphicon glyphicon-log-out'>
            </a>
          </p>
        </h4>
      );
    }
  }
});

export default connect(
  (state)=>{
    return{
      User:state.User.username
    };
  }
)(LogIn);
