import React, { useEffect, useState } from 'react'
//redux
import { useSelector, useDispatch } from 'react-redux'
import { getClinicDistance } from '../../../redux/actions/clinics'

import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Container from '@material-ui/core/Container'
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import MapSearch from './MapSearch'
import MapResult from './MapResult'
import Banner from '../../../components/common/Banner';

import ClinicInfo from './ClinicInfo';

//banner Title
const bannerTitle = ['Medical Facility']

const links = [
  {
    to: '/',
    name: 'Home',
  },
  {
    to: '/insurance/clinic-finder',
    name: 'Clinic Finder',
  },
]

const useStyles = makeStyles((theme) => ({
  root: {},
  formControl: {
    minWidth: 200,
  },
  backdrop: {
    position: 'absolute',
    zIndex: theme.zIndex.drawer + 1
  }
}))

const ClinicFinder = () => {
  const classes = useStyles()
  const dispatch = useDispatch()
  const clinics = useSelector((state) => state.clinicReducer.clinics)
  const loading = useSelector(state => state.clinicReducer.loading);

  // const clinicError = useSelector(state => state.clinicReducer.error)

  const [places, setPlaces] = useState([])

  const [query, setQuery] = useState({
    postalCode: 'M2N 6N4',  //will be reset as user locations
    insCompany: '',
    radius: '',
    results: '',
  })

  const [enabled, setEnabled] = useState(true)
  const [text, setText] = useState('Loading ...')

  const [errors, setErrors] = useState({
    postalCode: ''
  })

  // Check Validation
  function validate() {
    let errors = {};
    let isValid = true;
    let regex = new RegExp(/^[ABCEGHJ-NPRSTVXY]\d[ABCEGHJ-NPRSTV-Z][ -]?\d[ABCEGHJ-NPRSTV-Z]\d$/i);

    if (!regex.test(query.postalCode)) {
      isValid = false;
      errors.postalCode = "error"
    }
    setErrors(errors);

    return isValid;
  }

  useEffect(() => {
    dispatch(getClinicDistance({ postalCode: query.postalCode }))// eslint-disable-next-line
  }, [dispatch])

  useEffect(() => {
    setPlaces(clinics)
    filters()// eslint-disable-next-line
  }, [clinics])

  useEffect(() => {
    setEnabled(validate())// eslint-disable-next-line
  }, [query.postalCode])

  const handleSearchQuery = (event) => {
    //user input fields getting value
    const name = event.target.name

    setQuery({
      ...query,
      [name]: event.target.value,
    })
  }

  function getClinicsQueryResult() {
    //search button onclick
    let { postalCode/*, insCompany, radius, results*/ } = query
    setText('No Medical facilities found.')
    if (validate() === true && clinics.filter(i => (i.user_location === postalCode)).length === 0) {
      dispatch(getClinicDistance({ postalCode: postalCode }))
    } else {
      // get all clinic distance by postal code
      //if (clinics.filter(i => (i.user_location === postalCode)).length === 0) { dispatch(getClinicDistance({ postalCode: postalCode })) }
      filters()
    }
  }

  function filters() {
    // filter
    const circle_radius = (query.radius === 'All' || query.radius === '') ? 999999 : parseInt(query.radius) * 1000
    const number_results = (query.results === 'All' || query.results === '') ? 999999 : parseInt(query.results)

    const list = (query.insCompany === 'All' || query.insCompany === '')
      ? sortByDistance(clinics).filter(i => (i.distance < circle_radius))
      : sortByDistance(clinics).filter(i => (i.company_id === query.insCompany && i.distance < circle_radius))

    //set places 
    setPlaces(list.filter((index) => (list.indexOf(index) < number_results)))
  }

  function sortByDistance(list) {//sorts the clinics by distance from least to greatest
    return list.sort((a, b) => (a.distance > b.distance) ? 1 : (b.distance > a.distance) ? -1 : 0)
  }

  /* dealing with clicking markers to dispaly the info window when clicked */
  const onChildClickCallback = (key) => {
    const index = places.findIndex((e) => e.clinic_id === key)
    let newArr = [...places]
    let place = { ...places[index] }
    place.show = !places[index].show
    newArr[index] = place
    setPlaces(newArr)
    return places[index]
  }

  const XOnClick = (key) => {
    const index = places.findIndex((e) => e.clinic_id === key)
    let newArr = [...places]
    let place = { ...places[index] }
    place.show = !places[index].show
    newArr[index] = place
    setPlaces(newArr)
    return places[index]
  }


  return (
    <>
      <Container>
        <Banner title={bannerTitle} links={links} />
        <Grid container justify="center">
          <Grid item xs={12}>
            <ClinicInfo />
          </Grid>
          <Grid item xs={12}>
            <Typography className={classes.label} variant="h2">
              Find any medical facility nearby your location
              {/* <Text tid={label} /> */}
            </Typography>
            <div style={{ position: 'relative' }}>
              <Backdrop className={classes.backdrop} open={loading}>
                <CircularProgress />
              </Backdrop>
              <MapSearch
                postalCode={query.postalCode}
                insCompany={query.insCompany}
                radius={query.radius}
                results={query.results}
                handleChange={handleSearchQuery}
                enabled={enabled}
                errors={errors}
                clickEvent={getClinicsQueryResult}
              />
              <Grid
                container
                className={classes.root}
                style={{ marginBottom: '5rem' }}
              >
                <MapResult
                  places={places}
                  text={text}
                  XOnClick={XOnClick}
                  onChildClickCallback={onChildClickCallback}
                />
              </Grid>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default (ClinicFinder)

// const ClinicFinder = () => {
//   const classes = useStyles()
//    const dispatch = useDispatch()
//    const clinics = useSelector((state) => state.clinicReducer.clinics)
//   // const clinicLoading = useSelector(state => state.clinicReducer.loading);
//   // const clinicError = useSelector(state => state.clinicReducer.error)

//   const [places, setPlaces] = useState([])
//   const [filtered, setFiltered] = useState([])
//   const [radius, setRadius] = useState()
//   const [isLoading, setIsLoading] = useState(false)//used to prevent errors by attempting to run only one iteration of the search for clinics near your location

//   const [query, setQuery] = useState({
//     postalCode: '',
//     healthStatus: '',
//     radius: '',
//     results: '',
//   })

//   const [userPosition, setUserPosition] = useState({
//     location_lat: '',
//     location_lng: '',
//   })

//   useEffect(() => {
//     dispatch(getClinic())
//   }, [dispatch])

//   useEffect(() => {//use places as the mutable element of clinics to be displayed on map and this function also updates places when clinics changes i think?
//     setPlaces(clinics)
//   }, [clinics])

//   useEffect(() => {//this function runs when the filtered array of clinics is updated. It sets it to be rendered as the locations on the map
//     if (filtered.length > 0) {//make sure there are locations in the array to be displayed
//       setFiltered(sortByDistance(filtered))
//       setPlaces(filtered)
//     }
//   }, [filtered])

//   function mapDistances() {
//     let temp = places
//     if (filtered.length > 0 || isLoading === false) {//prevents filtered array from duplicating elements of clinics if the function is called multiple times quickly and prevents useless api calls
//       return
//     } else {
//       temp.forEach((result) => {//get distances and map to every clinic object distance value
//         getDistanceToClinic(userPosition.location_lat, userPosition.location_lng, result.location_lat, result.location_lng).then(function (response) {//deal with promise
//           result.distance = response
//           if (+(result.distance).replace(/[^\d.-]/g, '') <= +radius.replace(/[^\d.-]/g, '')) {//filtering by the radius that the user inputted
//             setFiltered(oldFiltered => [...oldFiltered, result])
//           }
//         }
//         )
//       })
//     }
//     setIsLoading(false)
//   }



//   const didMountRef = useRef(false);//used to prevent initial useffect render
//   useEffect(() => {//make sure the distances are retrieved only after userPosition is retrieved 
//     if (didMountRef.current) {
//       mapDistances()
//     } else {
//       didMountRef.current = true
//     }// eslint-disable-next-line
//   }, [userPosition])

//   async function getDistanceToClinic(lat1, lng1, lat2, lng2) {//distance function
//     const Location1Str = lat1 + ',' + lng1
//     const Location2Str = lat2 + ',' + lng2

//     let ApiURL = 'https://maps.googleapis.com/maps/api/distancematrix/json?'

//     let params = `origins=${Location1Str}&destinations=${Location2Str}&key=AIzaSyAeH7lcR4BJPZYHfojDdxuV2f5sk574Jq0` // you need to get a key
//     let finalApiURL = `${ApiURL}${encodeURI(params)}`

//     let fetchResult = await fetch(finalApiURL) // call API //might not need no cors
//     let Result = await fetchResult.json() // extract json
//     return Result.rows[0].elements[0].distance.text
//   }

//   const handleSearchQuery = (event) => {//user input fields getting value
//     const name = event.target.name
//     setPlaces(clinics) //set this here if you want the map to reset everytime user input is changed or set it in getClinicQueryResult to reset it everytime search is clicked
//     setFiltered([])
//     setQuery({
//       ...query,
//       [name]: event.target.value,
//     })
//   }

//   function getClinicsQueryResult() {//search button onclick
//     let { postalCode, healthStatus, radius, results } = query
//     setIsLoading(true)
//     setRadius(radius)
//     //maybe prevent multiple qucik attempts to get lat long of zipcode as it is not needed ie if postalcode is the same dont run the function
//     getLatLngByZipcode(postalCode)//get user inputted postal code and set it as position
//   }

//   /* geocode zipcode from query into lat and long coords and setting it to user position*/
//   function getLatLngByZipcode(zipcode) {
//     var geocoder = new window.google.maps.Geocoder();
//     var address = zipcode;
//     geocoder.geocode({ 'address': 'zipcode ' + address }, function (results, status) {
//       if (status === window.google.maps.GeocoderStatus.OK) {
//         setUserPosition({ location_lat: results[0].geometry.location.lat(), location_lng: results[0].geometry.location.lng() })
//       } else {
//         console.log('error')
//       }
//     });
//   }

//   /* dealing with clicking markers to dispaly the info window when clicked */
//   const onChildClickCallback = (key) => {
//     const index = places.findIndex((e) => e.clinic_id === key)
//     let newArr = [...places]
//     let place = { ...places[index] }
//     place.show = !places[index].show
//     newArr[index] = place
//     setPlaces(newArr)
//     return places[index]
//   }

//   return (
//     <>
//       <Container>
//       <Banner title={bannerTitle} links={links} />
//         <Grid container justify="center">
//           <Grid item xs={12}>
//             <ClinicInfo/>
//           </Grid>
//           <Grid item xs={12}>
//           <Typography className={classes.label} variant="h2">
//           Find any medical facility nearby your location
//           {/* <Text tid={label} /> */}
//         </Typography>
//         <MapSearch
//           postalCode={query.postalCode}
//           healthStatus={query.healthStatus}
//           radius={query.radius}
//           results={query.results}
//           handleChange={handleSearchQuery}
//           clickEvent={getClinicsQueryResult}
//         />
//         <Grid
//           container
//           className={classes.root}
//           style={{ marginBottom: '5rem' }}
//         >
//           {places && places.length > 0 && (
//             <MapResult

//               places={places}
//               onChildClickCallback={onChildClickCallback}
//             />
//           )}
//         </Grid>
//           </Grid>
//         </Grid>
//       </Container>
//     </>
//   )
// }

// export default (ClinicFinder)



