import React, { Component } from 'react'
import withStyles from 'react-jss'

class TextBox extends Component {
    constructor(props) {
        super(props)
        this.state = {
            value:props.value || ""
        }
        this.inputRef = React.createRef(0)
    }

    componentDidMount(){
        if (this.inputRef) {
            this.inputRef.value = this.props.value
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({value:nextProps.value || ""})
        if (this.inputRef) {
            this.inputRef.value = nextProps.value || ""
        }
    }

    clearText = () => {
        this.setState({value:""})
        if (this.inputRef) {
            this.inputRef.value = ""
        }
    }

    handleChange = (e) => {
        this.setState({
            value:e.target.value || ""
        })
        if (this.props.onChange) {
            this.props.onChange(e.target.value || "")
        }
    }

    handlePaste = (e) => {
        if (this.props.onPaste) {
            e.preventDefault()
            let value = e.clipboardData.getData('text');
            this.props.onPaste(value)
        }
    }

    handleKeyDown = (e) => {
        if (e.keyCode === 13 && this.props.onPressEnter) {
            this.props.onPressEnter()
        }
    }

    render() {
        const {classes} = this.props
        return (
        <div className={classes.wrapper+" "+(this.props.disableMargin?"disableMargin":"")}>
            {this.props.label && <div className='label'>{this.props.label}</div>}
            <div className={classes.container+" "+(this.props.fullWidth?"fullWidth":"")}>
                <input 
                    name={this.props.name}
                    ref={(ref)=>{
                        this.inputRef = ref
                        if (this.props.customRef) {
                            return this.props.customRef(ref)
                        }
                        return null
                    }} 
                    type={["text", "email", "tel"].includes(this.props.type)?this.props.type:"text"}
                    onChange={(e)=>this.handleChange(e)}
                    onKeyDown={this.handleKeyDown}
                    onPaste={this.handlePaste}
                />
                {this.state.value && <div className="icon" onClick={()=>this.clearText()}>&#xE711;</div>}
                <div className="indicator"></div>
            </div>
        </div>
        )
    }
}

const styles = {
    wrapper:{
        marginBottom:"15px",
        display: 'flex',
        flexDirection: 'column',
        gap:'5px',
        "&.disableMargin":{
            marginBottom:"0px"
        },
        "&>.label":{
            fontSize:"0.8em",
            fontFamily:"Fluent",
            color:"#fff",
            opacity:"0.8"
        }
    },
    container:{
        height:"30px",
        backgroundColor:"rgba(255,255,255,0.05)",
        width:"250px",
        borderRadius:"5px",
        padding:"5px",
        display: 'flex',
        alignItems: 'center',
        webkitAppRegion:"no-drag",
        gap:"20px",
        position:'relative',
        overflow:"hidden",
        border:"1px solid transparent",
        "&.fullWidth":{
            width:"100%"
        },
        "&>.icon":{
            fontFamily:"FluentIcons",
            opacity:'0.6',
            color:"#fff",
            padding:'2px',
            height:"20px",
            width:"30px",
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom:"3px",
            borderRadius:"3px",
            userSelect:'none',
            transform:"scale(1)",
            transition:"0.2s ease-out",
            "&:hover":{
                backgroundColor:"rgba(255,255,255,0.1)"
            },
            "&:active":{
                transform:"scale(0.9)"
            }
        },
        "&>input":{
            width:'100%',
            backgroundColor:"transparent",
            outline:"none",
            border:"none",
            color:"#fff",
            fontFamily:"Fluent",
            paddingBottom:"3px",
            paddingLeft:"5px",
        },
        "&>.indicator":{
            position:"absolute",
            display:"block",
            width:'100%',
            bottom:'0px',
            left:"0px",
            height:"1.5px",
            backgroundColor:"rgba(255,255,255,0.4)"
        },
        "&:focus-within":{
            backgroundColor:"rgba(0,0,0,0.3)",
            border:'1px solid #555',
            "&>.indicator":{
                display:"block",
                backgroundColor:"lightgreen"
            }

        },
      "@media(max-width:600px)":{
        width:"100%"
      }
    }
}

export default withStyles(styles)(TextBox)
