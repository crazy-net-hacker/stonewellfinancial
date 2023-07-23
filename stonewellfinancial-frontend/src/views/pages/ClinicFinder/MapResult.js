import React from 'react'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'
import { Room } from '@material-ui/icons'
import GoogleMap from 'google-map-react'
import CloseIcon from '@material-ui/icons/Close';
const useStyles = makeStyles((theme) => ({
  root: {},
}))


export default function MapResult(props) { 
  const places = props.places
  const classes = useStyles()
  const defaultProps = {
    center: {
      lat: 43.7568,
      lng: -79.4065,
    },
    zoom: 10,
  }
  return (
    <>
      <Grid
        item
        xs={12}
        sm={4}
        style={{ height: 500, overflowY: 'auto', overflowX: 'hidden' }}
      >
        {places.length > 0 ?
          places.map((place) => (
            <div
              key={place.clinic_id}
              onClick={() => props.onChildClickCallback(place.clinic_id)}
              style={{
                borderBottom: '1px solid rgb(218 218 218)',
                padding: '16px 8px 8px',
                cursor: 'pointer'
              }}
            >
              <div style={{ display: 'flex' }}>
                <div>
                  <Room
                    style={{
                      fontSize: '2.3rem',
                      color: place.show ? '#8cc63f' : '#2a2e71',
                    }}
                  />
                </div>
                <div
                  style={{
                    textAlign: 'left',
                    lineHeight: '1',
                    //width: '100%',
                    padding: '0 8px',
                  }}
                >
                  <p style={{ fontSize: '1rem' }}>
                    <strong>{place.name}</strong>
                  </p>
                  <p className={classes.address} style={{ lineHeight: 1 }}>
                    {place.suite_no} {place.street}
                  </p>
                  <p className={classes.address} style={{ lineHeight: 1 }}>
                    {place.postalcode} {place.city}
                  </p>
                  {<p style={{ fontSize: '1.15rem' }}>
                    {place.distance ? Math.round((place.distance / 1000) * 10) / 10 + ' km' : null}
                  </p>}
                </div>
              </div>
            </div>
          ))
          :
          <div
            style={{
              // borderBottom: '1px solid rgb(218 218 218)',
              padding: '16px 8px 8px',
            }}
          >
            <p style={{ fontSize: '1rem' }}> {props.text} </p>
          </div>
        }
      </Grid>
      <Grid item xs={12} sm={8}>
        <div className={classes.paper} style={{ height: 500 }}>
          <GoogleMap
            defaultZoom={defaultProps.zoom}
            defaultCenter={defaultProps.center}
            bootstrapURLKeys={{
              key: process.env.REACT_APP_GOOGLE_MAP_API_KEY
            }}
            onChildClick={props.onChildClickCallback}

          >

            {places.length > 0 &&
              places.map((place) => (
                <Marker
                  key={place.clinic_id}
                  lat={place.location_lat}
                  lng={place.location_lng}
                  show={place.show}
                  place={place}
                  XOnClick={props.XOnClick}
                />
              ))}
          </GoogleMap>
        </div>
      </Grid>
    </>
  )
}
// InfoWindow component
const InfoWindow = (props) => {
  const { place } = props
  const infoWindowStyle = {
    position: 'relative',
    bottom: '60px',
    left: '25px',
    width: 220,
    backgroundColor: 'white',
    boxShadow: '0 2px 7px 1px rgba(0, 0, 0, 0.3)',
    padding: 10,
    fontSize: 14,
    zIndex: 100,
    borderRadius: 5,
  }

  return (
    <div style={infoWindowStyle}>
      <div
        className="testt"
        style={{
          fontSize: 16,
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{place.name}</span>
        <CloseIcon style={{ fontSize: 'small', float: 'right', cursor: 'pointer' }} onClick={() => props.XOnClick(place.clinic_id)} />
      </div>
      <div style={{ margin: '6px 0' }}>
        <span style={{ color: 'grey' }}>{place.phone[0]}</span>
      </div>
      <div style={{ color: 'grey', whiteSpace: 'pre-wrap' }}>
        {place.street} {place.province} {place.postalcode} {'\n' + Math.round((place.distance / 1000) * 10) / 10 + ' km'}
      </div>
    </div>
  )
}

// Marker component
const Marker = ({ XOnClick, show, place }) => {
  const markerStyle = {
    color: show ? '#8cc63f' : '#2a2e71',
    cursor: 'pointer',
  }

  return (
    <>
      <div style={markerStyle}>
        {/* <div> */}
        <Room
          style={{
            fontSize: '2rem',
            zIndex: 99,
            position: 'absolute',
            bottom: '-15px',
            right: '-25px',
          }}
        />
      </div>
      {show && <InfoWindow XOnClick={XOnClick} place={place} />}
    </>
  )
}
