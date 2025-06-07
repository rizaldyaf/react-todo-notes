import React, { Component } from 'react'
import withStyles from 'react-jss'

class CheckBox extends Component {
    state = {value:this.props.value || false}

    handleClick = () => {
        if (this.props.onChange) {
            this.props.onChange(!this.state.value)
        }
        this.setState({value:!this.state.value})
    }

    render() {
        const {classes} = this.props
        return (
        <div className={classes.checkbox} onClick={()=>this.handleClick()}>
            {this.state.value?<>&#xE73D;</>:<>&#xE739;</>}
        </div>
        )
    }
}

const styles = {
    checkbox:{
        width:"30px",
        height:'30px',
        transform:"scale(1)",
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition:"0.2s ease-out",
        color:"lightgreen",
        fontFamily:"fluentIcons",
        userSelect:"none",
        cursor:'default',
        "&:hover":{
            transform:"scale(1.1)"
        },
        "&:active":{
            transform:"scale(0.9)"
        }
    }
}

export default withStyles(styles)(CheckBox)
