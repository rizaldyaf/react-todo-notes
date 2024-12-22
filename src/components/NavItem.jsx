import React, { Component } from 'react'
import {withStyles} from "react-jss"
import { Link, useLocation } from 'react-router-dom'


const NavItem = ({classes, path, icon, label}) => {
    const location = useLocation()
    let basePath = path ? path.replace("/:id", '') : "/"
    return (
        <Link to={basePath} style={{textDecoration:"none"}}>
            <div className={classes.container+` ${location.pathname === basePath ?"active":""}`}>
                <div className='indicator'></div>
                <div className='icon'>{icon || <>&#xe80f;</>}</div>
                <div className='label'>{label || "Test label"}</div>
            </div>
        </Link>
        
    )
}

const styles = {
    container:{
        width:"100%",
        height:"40px",
        padding:"5px 10px",
        position:"relative",
        display: 'flex',
        alignItems: 'center',
        gap:"10px",
        color:'#fff',
        fontFamily:"Fluent",
        userSelect:"none",
        cursor:"default",
        borderRadius:"5px",
        "&>.indicator":{
            display:"none",
            height:"20px",
            position:"absolute",
            backgroundColor:"lightgreen",
            width:"3px",
            borderRadius:"6px",
            left:"0px",
            top:"10px",
            margin:"1px 0px",
        },
        "&>.icon":{
            paddingLeft:"5px",
            fontFamily:"FluentIcons !important"
        },
        "&>.label":{
            flexGrow:"1",
            whiteSpace:"nowrap",
            textOverflow:"ellipsis",
            overflow:"hidden",
            textAlign:"left",
            paddingLeft:"0px",
            fontSize:"0.85em",
            transition:"0.2s ease-out"
        },
        "&.active":{
            "&>.indicator":{
                display:"block"
            },
            backgroundColor:"rgba(255,255,255,0.08)"
        },
        "&:hover":{
            backgroundColor:"rgba(255,255,255,0.1)"
        },
        "&:active":{
            backgroundColor:"rgba(255,255,255,0.05)"
        },
        "&:focus":{
            border:"none"
        },
        "@media(max-width:600px)":{
            "&>.label":{
                opacity:"0",
                transform:"scale(0.8)",
                paddingLeft:'20px'
            }
        }

    }
}
export default withStyles(styles)(NavItem)