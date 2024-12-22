import React, { Component } from 'react'
import withStyles from 'react-jss'
import icon from '../assets/img/icon.png';
import SearchBar from '../components/inputs/SearchBar';

 class TitleBar extends Component {
    render() {
        const {classes} = this.props
        return (
        <div className={classes.titleBar}>
            <div className="dragZone"/>
            <div className="dragZone end"/>
            <div className="branding">
                <img src={icon} className="icon" alt="logo" />
                <div className='appTitle'>Todo Notes</div>
                <div className="channel">alpha</div>
            </div>
            <div className="toolbar">
                <SearchBar/>
            </div>
        </div>
        )
    }
}

const styles = {
    titleBar:{
        fontFamily: "Fluent",
        fontSize: "10pt",
        position:"fixed",
        top:"0px",
        left:"0px",
        height:"45px",
        width: "100%",
        userSelect: "none",
        display: "flex",
        alignItems: "center",
        gap:"20px",
        padding:"0px 15px",
        zIndex: "1",
        color:"#fff",
        "&>.dragZone":{
            position:"absolute",
            top:"0px",
            left:"0px",
            height:"40px",
            zIndex: "2",
            width:"calc(200px + ((100% - 685px)/ 2) )",
            WebkitAppRegion: "drag",
            "&.end":{
                left:'unset',
                right:"135px",
                width:"calc(((100% - 740px)/ 2))"
            }
        },
        "&>.branding":{
            width:"200px",
            height:"45px",
            display: "flex",
            alignItems: "center",
            gap: "10px",
            "&>.icon":{
                width: "25px",
            },
            "&>.appTitle":{
                fontSize:"0.9rem",
                transition:"0.2s ease-out",
                whiteSpace:"nowrap"
            },
            "&>.channel":{
                border:"1px solid #888",
                color:"#888",
                fontSize:"0.8em",
                padding:"0px 5px 1px",
                borderRadius: "4px",
                transition:"0.2s ease-out"
            },
            "@media(max-width:600px)":{
                width:"20px",
                "&>.appTitle":{
                    opacity:"0"
                },
                "&>.channel":{
                    opacity:"0"
                }

            }
        },
        "&>.toolbar":{
            height:"45px",
            flexGrow: "1",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            paddingRight:"135px",
            transition:"0.2s ease-out",
            "@media(max-width:600px)":{
                justifyContent:"flex-start"
            }
        }
    }
}

export default withStyles(styles)(TitleBar)