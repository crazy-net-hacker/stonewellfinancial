import React from 'react'
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Typography } from '@material-ui/core';
import { Text } from '../../../components/common/LanguageProvider'

const useStyles = makeStyles((theme) => ({
  root: {
    borderRight: '1px solid black',
    position: 'sticky',
    //top: '100px',
    top: '10%'
  }
}))

export default function Sidebar(props) {
  const classes = useStyles();
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  function handleListItemClick(event, index) {
    //scroll to section
    var element = document.getElementById("header" + index)
    var pos = element.style.position;
    var top = element.style.top;
    element.style.position = 'relative';
    element.style.top = '-60px';//scrolling offset
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    element.style.top = top;
    element.style.position = pos;
    setSelectedIndex(index);
  }

  return (
    <div className={classes.root}>
      <List component="nav" aria-label="qheaders">
        <ListItem
          button
          selected={selectedIndex === 0}
          onClick={event => handleListItemClick(event, 0)}
        >
          <ListItemText>
            <Typography variant="h4">
              <Text tid={"FAQ.Header1"} />
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 1}
          onClick={event => handleListItemClick(event, 1)}
        >
          <ListItemText>
            <Typography variant="h4">
              <Text tid={"FAQ.Header2"} />
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 2}
          onClick={event => handleListItemClick(event, 2)}
        >
          <ListItemText>
            <Typography variant="h4">
              <Text tid={"FAQ.Header3"} />
            </Typography>
          </ListItemText>
        </ListItem>
        <ListItem
          button
          selected={selectedIndex === 3}
          onClick={event => handleListItemClick(event, 3)}
        >
          <ListItemText>
            <Typography variant="h4">
              <Text tid={"FAQ.Header4"} />
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
    </div>
  );
}