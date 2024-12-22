import React, { Component } from 'react'
import withStyles from 'react-jss'

class TransparentTextInput extends Component {
    inputRef = React.createRef()

    componentDidMount(){
        if (this.props.customRef) {
            this.props.customRef(this)
        }
    }

    _getValue = () => {
        if (this.inputRef.current) {
            let value = this.inputRef.current.value || ""
            return value
        }
        return null
    }

    _setValue = (value) => {
        if (this.inputRef.current) {
            this.inputRef.current.value = value || ""
        }
    }

    render() {
        const {classes, placeholder} = this.props
        return (
        <input 
            ref={this.inputRef}
            className={classes.input} 
            type="text" 
            placeholder={placeholder}
        />
        )
    }
}

const styles = {
    input:{
        backgroundColor:"transparent",
        border:"none",
        outline:"none",
        fontFamily:"Fluent",
        fontSize:'1rem',
        color:"#fff",
        height:"35px",
        padding:'0px 10px',
        borderRadius:"5px",
        minWidth:'250px',
        textAlign:"center",
        "&:focus":{
            backgroundColor:"rgba(0,0,0,0.3)"
        }
    }
}

export default withStyles(styles)(TransparentTextInput) 
