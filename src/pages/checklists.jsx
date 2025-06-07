import React, { Component } from 'react'
import withStyles from 'react-jss'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../redux/redux'
import moment from 'moment'
import Button from '../components/Button'
import withRouter from '../functions/withRouter'
import ReactMarkdown from 'react-markdown';
import defaultColors from '../data/defaultColors'
import PasswordBox from '../components/inputs/PasswordBox'
import "../assets/styles/animate.min.css"

let colorDict = {}

defaultColors.map((colProp)=>{
    colorDict[colProp.name] = colProp.color
})

class Checklists extends Component {
    state = {
        contextMenuIndex:-1,
        confirmDialog:false,
        noteId:null,
        activeCard:null
    }
    dialogRef = React.createRef()
    activeCardRef = React.createRef()
    passwordRef = React.createRef()

    componentDidMount(){
        document.addEventListener("click", this.handleClickGlobal)
    }

    componentWillUnmount(){
        document.removeEventListener("click", this.handleClickGlobal)
    }

    handleClickGlobal = (e) => {
        if (this.state.contextMenuIndex >= 0) {
            this.setState({contextMenuIndex:-1})
        }
    }

    handleScroll = (e) => {
        if (e.target.scrollTop > 100) {
            document.querySelector(".floatingHeader").classList.add("scrolled")
        } else {
            document.querySelector(".floatingHeader").classList.remove("scrolled")
        }
    }

    handleEditNotes = (e, id) => {
        if (e?.stopPropagation) {
            e.stopPropagation()
        }
        let params = []
        params.push("ref=notes")
        if (this.state.activeCard?.password) {
            params.push("pass="+encodeURIComponent(this.state.activeCard.password))
        }
        this.props.router.navigate("/notes/"+id+"?"+params.join("&"))
    }

    handleClickCard = (e, index) => {
        let rect = e.target.getBoundingClientRect()
        const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        let cardPos = {
            x: rect.left + scrollLeft,
            y: rect.top + scrollTop,
        };
        let clickPos = {
            x:e.clientX - cardPos.x,
            y:e.clientY - cardPos.y
        }
        e.preventDefault()
        this.setState({
            contextMenuIndex:index,
            contextMenuPosition:clickPos
        })
    }

    handleChangeColor = (id, color) => {
        let newNotes = this.props.Session.data.notes.map((note)=>{
            if (note.id === id) {
                return {...note, color}
            }
            return note
        })

        this.props.setNotes(newNotes)
        if (window.electron?.saveData && process.env.NODE_ENV !== "development") {
            window.electron.saveData({
                ...this.props.Session.data,
                notes:newNotes
            })
        }
        
    }

    toggleDialog = (id) => {
        if (this.dialogRef.current && !this.state.confirmDialog) {
            this.dialogRef.current.showModal()
            setTimeout(()=>{
                this.setState({
                    confirmDialog:true,
                    noteId:id
                })
            }, 100)
        } else if (this.dialogRef.current && this.state.confirmDialog) {
            this.setState({
                confirmDialog:false,
                noteId:null
            },()=>{
                setTimeout(()=>{
                    this.dialogRef.current.close()
                }, 100)
            })
        }
    }

    handleDialogClick =(event)=>{
        console.log(event)
        if (event.target === this.dialogRef.current) {
            this.toggleDialog()
        }
    }

    handleDelete = (event) => {
        this.toggleDialog()
        let notes = [...this.props.Session.data.notes]
        if (this.state.noteId) {
            notes = notes.filter(note=>note.id !== this.state.noteId)
        }

        if (window.electron?.saveData && process.env.NODE_ENV !== "development") {
            window.electron.saveData({
                ...this.props.Session.data,
                notes
            })
        }
        this.props.setNotes(notes)
    }

    handleDialogKeyDown = (e) => {
        if (e.keyCode === 27) {
            e.preventDefault()
            this.toggleDialog()
        }
    }

