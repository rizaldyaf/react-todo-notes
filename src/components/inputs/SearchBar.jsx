import React, { Component } from 'react'
import withStyles from 'react-jss'

class SearchBar extends Component {
  render() {
    const {classes} = this.props
    return (
      <div className={classes.searchBar}>
        <div className="icon">&#xe721;</div>
        <input type="search" tabIndex="-1" placeholder='Search Notes and Checklists'/>
        <div className="indicator"></div>
      </div>
    )
  }
}

const styles = {
    searchBar:{
      height:"30px",
      backgroundColor:"rgba(255,255,255,0.05)",
      width:"350px",
      borderRadius:"5px",
      padding:"0px 10px",
      display: 'flex',
      alignItems: 'center',
      gap:"20px",
      position:'relative',
      overflow:"hidden",
      border:"1px solid transparent",
      webkitAppRegion:"no-drag",
      "&>.icon":{
        fontFamily:"FluentIcons",
        opacity:'0.6',
        color:"#fff"
      },
      "&>input":{
        width:'100%',
        backgroundColor:"transparent",
        outline:"none",
        border:"none",
        color:"#fff",
        fontFamily:"Fluent",
        paddingBottom:"3px"
      },
      "&>.indicator":{
        position:"absolute",
        display:"none",
        width:'100%',
        bottom:'0px',
        left:"0px",
        height:"1.5px",
        backgroundColor:"lightgreen"
      },
      "&:focus-within":{
        backgroundColor:"rgba(0,0,0,0.3)",
        border:'1px solid #555',
        "&>.indicator":{
          display:"block"
        }
      },
    "@media(max-width:600px)":{
      width:"100%"
    }
  }
}

export default withStyles(styles)(SearchBar)
