var React = require('react');
var {connect} = require('react-redux');
var actions = require('actions');


export var GoogleMapPlanner = React.createClass({
  //Only allow component to update once
  shouldComponentUpdate:function(){
    return false;
  },

  componentDidMount:function(){
    var{journeySchedule, geolocation} = this.props;


      this.map = new google.maps.Map(this.refs.mapPlanner,{
        center:geolocation,
        zoom:12
      });


    if(journeySchedule.length > 0){
      this.calculateRoutes(journeySchedule);
      this.calculateDistance(journeySchedule);
    };
  },

  //only allow update when props recieved
  componentWillReceiveProps:function(nextProp){
    if(nextProp.user._id){
        this.calculateRoutes(nextProp.journeySchedule);
        this.calculateDistance(nextProp.journeySchedule);
    }else{
        this.calculateRoutes(nextProp.tempJourney[nextProp.currentDay-1].schedule);
        this.calculateDistance(nextProp.tempJourney[nextProp.currentDay-1].schedule);
    }
  },


 calculateRoutes:function(schedule){

      var directionsService = new google.maps.DirectionsService;
      var directionsDisplay = new google.maps.DirectionsRenderer;
      var waypts = [] ;
      var originpts;
      var endpts;

      for( var i = 0 ; i< schedule.length ; i++){
          var lats    = schedule[i].location.coordinate.latitude;
          var longs   = schedule[i].location.coordinate.longitude;
          if( i == 0){
              originpts = ""+lats+","+longs+"" ;
         }else if( i == schedule.length - 1){
             endpts= ""+lats+","+longs+"";
             this.displayRoutes(directionsService,directionsDisplay,originpts,waypts,endpts);
          }else{
               waypts.push({location:""+lats+","+longs+"" , stopover: true});
          }
      };
  },

  displayRoutes:function(directionsService,directionsDisplay,originpts,waypts,endpts){
    var reference = this.refs
    directionsService.route({
          origin: originpts,
          waypoints:waypts,
          destination: endpts,
          travelMode: 'DRIVING'
        }, function(response, status) {
          if (status === 'OK') {
           var map ="";
           map =new google.maps.Map(reference.mapPlanner,{
                  center: {lat: -34.397, lng: 150.644},
                  zoom: 10
                    });
             directionsDisplay.setDirections(response);
             directionsDisplay.setMap(map);
             //remove current direction from direction's ref element
             //and replace with new directions
            reference.directions.innerHTML="";
            directionsDisplay.setPanel(reference.directions);
          } else {
            console.log('Directions request failed due to '+ status);
          }
        }
    );
  },

  calculateDistance:function(schedule){
    var {dispatch} = this.props
    var origin=[];//store all the LatLng of locations in odd index
    var destination=[];//store all the LatLng of locations in even index
    var service = new google.maps.DistanceMatrixService();//google maps distance API
    if(schedule.length > 0){
        schedule.map(function(schedule){
          var coord = schedule.location.coordinate;
          var longlat= ""+coord.latitude+","+coord.longitude+""
            origin.push(longlat);
            destination.push(longlat);
        });

        service.getDistanceMatrix(
          {
            origins: origin,
            destinations: destination,
            travelMode: 'DRIVING',
            unitSystem: google.maps.UnitSystem.IMPERIAL,
          }, function(response,status){
            //process recieved Data
            if(status=="OK"){
                var distancesArr = [];
                for(var i = 0; i<schedule.length-1; i++){
                  var distanceTravel = response.rows[i].elements[i+ 1].distance.text;
                  var durationTravel = response.rows[i].elements[i+ 1].duration.text;
                  distancesArr.push({
                                      distance: distanceTravel,
                                      duration: durationTravel
                                    });
                 };
                dispatch(actions.CurrentJourneyDistance(distancesArr));
            }else{
               console.log(status);
            }
          }
        );
      }
  },

  render:function(){
    return(
      <div>
        <div id="mapPlanner" ref="mapPlanner"></div>
          <div>
            <div>
              <button className="btn panel-btn btn-primary btn-block"
                type="button" data-toggle="collapse" data-target="#collapseDirections"
                aria-expanded="true" >
                Show Directions
              </button>
              <div className="collapse in"  id="collapseDirections">
                  <div id="directions" ref="directions"></div>
                </div>
              </div>
            </div>
      </div>
    )
  }
});

export default connect(
  (state)=>{
    return{
      journeySchedule:state.JourneySchedule,
      journeyDistances:state.CurrentJourneyDistance,
      currentDay:state.CurrentJourneyDay,
      tempJourney:state.TempJourney,
      user:state.User,
      geolocation:state.GeoLocation
    }
  }
)(GoogleMapPlanner);
