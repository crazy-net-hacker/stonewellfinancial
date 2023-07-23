import React from 'react';
import PropTypes from 'prop-types';
import StepHeader from './StepHeader';
import {pathDirection} from './Progress';
import ProductSelection from './ProductSelection'
import ProductSelFamily from './ProductSelFamily';

const ProductForm = (props) => {
  const { formData } = props;
  
  // update form data
  const setFormData = (values) => {
    props.updateFormData(values);
  };

  let height = '0px'

  // direction
  const prevStep = () => props.history.push(pathDirection(props.location.pathname, formData).prevStep);
  const nextStep = () => props.history.push(pathDirection(props.location.pathname, formData).nextStep);

  // apply family premium
  const isApplyFamilyRate = (values) => {
 
    let isFamilyRate = false;  

    isFamilyRate =  values.insuredPersons.filter(f=>f.eligilbeIns !== 'STUDENT' && 
                                          (f.relationship === 'Primary' || f.relationship === 'Spouse'  || f.relationship === 'Child') && 
                                          f.age < (f.relationship === 'Child'? 22 : 60)  &&
                                          f.tripStartDate.toISOString().slice(0,10) === values.insuredPersons[0].tripStartDate.toISOString().slice(0,10) &&
                                          f.tripEndDate.toISOString().slice(0,10) === values.insuredPersons[0].tripEndDate.toISOString().slice(0,10) 
                                          ).length === values.insuredPersons.length

    return (isFamilyRate)
    
  }
    

  return (
    <>
      <StepHeader height={height} activeStep={1} data={formData} />

      {formData.insuredPersons.length > 2 && isApplyFamilyRate(formData) 
        ?
          <>
            {(formData.familyGroup.isSelected === '' ||
                  formData.familyGroup.isSelected === true)
              ?
                <ProductSelFamily
                  formData={formData}
                  setFormData={setFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                /> 
              : 
                <ProductSelection
                  formData={formData}
                  setFormData={setFormData}
                  nextStep={nextStep}
                  prevStep={prevStep}
                />
            } 
          </>
        : 
          <ProductSelection
            formData={formData}
            setFormData={setFormData}
            nextStep={nextStep}
            prevStep={prevStep}
          />
      }

    </>
  )

}

// ProtoTypes
ProductForm.propTypes = {
  formData: PropTypes.object.isRequired
};

export default ProductForm;