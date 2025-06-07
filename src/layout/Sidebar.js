import React, { Component } from 'react'
import withStyles from 'react-jss'
import NavItem from '../components/NavItem'
import Button from '../components/Button'
import withRouter from '../functions/withRouter'

class Sidebar extends Component {
    handleNew = () => {
        if (this.props.router.location.pathname.includes("/notes")) {
            this.props.router.navigate("/notes/new?ref=notes")
        } else if (this.props.router.location.pathname.includes("/checklists")) {
            this.props.router.navigate("/checklists/new?ref=checklists")
        } else {
            this.props.router.navigate("/notes/new")
        }
    }

    render() {
        const {classes, routes} = this.props
        return (
        <div className={classes.sidebar}>
            <button className={classes.actionButton} onClick={()=>this.handleNew()}>
                <div className="icon" style={{"transform":"rotate(45deg)"}}>
                    &#xea39;
                </div>
                <div className='label'>Add New</div>
            </button>
            <div className='navigation'>
                <NavItem label="Home" active/>
                {routes.map((route, index)=><NavItem path={route.path} key={index} label={route.title} icon={route.icon}/>)}
            </div>
            <NavItem label="Settings" path="/settings" icon={<>&#xe713;</>}/>
        </div>
        )
    }
}

const styles = {
    sidebar:{
        width:"200px !important",
        minWidth:"200px",
        marginTop: "30px",
        padding:"15px 5px 0px",
        display: "flex",
        flexDirection: "column",
        gap:"10px",
        height: "calc(100vh - 40px)",
        transition:"0.2s ease-out",
        "@media(max-width:600px)":{
            width:'55px',
            minWidth:"55px",
            maxWidth:'55px'
        },
        "&>.navigation":{
            flexGrow:"1",
            display: "flex",
            flexDirection: "column",
            gap:"5px",
            "&>a":{
                cursor:'default'
            }
        }
    },
    actionButton:{
        display: "flex",
        backgroundColor: "lightgreen",
        width:"190px",
        height: "40px",
        borderRadius: "5px",
        padding: "5px 15px",
        alignItems: "center",
        color:"#333",
        gap:"10px",
        fontSize: "1em",
        border:"none",
        transition:"0.2s ease-out",
        overflow:"hidden",
        "@media(max-width:600px)":{
            width:'45px',
            "&>.label":{
                opacity:"0",
                transform:"scale(0.8)"
            }
        },
        "&:hover":{
            boxShadow: "0px 3px 5px rgba(144, 238, 144, 0.2)"
        },
        "&:active":{
            opacity:"0.8"
        },
        "&>.icon":{
            fontFamily: "FluentIcons"
        },
        "&>.label":{
            fontFamily: "Fluent",
            fontWeight: "bold",
            lineHeight: "1",
            paddingBottom: "2px",
            fontSize: "0.9em",
            whiteSpace:"nowrap",
            opacity:"1",
            transition:"0.2s ease-out",
        },
        
    }
}

export default withRouter(withStyles(styles)(Sidebar))
