import React, { Component } from 'react'
import withStyles from 'react-jss'
import icon from '../assets/img/icon.png';

class Welcome extends Component {
  render() {
    const {classes} = this.props
    const items = [
        {
          "title": "Simple Notes",
          "desc": "Create quick and easy notes to capture your thoughts, ideas, and important information. Whether it's a reminder or a burst of creativity, jot it down effortlessly.",
          "icon": <>&#xe70b;</>
        },
        {
          "title": "Checklist Notes",
          "desc": "Stay organized with checklist notes. Break down tasks into manageable steps, track your progress, and enjoy the satisfaction of ticking off completed items.",
          "icon": <>&#xeadf;</>
        },
        {
          "title": "Kanban Style Board",
          "desc": "Visualize your workflow with our Kanban style board. Move tasks seamlessly through stages, from 'To-Do' to 'Done.' Enhance your productivity and keep everything in perspective.",
          "icon": <>&#xf26d;</>
        }
      ]
    return (
      <div className={classes.container}>
        <div className='header'>
            <img src={icon} alt="icon" />
            <div className='welcome'>
                <h1>Welcome to Todo Notes</h1>
                <p>Let's make everyday productive and transform the way you organize your tasks and ideas. Todo Notes is here to empower your productivity journey.</p>
                <p>Click on one of options below to get started</p>
            </div>
            
        </div>
        <div className='options'>
                {items.map((opt, index)=>{
                    return <div className="option" key={index}>
                    <div className="icon">{opt.icon}</div>
                    <div className='optionLabel'>
                        <h4>{opt.title}</h4>
                        <p>{opt.desc}</p>
                    </div>
                </div>
                })}
                
            </div>
        
      </div>
    )
  }
}

const styles = {
    container:{
        padding:"0px 20px",
        animation:"fadeUp 0.2s ease-out",
        "&>.header":{
            display: 'flex',
            gap:"20px",
            width:'100%',
            marginBottom:"20px",
            "&>img":{
                width:"200px",
                height:"auto",
                objectFit:"contain"
            },
            "&>.welcome":{
                paddingTop:"20px",
                flexGrow:'1',
                fontFamily:"Fluent",
                fontSize:"0.8em",
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                "&>p":{
                    margin:"0px",
                    opacity:"0.8",
                    marginBottom:"10px",
                    textAlign:"left"
                }
            }
        },
        "&>.options":{
            display: 'flex',
            fontSize:"0.8em",
            gap:"10px",
            justifyContent: 'center',
            
            "&>.option":{
                maxWidth:"300px",
                flexGrow:"1",
                display: 'flex',
                border:"3px solid rgba(255,255,255,0.1)",
                padding:'10px',
                borderRadius:"10px",
                gap:"10px",
                cursor:"pointer",
                "&>.icon":{
                    fontFamily:"FluentIcons",
                    fontSize:"2rem"
                },
                "&>.optionLabel":{
                    "&>h4":{
                        textAlign:"left",
                        margin:"5px 0px 10px",
                    },
                    "&>p":{
                        opacity:"0.8",
                        textAlign:"left"
                    }
                },
                "&:hover":{
                    border:"3px solid #61dafb",
                    backgroundColor:"rgba(255,255,255,0.05)"
                }
            }
        }
    }
}

export default withStyles(styles)(Welcome) 