    handleCardKeyDown = (e) => {
        if (e.keyCode === 27) {
            e.preventDefault()
            this.handleOpenNote()
        }
    }

    handleShare = async (note) => {
        if (navigator.share && !note.secured) {
            try {
              await navigator.share({
                title: note.title,
                text: note.content,
                url: '', // Optional, can include a URL
              });
              console.log('Content shared successfully!');
            } catch (error) {
              console.error('Error sharing content:', error);
            }
        } else {
            alert('Web Share API is not supported in your browser.');
        }
    }

    handleOpenNote = (e, note) => {
        let pos = e?.target.getBoundingClientRect() || {}
        console.log(this.state.activeCard)
        if (this.activeCardRef.current && this.state.activeCard === null) {
            console.log("want to open")
            this.activeCardRef.current.showModal()
            setTimeout(()=>{
                this.setState({
                    activeCard:{...note, rect:pos}
                })
            }, 100)
        } else if (this.activeCardRef.current && this.state.activeCard !== null) {
            console.log("want to close")
            this.setState({
                activeCard:null
            },()=>{
                setTimeout(()=>{
                    this.activeCardRef.current.close()
                }, 100)
            })
        }
    }

    handleActiveCardClick = (event)=>{
        if (event.target === this.activeCardRef.current) {
            this.handleOpenNote()
        }
    }

    handleUnlockNote = async () => {
        if (this.passwordRef.current) {
            let password = this.passwordRef.current.value
            let decrypted = await window.electron.decryptData(password, this.state.activeCard.content)
            console.log("decrypted", decrypted)
            if (decrypted?.status === "success") {
                this.setState({
                    activeCard:{
                        ...this.state.activeCard,
                        secured:false,
                        content:decrypted.plainText,
                        password,
                    }
                })
            } else {
                this.setState({
                    activeCard:{
                        ...this.state.activeCard,
                        isDecryptFailed:true,
                    }
                },()=>{
                    let element = document.querySelector("#password_box")
                    element.classList.add("animate__shakeX")
                    setTimeout(()=>{
                        element.classList.remove("animate__shakeX")
                    },2000)
                })
            }
            
        }
    }

    handleDialogClick =(event)=>{
        console.log(event)
        if (event.target === this.dialogRef.current) {
            this.toggleDialog()
        }
    }

