import React, { useEffect } from 'react'
// import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux';
import { getPlanDocument } from '../../../../redux/actions/insurancePlans';
import {
  Grid, Typography,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@material-ui/core'
import { Button } from "@material-ui/core";
// style
import { makeStyles } from '@material-ui/core/styles'
import dashboardStyles from '../../../../assets/jss/styles/dashboardStyle';
// components
import { QuoteBanner2 } from '../../../../components/common/QuoteBanner2';
import { Text } from '../../../../components/common/LanguageProvider'
// icons
// import GetAppIcon from '@material-ui/icons/GetApp'
// logos
import allianzLogo from '../../../../assets/imgs/logo/allianz-logo.png'
import tugoLogo from '../../../../assets/imgs/logo/tugo-logo.png'
import gmsLogo from '../../../../assets/imgs/logo/gms-logo.png'
import blueCrossLogo from '../../../../assets/imgs/logo/blueCross-logo.png'

const wording = [
  {docType: 'Brochure', textWording:'Brochures'},
  {docType: 'Policy', textWording:'PolicyWording'},
  {docType: 'Claim', textWording:'ClaimForms'},
  {docType: 'Refund', textWording:'Refund'},
]

export default function VendorDownload() {
  
  // title
  document.title = 'Dashboard - Download Resource';

  // style
  const useStyles = makeStyles(dashboardStyles)
  const classes = useStyles()

  const dispatch = useDispatch();
  const documents = useSelector(state => state.insurancePlanReducer.documents)

  // useEffect
  useEffect(() => {
    dispatch(getPlanDocument())
  }, [dispatch]);

  // download & convert URL to PDF file
  const downloadForm = (fileURL) => {
    fetch(process.env.REACT_APP_S3_URL+fileURL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        // Create blob link to download
        const url = window.URL.createObjectURL(new Blob([blob]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', fileURL)
        // Append to html link element page
        document.body.appendChild(link)
        // Start download
        link.click()
        // Clean up and remove the link
        link.parentNode.removeChild(link)
      })
  }

  // pivotTableData
  const pivotTableData = []

  //
    // document list : document type & coverage_type
    const docListObj = Object.create(null);
    const docList = [];
    documents.forEach(function (o) {
      var key = ['document_type'].map(function (k) { return o[k]; }).join('|');
      if (!docListObj[key]) {
        docListObj[key] = {document_type: o.document_type}
        docList.push(docListObj[key]);
      }
    });

  // group : document type & coverage_type
  const docObj = Object.create(null);
  const docGroup = [];
  documents.forEach(function (o) {
    var key = ['document_type', 'primary_coverage_type'].map(function (k) { return o[k]; }).join('|');
    if (!docObj[key]) {
      docObj[key] = {document_type: o.document_type, 
                      coverage_seq: o.primary_coverage_type==='MED'?1:2, 
                      coverage_type: o.primary_coverage_type};
      docGroup.push(docObj[key]);
    }
  });

  // create pivot table
  // docGroup.sort((a,b)=> a.coverage_seq - b.coverage_seq).map(i=>i)
  docGroup.map(i=>( createPivot(i.document_type, i.coverage_type)
  ))

  // function : create pivot table
  function createPivot(document, coverage){

    const pivotObj = Object.create(null);
    const pivotBase = [];
    // group by insured_type
    documents.filter(f=>f.document_type===document&&f.primary_coverage_type===coverage)
              .forEach(function (o) {
                    var key = ['document_type', 'primary_coverage_type', 'insured_type'].map(function (k) { return o[k]; }).join('|');
                    if (!pivotObj[key]) {
                      pivotObj[key] = { document_type: o.document_type, primary_coverage_type: o.primary_coverage_type, insured_type: o.insured_type, 
                                        company: Object.fromEntries(documents.filter(f=>f.document_type===o.document_type&&f.insured_type === o.insured_type&&f.primary_coverage_type===coverage)
                                                                            .map(item => [item.company_name, item.documents])) 
                                      };            
                      pivotBase.push(pivotObj[key]);
                    }
                });
    // group by company
    const groupIns = pivotBase.filter(f=>f.document_type===document&&f.primary_coverage_type===coverage).reduce((acc, item) => {
                                const keys = Object.keys(item.company);
                                for (let key of keys) {
                                  acc[key] = {
                                    ...(acc[key] || {}),
                                    [item.insured_type]: item.company[key]
                                  }
                                }
                                  return acc;
                                }, {})
    // pivotTableData
    Object.entries(groupIns).map(([key, value]) => (
      pivotTableData.push({
                      docType:document,
                      coverage: coverage==='MED'?'Medical plan':'Optional plan ( '+coverage+' )',
                      coverageSeq: coverage==='MED'?1:2,
                      companySeq: key === 'Allianz' ? 1 : (key === 'Tugo' ? 2 : 3),
                      companyName: key,
                      insuranceType: Object.entries(value).map(([key1, value1]) => ({
                                            type: key1,
                                            document: value1
                                          }))
                      })
    ))

}

const insTableCell = (data) => {
  return (
          <Grid container direction="row" style={{ justifyContent:'center' }}>
            {data.document.map((d, docIndex)=> (
              <Grid key={docIndex} item container xs={6} sm={3}>
                <Button
                  color="primary" 
                  style={{ border:'1px solid', padding:'3px 4px' }}
                  onClick={() => downloadForm(d.document_url)}
                >
                    <Typography variant="subtitle1" >
                      {d.language}
                      {/* <Text tid={`Language.${d.language}`} /> */}
                    </Typography>
                </Button>
              </Grid>
            ))}  
          </Grid>
  );
}

  
  return (
    <Grid container>

      <Grid item container style={{ marginTop:'-37px', marginBottom:'-2vh' }}>         
        <QuoteBanner2 title={'Dashboard.DownloadResources'} subTitle={'Dashboard.DownloadResources.SubTitle'} links={[]}/>
      </Grid>

      <Grid item container direction="column" style={{ margin:'0 4vh 10vh 4vh' }}>
        {docList.map((list, index) => (
            <Grid item key={index}>
              <Typography variant="subtitle1" className={classes.subTitleText} style={{ margin:'2vh 0' }}>
                {wording.filter(f=>f.docType===list.document_type).length>0?<Text tid={wording.filter(f=>f.docType===list.document_type)[0].textWording}/>:list.document_type}
              </Typography>
              <TableContainer component={Paper} style={{ boxShadow: '5px 5px 10px #efefef' }}>
                <Table>
                  <TableHead style={{ backgroundColor:'#ddd' }}>
                    <TableRow>
                      <TableCell><Text tid={'Quote.InsuranceCompany'}/></TableCell>
                      <TableCell><Text tid={'Quote.InsuranceType'}/></TableCell>
                      <TableCell align="center"><Text tid={'Students & Companions'}/></TableCell>
                      <TableCell align="center"><Text tid={'Visitors'}/></TableCell>
                      <TableCell align="center"><Text tid={'Canadian Travelers'}/></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {pivotTableData.sort((a,b)=> a.coverageSeq - b.coverageSeq).filter(f=>f.docType === list.document_type)
                        .map((row, index) => (
                      <TableRow
                        key={index}
                      >
                        <TableCell component="th" scope="row" style={{ width: "10%" }}>
                        <img
                            src={row.companyName === 'Tugo'
                                  ? tugoLogo : row.companyName === 'Allianz'
                                    ? allianzLogo : row.companyName === 'GMS'
                                      ? gmsLogo: blueCrossLogo}
                            // src={logo}
                            style={{ width: 40, height: 25, marginRight:'5px'}}
                            alt='logo'
                          />
                          {row.companyName}
                        </TableCell>
                        <TableCell component="th" scope="row" style={{ width: "15%" }}>
                          {row.coverage}
                        </TableCell>
                        <TableCell align="center" style={{ width: "25%" }}>
                          {row.insuranceType.filter(f=>f.type ==='STUDENT').map((insType, insIndex ) => (
                            <div key={insIndex}>
                                {insTableCell(insType)}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell align="center" style={{ width: "25%" }}>
                          {row.insuranceType.filter(f=>f.type ==='VISITOR').map((insType, insIndex ) => (
                            <div key={insIndex}>
                                {insTableCell(insType)}
                            </div>
                          ))}
                        </TableCell>
                        <TableCell align="center" style={{ width: "25%" }}>
                          {row.insuranceType.filter(f=>f.type ==='CANADIAN').map((insType, insIndex ) => (
                            <div key={insIndex}>
                                {insTableCell(insType)}
                            </div>
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ))}
      </Grid>

        
    </Grid>
  )
}