import React, { Component } from 'react'
import withStyles from 'react-jss'

class Button extends Component {
  render() {
    const {classes, color, type, disabled, fullWidth} = this.props
    let buttonClassNames = []
    if (fullWidth) {
        buttonClassNames.push("fullWidth")
    }
    if (color && ["default", "primary"].includes(color) && !this.props.customStyle) {
        buttonClassNames.push("color-"+color)
    }
    if (type && ["default", "transparent", "hollow", "icon"].includes(type)) {
        buttonClassNames.push("type-"+type)
    }
    if (disabled) {
        buttonClassNames.push("disabled")
    }
    return (
      <button className={classes.container+" "+(buttonClassNames.join(" "))} style={this.props.customStyle} {...this.props}>
        {this.props.children}
      </button>
    )
  }
}

const styles = {
    container:{
        padding:'0px 20px',
        height:"35px",
        borderRadius:"7px",
        border:'none',
        backgroundColor:"rgba(255,255,255,0.2)",
        fontFamily:"Fluent",
        fontSize:"1rem",
        color:'rgba(255,255,255,0.8)',
        transition:"0.3s ease-out",
        display: 'flex',
        alignItems: 'center',
        lineHeight:'1',
        "&:hover":{
            backgroundColor:'rgba(255,255,255,0.3)',
        },
        "&:active":{
            backgroundColor:"rgba(255,255,255,0.1)",
            transform:"scale(0.9)"
        },
        "&:focus":{
            border:"none !important"
        },
        "&.fullWidth":{
            width:'100%',
            justifyContent: 'center',
            
        },
        "&.disabled":{
            opacity:"0.5",
            "&:active":{
                backgroundColor:"initial",
                transform:"scale(1)"
            }
        },
        "&>span":{
            "&.icon":{
                marginTop:"1px",
                marginRight:"5px",
                fontFamily:"FluentIcons"
            }
        },
        "&.color-primary":{
            backgroundColor:"lightgreen",
            color:"#282828"
        },
        "&.type-transparent":{
            backgroundColor:"transparent",
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.1)"
            }
        },
        "&.type-icon":{
            padding:"0px",
            width:"35px",
            height:"35px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor:"transparent",
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.1)"
            },
            "&>span":{
                "&.icon":{
                    marginRight:"0px"
                }
            },
            "&.color-primary":{
                backgroundColor:"lightgreen",
                color:"#282828"
            }
        }
    }
}

export default withStyles(styles)(Button)
