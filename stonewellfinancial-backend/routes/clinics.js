require('dotenv')
const express = require('express')
const router = express.Router()
const pool = require('../db')
const fetch = require('node-fetch')

//
GOOGLE_API_KEY = process.env.GOOGLE_MAP_API_KEY

// GET all clinic
router.get('/', async (req, res) => {
  try {
    console.log('clinics.js get /clinic')
    let sql = `select c.clinic_id, c.company_id, c.name, c.phone, c.languages , c.description ,
                      a.street, a.suite_no, a.city, a.province, a.postalcode, a.country, 
                      a.location_lat, a.location_lng
                from clinic c 
                join address a on c.clinic_id = a.source_id and a.source_type ='clinic'
                where c.is_active = true
                limit 5
                `
    const result = await pool.query(sql)        
    if (result.rowCount === 0) {
      res.status(404).send({ error: 'No data found' })
    } 
    else {   
        // clinic_location = result.rows 
        for (const i in result.rows) { 

          if ((!result.rows[i].location_lat) || (!result.rows[i].location_lng))
          { 
            // get location (lat, lan)
            const clinic_loc_latlng =  await getLocation(result.rows[i].postalcode)
            result.rows[i].location_lat = clinic_loc_latlng[0]
            result.rows[i].location_lng = clinic_loc_latlng[1]
             //update location (Latitude, Longitude)
            updateLocation(result.rows[i].clinic_id, result.rows[i].location_lat, result.rows[i].location_lng )
          }

      }

        return res.status(200).json({ data: result })
    }

  } catch (err) {
    console.error(err.message)
  }
})


// Get distance to clinic By postal Code
router.get('/distance/postalCode=:postalCode', async (req, res) => {
  try {
    console.log('clinics.js get /clinic/distance')

    let sql = `select c.clinic_id, c.company_id, c.name, c.phone, c.languages , c.description ,
                      a.street, a.suite_no, a.city, a.province, a.postalcode, a.country, 
                      a.location_lat, a.location_lng, '' user_location, 0 distance
                from clinic c 
                join address a on c.clinic_id = a.source_id and a.source_type ='clinic'
                where c.is_active = true
                `
    const result = await pool.query(sql)        
    if (result.rowCount === 0) {
      res.status(404).send({ error: 'No data found' })
    } 
    else {   

        // get User Location(postal_code)
        const user_loc_latlng =  await getLocation(req.params.postalCode)

        // clinic_location = result.rows 
        for (const i in result.rows) { 

          if ((!result.rows[i].location_lat) || (!result.rows[i].location_lng))
          { 
            // get location (lat, lan)
            const clinic_loc_latlng =  await getLocation(result.rows[i].postalcode)
            result.rows[i].location_lat = clinic_loc_latlng[0]
            result.rows[i].location_lng = clinic_loc_latlng[1]
             //update location (Latitude, Longitude)
            updateLocation(result.rows[i].clinic_id, result.rows[i].location_lat, result.rows[i].location_lng )
          }
          
          //set user_location
          result.rows[i].user_location = req.params.postalCode
          
          // getDistanceOneToOne (lat1, lng1, lat2, lng2)
          result.rows[i].distance = await getDistanceToClinic(result.rows[i].location_lat, result.rows[i].location_lng, user_loc_latlng[0], user_loc_latlng[1])                    
          
    }

        return res.status(200).json({ data: result })

        
    }

  } catch (err) {
    console.error(err.message)
  }
})


// Get latitude, longitude using Goole MAP API
async function getLocation(postal_code) {
  // const GOOGLE_API_KEY = 'AIzaSyAeH7lcR4BJPZYHfojDdxuV2f5sk574Jq0'
  let ApiURL = `https://maps.googleapis.com/maps/api/geocode/json?`
  let params = `key=${GOOGLE_API_KEY}&components=country:CA|postal_code:${postal_code}`;

  let finalApiURL = `${ApiURL}${encodeURI(params)}`;
  let fetchResult =  await fetch(finalApiURL); // call API

  let Result =  await fetchResult.json(); // extract json
  let location_lat = Result.results[0].geometry.location.lat
  let location_lng = Result.results[0].geometry.location.lng
  return [location_lat, location_lng]
}


//  Update Location
async function updateLocation(clinicID, lat, lng){
  return new Promise((resolve, reject) => {
          //update location (Latitude, Longitude)
          let sql = `update address
                        set location_lat = ${lat}, location_lng = ${lng}
                      where source_id = '${clinicID}' RETURNING source_id, location_lat, location_lng `        

          pool.query(sql).then((rows) => {
                  resolve(rows)
          }).catch((error) => {
              reject(error)
          })
  })
}

// calculate distance using Goole MAP API
async function getDistanceToClinic(lat1, lng1, lat2, lng2) {
  const Location1Str = lat1 + "," + lng1;
  const Location2Str = lat2 + "," + lng2;

  let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

  let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${GOOGLE_API_KEY}`; // you need to get a key

  let finalApiURL = `${ApiURL}${encodeURI(params)}`;

  let fetchResult =  await fetch(finalApiURL); // call API
  let Result =  await fetchResult.json(); // extract json

  return Result.rows[0].elements[0].distance.value;
}

module.exports = router
