import React, { useState } from 'react';

// form and validation
import { Formik, Form, /*ErrorMessage,*/  FieldArray } from 'formik'
// import * as Yup from 'yup'
// import * as Validation from '../../../Validation'

// core components
import { Card, CardContent } from '@material-ui/core'
import { Typography, Grid } from '@material-ui/core'
import { Text } from '../../../../components/common/LanguageProvider'

// common components
// import { RegularTextField, SelectTextField } from '../../../../components/common/CustomTextFields/TextField'
import Button from '../../../../components/common/CustomButtons/Button'
import AddFamilyModal from './AddFamilyModal'

// style
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';

// icons
import PeopleIcon from '@mui/icons-material/People';

const useStyles = makeStyles(dashboardStyles)

export const FamilyMembers = ({data}) => {

  const classes = useStyles();

  const initialValues = {
    familyMembers: [
      {
        lastName: 'Jin',
        firstName: 'Cubby',
        birthDate: 'Oct 29, 2021',
        gender: 'Male',
        statusCanada: 'Permanent Resident',
        ghip: 'Yes',
      },
      {
        lastName: 'Jin',
        firstName: 'Sujung',
        birthDate: 'Jan 01, 1990',
        gender: 'Female',
        statusCanada: 'Permanent Resident',
        ghip: 'No',
      }
    ]
  }

   // Edit Profile modal
   const [addFamily, setAddFamily] = useState([]);
   const [openAddFamily, setOpenAddFamily] = useState(false)

   const handleAddFamily = (familyMembers) => {
    //  applications.filter(f => (f.insuredpersons.insuredPersonID === person.insuredPersonID))
    familyMembers.push({
        lastName: '',
        firstName: '',
        birthDate: '',
        gender: '',
        statusCanada: '',
        ghip: '',
    })
    setAddFamily(familyMembers)
    console.log(addFamily)
    setOpenAddFamily(true)
  }
  
  // const validationSchema = {
  //   lastName: Validation.validRequiredField(),
  //   firstName: Validation.validRequiredField(),
  //   birthDate: Validation.validRequiredDateField(),
  //   gender: Validation.validRequiredField(),
  //   relationship: Validation.validRequiredField(),
  //   schoolName: Validation.validRequiredField()
  // }

  // console.log(data)

  return (
    <div style={{ margin:'2vh 0'}}>
      <Card variant='outlined'>
        <CardContent>
          <Formik
              initialValues={initialValues}
              // validationSchema={validationSchema}
              onSubmit={(values) => {
                // handleSubmit(values)
                console.log(values)
              }}>
              {({ values, handleChange }) => (
              <Form>
                <FieldArray
                  name="familyMembers"
                  render={({ push, remove }) => (
                <Grid container spacing={2}>

                  <Grid item container style={{ paddingBottom:'15px', alignSelf: 'center' }}>
                      <Grid item xs={10} style={{ alignSelf: 'center' }}>
                        <Typography className={classes.cardBoxTitle}>
                          {/* <Text tid={'Vendor.StartApplication'} /> */}
                          <PeopleIcon/>
                          <span style={{ marginLeft:'5px' }}>
                            <Text tid={'Dashboard.Family'} />
                          </span>
                        </Typography>
                      </Grid>
                      <Grid item xs={2} style={{ textAlign:'right' }}>
                        <Button 
                          color='primary' 
                          size='md' 
                          onClick={() => handleAddFamily(values.familyMembers)}
                          // onClick={() =>
                          //   push({
                          //     lastName: '',
                          //     firstName: '',
                          //     birthDate: '',
                          //     gender: '',
                          //     relationship: '',
                          //     attendSchool: '',
                          //     schoolName: ''
                          //   })
                          // }
                          >
                          Add
                        </Button>
                      </Grid>
                    </Grid>

                    {values.familyMembers && values.familyMembers.length > 0
                  ? values.familyMembers.map((familyMember, index) => (    
                  <Grid key={index} item xs={12}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Grid container spacing={2}>
                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={9} style={{ fontWeight:'600'}}>
                                # {index+1}
                              </Grid>
                              <Grid item xs={3} style={{ textAlign:'center', justifyContent:'flex-end', alignSelf:'center' }}>
                                <Button 
                                  color="primary" 
                                  size="sm" 
                                  style={{ margin:'0 2px'}}
                                  // type="submit"
                                  // onClick={() => handleEditData(profile)}
                                >
                                  {/* {openEdit === true ? 'Save' : 'Edit'} */}
                                  Edit
                                </Button>
                                <Button 
                                variant="text"
                                size="sm"
                                style={{ margin:'0 2px'}}
                                onClick={() => {
                                  remove(index)
                                }}>
                                  Delete
                                </Button>
                              </Grid>
                             
                            </Grid>
                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Quote.FirstName'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].firstName}
                              </Grid>
                            </Grid>

                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Quote.LastName'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].lastName}
                              </Grid>
                            </Grid>

                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Quote.Gender'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].gender}
                              </Grid>
                            </Grid>

                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Quote.BirthDate'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].birthDate}
                              </Grid>
                            </Grid>

                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Dashboard.StatusInCanada'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].statusCanada}
                              </Grid>
                            </Grid>

                            <Grid item container style={{ margin:'0 8px' }}>
                              <Grid item xs={12} md={6}>
                                <Text tid={'Dashboard.CoveredByGHIP'} />
                              </Grid>
                              <Grid item xs={12} md={6} style={{ fontWeight:'600'}}>
                                {values.familyMembers[index].ghip}
                              </Grid>
                            </Grid>

                            
                        </Grid> 
                      </CardContent>
                    </Card>
                  </Grid>
                  ))
                  : <Grid container><Grid item xs={12}><Card><CardContent>No Family Members</CardContent></Card></Grid></Grid>}

                  {/* {values.familyMembers && values.familyMembers.length > 0
                  ? values.familyMembers.map((familyMember, index) => (    
                  <Grid key={index} item xs={12}>
                    <Card variant='outlined'>
                      <CardContent>
                        <Grid container spacing={2}>
                          <Grid item container xs={10}>  
                            <Grid item xs={12} sm={3}>
                              <RegularTextField
                                name={`familyMembers.${index}.lastName`}
                                label='Last Name'
                                value={familyMember.lastName}
                                onChange={handleChange}
                              />
                            </Grid>
                            <Grid item xs={12} sm={3}>
                              <RegularTextField
                                name={`familyMembers.${index}.firstName`}
                                label='First Name'
                                value={familyMember.firstName}
                                onChange={handleChange}
                              />
                            </Grid>

                            <Grid item xs={12} sm={3}>
                              <RegularTextField
                                name={`familyMembers.${index}.birthDate`}
                                label="Date of Birth"
                                type="date"
                                value={familyMember.birthDate}
                                onChange={handleChange}
                              />
                            </Grid>

                            <Grid item xs={12} sm={1}>
                              <SelectTextField
                                name={`familyMembers.${index}.gender`}
                                label="Gender"
                                value={familyMember.gender}
                                onChange={handleChange}
                              >
                                <option hidden>Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                              </SelectTextField>
                            </Grid>

                            <Grid item xs={12} sm={2}>
                              <SelectTextField
                                name={`familyMembers.${index}.relationship`}
                                label='Relationship'
                                value={familyMember.relationship}
                                onChange={handleChange}
                              >
                                <option hidden>Select Relationship</option>
                                <option value="spouse">Spouse</option>
                                <option value="dependentChild">Dependent Child</option>
                                <option value="parent">Parent</option>
                                <option value="guardian">Guardian</option>
                                <option value="companion">Companion</option>
                              </SelectTextField>
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <Field 
                                  type="checkbox"
                                  name={`familyMembers.${index}.attendSchool`}
                                  as={Checkbox}
                                  onChange={handleChange}
                                />
                                {'Attending School'}
                            </Grid>
                            
                            <Grid item xs={12} sm={8}>
                              <RegularTextField
                                name={`familyMembers.${index}.schoolName`}
                                label='Name of School'
                                value={familyMember.schoolName}
                                onChange={handleChange}
                              />
                            </Grid>
                            </Grid>

                            <Grid item container xs={2} spacing={2} direction='column' alignItems='center' justify='center'>
                            <Grid item>
                              <Button color='primary' size='md'>
                                Update
                              </Button>
                            </Grid>

                            <Grid item>
                              <Button 
                              color='warning' 
                              size='md'
                              onClick={() => {
                                remove(index)
                              }}>
                                Delete
                              </Button>
                            </Grid>

                          </Grid>
                        </Grid> 
                      </CardContent>
                    </Card>
                  </Grid>
                  ))
                  : <Grid container><Grid item xs={12}><Card><CardContent>No Family Members</CardContent></Card></Grid></Grid>} */}
                </Grid>
                )}
                />
                {openAddFamily === true &&
                  <AddFamilyModal
                    addFamily={addFamily}
                    // company={insurance.company}
                    // plan={insurance.plan}
                    // type={insurance.type}
                    open={openAddFamily}
                    handleClose={setOpenAddFamily}
                  />
                }
               </Form>
              )}
          </Formik>
        </CardContent>
      </Card>
    </div>
  )
}
