import React, { Component } from 'react'
import withStyles from 'react-jss'

class Dropdown extends Component {
  state = {
    show:false
  }
  ddMenuRef = React.createRef()
  blockClick = true

  componentDidMount(){
    document.addEventListener("click", this.handleClick)
  }

  componentWillUnmount(){
    document.removeEventListener("click", this.handleClick)
  }

  handleClick = (e) => {
    if (this.ddMenuRef.current && !e.target.contains(this.ddMenuRef.current.target) && this.state.show && !this.blockClick) {
      e.preventDefault()
      this.setState({
        show:false
      })
    }
  }

  handleClickOption = (option) => {
    if (this.props.onChange) {
      this.props.onChange(option.value)
    }
  }

  toggleDD = () => {
    this.blockClick = true
    this.setState({
      show:!this.state.show,
    },()=>{
      setTimeout(()=>{
        this.blockClick = false
      }, 300)
    })
  }

  render() {
    const {classes} = this.props
    return (
      <div className={classes.dropdown}>
        <div className='trigger' onClick={()=>this.toggleDD()}>
          {this.props.children}
        </div>
        <div 
          className={'dropdownContainer '} style={{height:this.state.show?+((30 * this.props.options.length) + 12)+"px":"0px"}} ref={this.ddMenuRef}>
            <div className='dropdownMenu'>
                {this.props.options.map((option, key)=>{
                  return <div className='menuItem' key={key} onClick={()=>this.handleClickOption(option)}>
                    {option.icon}
                    <div className='label'>
                      {option.label}
                    </div>
                    {option.value === this.props.value && <div className="checked">
                      &#xE73E;
                    </div>}
                  </div>
                })}
            </div>
        </div>
      </div>
    )
  }
}

const styles = {
  dropdown:{
    position:'relative',
    "&>.dropdownContainer":{
      position:'absolute',
      top:'35px',
      right:"0px",
      zIndex:"100",
      height:'0px',
      transition:"0.2s ease-out",
      overflow:"hidden",
      minWidth:"202px",
      // display:'none',
      "&.show":{
        // display:'block'
      },
      "&>.dropdownMenu":{
        position:"absolute",
        border:"1px solid #1f1f1f",
        bottom:"0px",
        left:"0px",
        zIndex:"1",
        display: 'flex',
        flexDirection: 'column',
        gap:'5px',
        padding:"5px",
        backgroundColor:"rgba(40,40,40,0.5)",
        backdropFilter:"blur(20px)",
        boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
        minWidth:"200px",
        borderRadius:"5px",
        "&>.menuItem":{
          height:'25px',
          fontSize:"0.9em",
          color:"#fff",
          padding:"0px 10px",
          display: 'flex',
          alignItems: 'center',
          borderRadius:"5px",
          fontFamily:"Fluent",
          userSelect:"none",
          width:"190px",
          gap:"10px",
          "&>.label":{
            flexGrow:"1",
            whiteSpace:"nowrap"
          },
          "&>.checked":{
            fontFamily:"FluentIcons"
          },
          "&:hover":{
            backgroundColor:"rgba(255,255,255,0.1)"
          }
        }
      }
    }
  }
}

export default withStyles(styles)(Dropdown) 