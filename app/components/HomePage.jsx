var React = require('react');
var JumboTron = require('JumboTron');
var {connect} = require('react-redux');
var actions = require('actions');

var HomePage = React.createClass({
  render:function(){
    return (
      <div className="container">
        <JumboTron/>
      </div>
    );
  }
});

export default connect()(HomePage)