    render() {
        const {classes} = this.props
        let renderedChecklists = this.props.Session.data.checklists
        renderedChecklists.sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified));
        return (
        <div className={classes.container} onScroll={this.handleScroll}>
            <div className='floatingHeader'>
                <div className='wrapper'>
                    <h1>Checklists</h1>
                </div>
            </div>
            <div className='pageWrapper'>
                <div className='pageContent'>
                    <div className='gridView'>
                        {renderedChecklists.map((note, index)=><div className='noteWrapper' key={index} style={{zIndex:this.state.contextMenuIndex === index?1000 + index:index}}>
                            <div 
                                className={"noteblock"} 
                                onContextMenu={(e)=>this.handleClickCard(e, index)}
                                onClick={(e)=>this.handleOpenNote(e, note)}
                            >
                            <div className={'ornament '+(note.color)}/>
                            {note.secured && <div className='lockOverlay'>
                                <div className='lockNotice'>
                                    <div className='icon'>&#xE72E;</div>
                                    <div className="label">This note is locked</div>
                                </div>
                            </div>}
                            <div className="noteHeading">{note.title}</div>
                            <div className='noteContent'>
                                {note.secured
                                ?<div className='placeholder'>
                                    <div className='fakeLines' style={{width:"100%"}}/>
                                    <div className='fakeLines' style={{width:"100%"}}/>
                                    <div className='fakeLines' style={{width:"30%"}}/>
                                </div>
                                :<ReactMarkdown>
                                    {note.content}
                                </ReactMarkdown>}
                            </div>
                            <div className='noteFooter'>
                                {moment(note.dateModified).fromNow()}
                            </div>
                            {!note.secured && <div className="editButton">
                                <Button 
                                    type="icon" 
                                    color="primary" 
                                    onClick={(e)=>this.handleEditNotes(e, note.id)}
                                    customStyle={{backgroundColor:colorDict[note.color], color:"#333"}}
                                >
                                    <span className="icon">
                                        &#xE70F;
                                    </span>
                                </Button>
                            </div>}
                            
                        </div>
                        <div 
                            className={"contextMenu "+(this.state.contextMenuIndex === index ?"show":"" )}
                            style={this.state.contextMenuPosition?{
                                right:"unset", 
                                bottom:"unset",
                                top:this.state.contextMenuPosition.y+"px",
                                left:this.state.contextMenuPosition.x+"px"
                            }:{}}
                        >
                                <div className='menuItem' onClick={()=>this.handleOpenNote(null, note)}><span className='icon'>&#xE8A7;</span>Open</div>
                                <div className={'menuItem '+(note.secured?"disabled":"")} onClick={note.secured?null:()=>this.handleEditNotes(note.id)}><span className='icon'>&#xE70F;</span>Edit</div>
                                <div className={'menuItem '+(note.secured?"disabled":"")} onClick={note.secured?null:()=>this.toggleDialog(note.id)}><span className='icon'>&#xE74D;</span>Delete</div>
                                <div className='divider'/>
                                <div className='colorSelect'>
                                    {defaultColors.map((colProp, index)=>{
                                        return <div 
                                            key={index} 
                                            className='color'
                                            onClick={()=>this.handleChangeColor(note.id, colProp.name)}
                                        >
                                            <div className={'circle '+colProp.name}></div>
                                        </div>
                                    })}
                                </div>
                                <div className='divider'/>
                                <div className={'menuItem '+(note.secured?"disabled":"")}><span className='icon'>&#xE8C8;</span>Copy Content</div>
                                <div className={'menuItem '+(note.secured?"disabled":"")} onClick={note.secured?null:()=>this.handleShare(note)}><span className='icon'>&#xE72D;</span>Share</div>
                            </div>
                    </div>)}
                    </div>
                </div>
            </div>
            <dialog 
                tabIndex="-1" 
                className={'dialog '+(this.state.confirmDialog?"open":"")} 
                ref={this.dialogRef}
                onClick={(e)=>this.handleDialogClick(e)}
                onKeyDown={(e)=>this.handleDialogKeyDown(e)}
            >
                <div className='dialogTitle'>Delete note</div>
                <div className='dialogContent'>Are you sure want to delete this note?</div>
                <div className='action'>
                    <Button color="default" fullWidth onClick={()=>this.toggleDialog()}>Cancel</Button>
                    <Button color="primary" fullWidth onClick={()=>this.handleDelete()}>Yes, delete</Button>
                </div>
            </dialog>
            <dialog 
                tabIndex="-1" 
                className={'activeCard '+(this.state.activeCard !== null?"open":"")} 
                ref={this.activeCardRef}
                onClick={(e)=>this.handleActiveCardClick(e)}
                onKeyDown={(e)=>this.handleCardKeyDown(e)}
            >
                <div className={'ornament '+(this.state.activeCard?.color)}></div>
                <div className='cardHeading'>
                    <div className='mainHeading'>
                        <div className='title'>{this.state.activeCard?.title}</div>
                        <div className='subtitle'>{this.state.activeCard ? moment(this.state.activeCard.dateModified).fromNow():""}</div>
                    </div>
                    <div className='controls'>
                        <Button 
                            type="icon" 
                            color="primary" 
                            disabled={this.state.activeCard?.secured}
                            onClick={(e)=>this.handleEditNotes(e, this.state.activeCard.id)}
                            customStyle={{backgroundColor:colorDict[this.state.activeCard?.color || "lightgreen"], color:"#333"}}
                        >
                            <span className="icon">
                                &#xE70F;
                            </span>
                        </Button>
                    </div>
                </div>
                {this.state.activeCard?.secured && <div className='lockOverlay'>
                        <div>
                            <div className="icon">&#xE72E;</div>
                            <div className='notice'>Enter the note password</div>
                            <div id="password_box" className='animate__animated'>
                                <PasswordBox
                                    disableMargin 
                                    name="password" 
                                    customRef={this.passwordRef}
                                    onPressEnter={()=>this.handleUnlockNote()}
                                />
                            </div>
                            {this.state.activeCard?.isDecryptFailed && <div className='error'>Wrong password</div>}
                            <Button onClick={()=>this.handleUnlockNote()} color="primary" customStyle={{backgroundColor:colorDict[this.state.activeCard?.color || "lightgreen"], color:"#333"}}>Unlock Note</Button>
                        </div>
                    </div>}
                <div className='cardBody'>
                    
                    <div className='cardContent'>
                        <ReactMarkdown>
                            {this.state.activeCard?.content}
                        </ReactMarkdown>
                    </div>
                </div>
            </dialog>
        </div>
        )
    }
}

