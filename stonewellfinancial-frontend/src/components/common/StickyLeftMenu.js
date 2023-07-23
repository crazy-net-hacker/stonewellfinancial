import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Text } from '../common/LanguageProvider'
// import { Link } from 'react-router-dom'
// import Button from '../common/CustomButtons/Button'
// import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';

const useStyles = makeStyles((theme) => ({
  stickyLeftMenu: {
    position: 'sticky',
    top: '100px',
    marginTop: '80px',
    paddingLeft: '24px',
    '& h2': {
      fontWeight: 600,
      fontSize: '1em',
      // paddingLeft: '16px',
      borderBottom: '1px solid #eee',
      padding: '0.5em 0',
    }
  },
  label: {
    marginBottom: '16px',
    color: theme.palette.primary.main,
    fontWeight: '500',
    fontSize: '1.8em',
    marginTop: '0.6em',
  },
  leftMenuUl: {
    listStyle: 'none',

    paddingLeft: '0',
  },
  leftMenuLi: {
    // borderLeft: '3px solid',
    // borderColor: theme.palette.primary.light,
    margin: '0',
    padding: '10px',
    '&:hover': {
      borderLeft: '3px solid rgb(163, 201, 84)',
      color: theme.palette.primary.main,
    },
  },
  leftMenuLink: {
    color: theme.palette.neutral.dark,
    fontWeight: 400,
    fontSize: '0.9em',
    '&:hover': {
      textDecoration: 'none',
      fontWeight: 700,
      color: theme.palette.primary.main,
    },
    subtitle: {
      letterSpacing: '-0.2em',
    },
  },
  quoteBox: {
    background: '#f5f5f5',
    color: '#222',
    textAlign: "center",
    // margin: '0 10px 0 16px',
    padding: '20px',
    '& h2': {
      fontSize: '1em',
      fontWeight: '600'
    },
  },
  quoteLink: {
    textDecoration: 'none',
    color: "#222",
    fontWeight: "600",
    '&:hover,&:focus': {
      color: theme.palette.primary.dark,
    },
  }
}))

export default function StickyLeftMenu(props) {
  // const { lists, quote_url, title } = props
  const { lists, quote_url } = props
  const classes = useStyles()

  if (quote_url) {
    return (
      <>
        <div className={classes.stickyLeftMenu}>
          <h2><Text tid={'Contents'} /></h2>
          <nav>
            {/* <Grid container>
              <img
                    width="30"
                    src="/imgs/icon/canada.svg"
                    alt="Canada Flag"
              />
            <Typography className={classes.subtitle} variant="h6"><Text tid={`CANADA`}/></Typography>
            </Grid>
        
            <Typography className={classes.label} variant="h4">
              {pageName}
            </Typography> */}
            <ul className={classes.leftMenuUl}>
              {lists.map((el, index) => (
                <li className={classes.leftMenuLi} key={index}>
                  <a className={classes.leftMenuLink} href={el.href}>
                    <Text tid={el.title} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* <div className={classes.quoteBox}>
            <h6>{title}</h6>
            <Link to={quote_url} style={{ textDecoration: "none" }} >
              <Button color="primary" size="md">
                <Text tid={'Get a Quote'} />
              </Button>
            </Link>
          </div> */}
        </div>
      </>
    )
  } else if (!quote_url) {
    return (
      <>
        <div className={classes.stickyLeftMenu}>
          <h2><Text tid={'Contents'} /></h2>
          <nav>
            {/* <Grid container>
              <img
                    width="30"
                    src="/imgs/icon/canada.svg"
                    alt="Canada Flag"
              />
            <Typography className={classes.subtitle} variant="h6"><Text tid={`CANADA`}/></Typography>
            </Grid>
        
            <Typography className={classes.label} variant="h4">
              {pageName}
            </Typography> */}
            <ul className={classes.leftMenuUl}>
              {lists.map((el, index) => (
                <li className={classes.leftMenuLi} key={index}>
                  <a className={classes.leftMenuLink} href={el.href}>
                    <Text tid={el.title} />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </>
    )
  }
}