let noteColors = {}

defaultColors.map((colProp)=>{
    noteColors["&."+colProp.name] = {
        backgroundColor:colProp.color
    }
})

const styles = {
    container:{
        // padding:"0px 20px",
        animation:"fadeUp 0.2s ease-out",
        display: 'flex',
        flexDirection:"column",
        alignItems: 'center',
        position:'relative',
        height:'calc(100vh - 45px)',
        overflowY:'scroll',
        "&>.floatingHeader":{
            position: 'sticky',
            gap:"20px",
            width:'100%',
            marginBottom:"20px",
            zIndex:"2",
            top:'0px',
            left:"0px",
            display: 'flex',
            justifyContent: 'center',
            transition:"0.2s ease-out",
            "&.scrolled":{
                backgroundColor:"rgba(40,40,40,0.5)",
                backdropFilter:"blur(20px)"
            },
            "&>.wrapper":{
                width:"100%",
                maxWidth:"calc(80vw - 150px)",
            }
        },
        "&>.pageWrapper":{
            width:'100%',
            flexGrow:'1',
            maxWidth:"calc(80vw - 150px)",
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
            "&>.pageContent":{
                scrollbarWidth: 'thin',
                '&::-webkit-scrollbar': {
                width: '8px',
                backgroundColor: '#fff',
                },
                '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#aaa',
                borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb:hover': {
                backgroundColor: '#666',
                },
                '&::-webkit-scrollbar-track': {
                background: 'transparent',
                },
                "&>.gridView":{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "20px",
                    "@media(max-width:1400px)":{
                        gridTemplateColumns: "repeat(3, 1fr) !important",
                    },
                    "@media(max-width:1200px)":{
                        gridTemplateColumns: "repeat(2, 1fr) !important",
                    },
                    "@media(max-width:960px)":{
                        gridTemplateColumns: "repeat(1, 1fr) !important",
                    },
                    "&>.noteWrapper":{
                        position:"relative",
                        overflowY:"visible",
                        "&>.contextMenu":{
                            display: 'none',
                            flexDirection: 'column',
                            gap:"5px",
                            backgroundColor:"rgba(40,40,40,0.5)",
                            backdropFilter:"blur(20px)",
                            padding:'5px',
                            position:"absolute",
                            top:'10px',
                            right:"10px",
                            boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
                            borderRadius:"7px",
                            zIndex:"4",
                            "&.show":{
                                display:"flex"
                            },
                            "&>.menuItem":{
                                height:'25px',
                                fontFamily:"Fluent",
                                padding:"0px 10px",
                                display: 'flex',
                                alignItems: 'center',
                                borderRadius:"5px",
                                color:"#fff",
                                fontSize:"0.9em",
                                userSelect:"none",
                                gap:'5px',
                                "&.disabled":{
                                    opacity:"0.5",
                                    "&:hover":{
                                        backgroundColor:"transparent !important"
                                    }
                                },
                                "&>span":{
                                    "&.icon":{
                                        marginRight:'10px',
                                        fontFamily:"FluentIcons"
                                    }
                                },
                                "&:hover":{
                                    backgroundColor:'rgba(255,255,255,0.1)'
                                }
                            },
                            "&>.colorSelect":{
                                height:'25px',
                                display: 'flex',
                                gap:'5px',
                                alignItems: 'center',
                                padding:"0px 10px",
                                "&>.color":{
                                    width:'24px',
                                    height:'24px',
                                    borderRadius:"50%",
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    "&:hover":{
                                        backgroundColor:"rgba(255,255,255,0.2)"
                                    },
                                    "&>.circle":{
                                        width:'18px',
                                        height:'18px',
                                        borderRadius:"50%",
                                        ...noteColors
                                    }
                                    
                                }
                            },
                            "&>.divider":{
                                width:"100%",
                                borderBottom:'1px solid #555',
                                height:"1px",
                                content:"''"
                            }
                        },
                    },
                    "& .noteblock":{
                        width:"100%",
                        maxHeight:"300px",
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius:"10px",
                        overflow:"hidden",
                        boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
                        backgroundColor:"#333",
                        transition:"0.2s ease-out",
                        marginBottom:"15px",
                        position:"relative",
                        "&>.lockOverlay":{
                            position:'absolute',
                            width:"100%",
                            height:"100%",
                            zIndex:"1",
                            backgroundColor:"rgba(51,51,51,0.5)",
                            backdropFilter:"blur(10px)",
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            borderRadius:"10px",
                            "&>.lockNotice":{
                                display: 'flex',
                                gap:"10px",
                                alignItems: 'center',
                                "&>.icon":{
                                    fontFamily:"FluentIcons"
                                },
                                "&>.label":{
                                    color:"#fff",
                                    fontFamily:"Fluent"
                                }
                            }
                        },
                        "&>.ornament":{
                            position:"relative",
                            zIndex:"2",
                            content:"''",
                            height:"5px",
                            width:'100%',
                            backgroundColor:"lightgreen",
                            ...noteColors
                        },
                        "&>.noteHeading":{
                            position:"relative",
                            zIndex:"2",
                            height:"30px",
                            padding:'5px 20px 0px',
                            display: 'flex',
                            alignItems: 'center',
                            fontWeight:"bold",
                            fontSize:"1rem",
                            pointerEvents:"none"
                        },
                        "&>.noteContent":{
                            flexGrow:"1",
                            color:"#ddd",
                            height:"74px",
                            padding:'10px 20px',
                            overflow:"hidden",
                            textOverflow:"ellipsis",
                            WebkitLineClamp: 3, // Limit to 3 lines
                            WebkitBoxOrient: 'vertical',
                            marginBottom:'10px',
                            pointerEvents:"none",
                            "&>.placeholder":{
                                display: 'flex',
                                width:'100%',
                                flexDirection: 'column',
                                gap:"16px",
                                "&>.fakeLines":{
                                    height:"7px",
                                    backgroundColor:"#aaa",
                                    borderRadius:"3px"
                                }
                            },
                            "& p":{
                                margin:"0px"
                            }
                        },
                        "&>.noteFooter":{
                            height:"40px",
                            padding:'0px 20px',
                            display: 'flex',
                            alignItems: 'center',
                            fontSize:"0.8em",
                            opacity:"0.5",
                            pointerEvents:"none",
                            zIndex:"2",
                        },
                        "&>.editButton":{
                            position:'absolute',
                            bottom:'10px',
                            right:'10px',
                            opacity:"0",
                            transform:"scale(0.1)",
                            transition:"0.2s ease-out",
                            transitionDelay:"0.1s",
                            zIndex:"3",
                        },
                        
                        "&:hover":{
                            transform:"scale(1.1)",
                            "&>.editButton":{
                                opacity:"1",
                                transform:"scale(1)"
                            }
                        },
                    }
                }
            }
        },
        "&>.dialog":{
            position:"fixed",
            zIndex:"100",
            width:"350px",
            backgroundColor:"#333",
            border:"1px solid #444",
            borderRadius:"5px",
            alignSelf:"center",
            padding:'0px',
            boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
            transform:"scale(1.1)",
            opacity:"0",
            transition:"0.1s ease-out",
            "&::backdrop":{
                backgroundColor:"rgba(0,0,0,0.5)",
                opacity:"0",
                transition:"0.1s ease-out",
            },
            "&.open":{
                transform:"scale(1)",
                opacity:"1",
                "&::backdrop":{
                    opacity:'1'
                }
            },
            "&>.dialogTitle":{
                fontSize:"1.2em",
                fontWeight:"bold",
                fontFamily:"fluent",
                color:"#fff",
                padding:"20px 20px 0px",
            },
            "&>.dialogContent":{
                padding:"10px 20px 20px",
                color:'#fff',
                fontFamily:"Fluent"
            },
            "&>.action":{
                padding:'20px',
                width:"100%",
                display: 'flex',
                alignItems: 'center',
                gap:'10px',
                backgroundColor:"#282828"
            }
        },
        "&>.activeCard":{
            position:"fixed",
            zIndex:"100",
            width:"60vw",
            height:"420px",
            bottom:"0",
            justifySelf:"center",
            backgroundColor:"#333",
            border:"1px solid #444",
            borderRadius:"5px",
            padding:'0px',
            boxShadow:"0px 5px 10px rgba(0,0,0,0.2)",
            transform:"scale(1.1)",
            opacity:"0",
            transition:"0.1s ease-out",
            "&::backdrop":{
                backgroundColor:"rgba(0,0,0,0.5)",
                opacity:"0",
                transition:"0.1s ease-out",
                display: 'flex',
                alignItems: 'flex-end',
            },
            "&.open":{
                transform:"scale(1)",
                opacity:"1",
                "&::backdrop":{
                    opacity:'1'
                }
            },
            "&>.ornament":{
                content:"''",
                height:"5px",
                width:'100%',
                backgroundColor:"lightgreen",
                position:'relative',
                zIndex:"2",
                ...noteColors
            },
            "&>.cardHeading":{
                fontSize:"1.2em",
                fontWeight:"bold",
                fontFamily:"fluent",
                color:"#fff",
                padding:"20px 20px 10px",
                display: 'flex',
                position:'relative',
                zIndex:'2',
                "&>.mainHeading":{
                    flexGrow:"1",
                    "&>.subtitle":{
                        fontSize:"0.9rem",
                        opacity:"0.5",
                        fontWeight:"normal"
                    }
                }
                
            },
            "&>.cardBody":{
                padding:"10px 20px 20px",
                color:'#fff',
                fontFamily:"Fluent",
                height:"320px",
                position:'relative',
                "&>.cardContent":{
                    maxHeight:"320px",
                    overflowY:"auto",
                    "& p":{
                        margin:"0px",
                        lineHeight:"1.5 !important",
                        marginBottom:'10px'
                    },
                },
            },
            "&>.lockOverlay":{
                position:"absolute",
                zIndex:"1",
                top:"0px",
                left:"0px",
                backgroundColor:"rgba(51,51,51,0.5)",
                backdropFilter:"blur(20px)",
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width:'100%',
                height:"100%",
                "&>div":{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap:'15px',
                    "&>.icon":{
                        fontSize:"40px",
                        fontFamily:"FluentIcons",
                        color:'#fff'
                    },
                    "&>.error":{
                        fontFamily:"Fluent",
                        color:"#db3232"
                    },
                    "&>.notice":{
                        color:'#fff',
                        fontFamily:"Fluent",
                        fontWeight:"bold",
                        fontSize:"1.2em",
                        textAlign:"center"
                    }
                }
            }
            // "&>.action":{
            //     padding:'20px',
            //     width:"100%",
            //     display: 'flex',
            //     alignItems: 'center',
            //     gap:'10px',
            //     backgroundColor:"#282828"
            // }
        },
    }
    
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Checklists) ))
