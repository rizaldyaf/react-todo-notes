import React, { Component } from 'react'
import withStyles from 'react-jss'
import {v4 as uuid} from "uuid"
import { 
    MDXEditor,
    headingsPlugin,
    UndoRedo, 
    BoldItalicUnderlineToggles, 
    toolbarPlugin,
    CreateLink,
    InsertImage,
    InsertTable

} from '@mdxeditor/editor'
import Button from './Button'
import withRouter from '../functions/withRouter'
import TransparentTextInput from './inputs/TransparentTextInput'
import moment from 'moment'
import { connect } from 'react-redux'
import { mapDispatchToProps, mapStateToProps } from '../redux/redux'
import Dropdown from './Dropdown'
import defaultColors from '../data/defaultColors'
import PasswordBox from './inputs/PasswordBox'
import crypto from "crypto"
import queryParamsToJson from '../functions/qparams'

class Composer extends Component {
    state = {
        lastEdited:"",
        mode:"create",
        confirmDialog:false,
        newPassDialog:false,
        unlockDialog:false,
        color:"lightgreen",
        isSecured:false,
        password:null,
        errorMessage:null
    }
    editorRef = React.createRef()
    titleRef = React.createRef()
    dialogRef = React.createRef()
    newPassDialogRef = React.createRef()
    newPassFormRef = React.createRef()
    unlockDialogRef = React.createRef()
    passRef = React.createRef()

    componentDidMount(){
        if (this.props.router.params.id) {
            let foundNotes = this.props.Session.data.notes.filter((note)=>note.id === this.props.router.params.id)
            let note = foundNotes.length ? foundNotes[0] : null
            let params = queryParamsToJson(this.props.router.location.search)
            if (params.pass && note.secured) {
                this.decryptSecuredNote(params.pass, note)
            } else if (note) {
                this.setState({
                    mode:"edit",
                    color:note.color
                })
                if (this.titleRef._setValue) {
                    this.titleRef._setValue(note.title)
                }
                if (this.editorRef.current) {
                    this.editorRef.current.setMarkdown(note.content)
                }
            }
        }
    }

    handleBack = () => {
        let params = queryParamsToJson(this.props.router.location.search)
        if (params.ref === "notes") {
            this.props.router.navigate("/notes")
        } else {
            this.props.router.navigate("/")
        }
        
    }

    decryptSecuredNote = async (password, note) => {
        let decrypt = await window.electron.decryptData(password, note.content)
        if (decrypt.status === "success") {
            this.setState({
                mode:"edit",
                color:note.color,
                isSecured:true,
                password
            })
            if (this.titleRef._setValue) {
                this.titleRef._setValue(note.title)
            }
            if (this.editorRef.current) {
                this.editorRef.current.setMarkdown(decrypt.plainText)
            }
        } else {
            this.handleBack()
        }
    }

    handleSave = async (disableBack) => {
        let title = null
        let content = null
        if (this.titleRef._getValue) {
            title = this.titleRef._getValue()
        }
        if (this.editorRef.current) {
            content = this.editorRef.current.getMarkdown()
        }

        let newNote = {
            id:this.state.mode === "edit"?this.props.router.params.id:uuid(),
            title,
            content,
            color:this.state.color,
            dateModified:moment().toISOString()
        }

        let dataNotes = [...this.props.Session.data.notes]

        if (this.state.mode === 'edit') {
            dataNotes = dataNotes.filter((note)=>note.id !== this.props.router.params.id)
        }

        if (this.state.isSecured && this.state.password) {
            newNote.content = await window.electron.encryptData(this.state.password, newNote.content)
            newNote.secured = true
        }

        dataNotes.push(newNote)

        if (window.electron?.saveData && process.env.NODE_ENV !== "development") {
            window.electron.saveData({
                ...this.props.Session.data,
                notes:dataNotes
            })
        }

        this.props.setNotes(dataNotes)

        if (!disableBack) {
            this.props.router.navigate("/notes")
        }
    }

    toggleDialog = () => {
        if (this.dialogRef.current && !this.state.confirmDialog) {
            this.dialogRef.current.showModal()
            setTimeout(()=>{
                this.setState({
                    confirmDialog:true
                })
            }, 100)
            
            
        } else if (this.dialogRef.current && this.state.confirmDialog) {
            this.setState({
                confirmDialog:false
            },()=>{
                setTimeout(()=>{
                    this.dialogRef.current.close()
                }, 100)
            })
        }
    }

    handleDialogClick =(event)=>{
        if (event.target === this.dialogRef.current) {
            this.toggleDialog()
        }
    }

    handleDelete = (event) => {
        this.toggleDialog()
        let notes = [...this.props.Session.data.notes]
        notes = notes.filter(note=>note.id !== this.props.router.params.id)

        if (window.electron?.saveData && process.env.NODE_ENV !== "development") {
            window.electron.saveData({
                ...this.props.Session.data,
                notes
            })
        }
        this.props.setNotes(notes)
        setTimeout(()=>{
            this.handleBack()
        }, 300)
    }

    handleDialogKeyDown = (e) => {
        if (e.keyCode === 27) {
            e.preventDefault()
            this.toggleDialog()
        }
    }

    handleChangeColor = (value) => {
        this.setState({
            color:value
        })
    }

    togglePassDialog = () => {
        if (this.newPassDialogRef.current && !this.state.newPassDialog) {
            this.newPassDialogRef.current.showModal()
            setTimeout(()=>{
                this.setState({
                    newPassDialog:true
                })
            }, 100)
            
            
        } else if (this.newPassDialogRef.current && this.state.newPassDialog) {
            this.setState({
                newPassDialog:false
            },()=>{
                setTimeout(()=>{
                    this.newPassDialogRef.current.close()
                }, 100)
            })
        }
    }

    toggleUnlockDialog = () => {
        if (this.unlockDialogRef.current && !this.state.unlockDialog) {
            this.unlockDialogRef.current.showModal()
            setTimeout(()=>{
                this.setState({
                    unlockDialog:true
                })
            }, 100)
            
            
        } else if (this.unlockDialogRef.current && this.state.unlockDialog) {
            this.setState({
                unlockDialog:false
            },()=>{
                setTimeout(()=>{
                    this.unlockDialogRef.current.close()
                }, 100)
            })
        }
    }

    handleNewPassword = async () => {
        if (this.newPassFormRef.current) {
            let data = {}
            let errorMessage = ""
            let password = ""
            const formData = new FormData(this.newPassFormRef.current)
            data = Object.fromEntries(formData.entries())
            if (data.newPass && data.newPassConfirm) {
                if (data.newPass.length >= 4) {
                    if (data.newPass === data.newPassConfirm) {
                        password = data.newPass
                    } else {
                        errorMessage = "You entered a different password"
                    }
                } else {
                    errorMessage = "Your password must be minimum 4 characters length"
                }
            } else {
                errorMessage = "Please fill in the new password and confirm new password field"
            }

            if (!errorMessage) {
                this.setState({
                    isSecured:true,
                    password
                },()=>{
                    this.handleSave(true)
                    this.togglePassDialog()
                })
            } else {
                this.setState({
                    errorMessage
                })
            }
        }
    }

    handleRemovePassword = () => {
        let unlockPass = this.passRef.current.value
        if (unlockPass === this.state.password) {
            this.setState({
                isSecured:false,
                password:null
            },()=>{
                this.handleSave(true)
                this.toggleUnlockDialog()
            })
        } else {
            this.setState({
                errorMessage:"Invalid Password"
            })
        }
    }

    render() {
        const {classes} = this.props
        return (
        <div className={classes.container}>
            <div className="floatingHeader">
                <div className='leading'>
                    <Button type="transparent" onClick={()=>this.handleBack()}>
                        <span className='icon'>
                            &#xE76B;
                        </span>
                        Back
                    </Button>
                </div>
                <div className='title'>
                    <TransparentTextInput
                        customRef={ref=>{this.titleRef = ref}}
                        placeholder="Untitled Note"
                    />
                </div>
                <div className='tools'>
                    <Dropdown
                        value={this.state.color}
                        onChange={this.handleChangeColor}
                        options={defaultColors.map((colProp)=>{
                            return ({
                                label:colProp.label,
                                value:colProp.name,
                                icon:<div className={classes.colorSelector+" "+(colProp.name)}></div>
                            })
                        })}
                    >
                        <Button type="icon">
                            <div className={classes.colorSelector+" "+(this.state.color)}></div>
                        </Button>
                    </Dropdown>
                    <Button type="icon" onClick={this.state.isSecured?()=>this.toggleUnlockDialog():()=>this.togglePassDialog()}>
                        <span className='icon'>{this.state.isSecured?<>&#xE72E;</>:<>&#xE785;</>}</span>
                    </Button>
                    {this.state.mode === "edit" && <Button type="icon" onClick={()=>this.toggleDialog()}>
                        <span className='icon'>&#xE74D;</span>
                    </Button>}
                    <Button style={{marginLeft:"10px"}} type="default" color="primary" onClick={()=>this.handleSave()}>
                        <span className='icon'>
                            &#xE74E;
                        </span>
                        Save
                    </Button>
                    <div className='lastEdited'>
                        Edited {moment().subtract(2 , "hours").fromNow()}
                    </div>
                </div>
            </div>
            <div className="pageWrapper">
                <MDXEditor
                    className='dark-theme dark-editor'
                    markdown=''
                    placeholder="Type your notes here"
                    // onChange={(value)=>{console.log(value)}}
                    plugins={[
                        // Example Plugin Usage
                        toolbarPlugin({
                            toolbarClassName: 'my-classname',
                            toolbarContents: () => (
                              <>
                                <UndoRedo />
                                {'|'}
                                <BoldItalicUnderlineToggles />
                                {'|'}
                                <CreateLink/>
                                <InsertImage/>
                                <InsertTable/>
                              </>
                            )
                          }),
                        headingsPlugin(),
                        // listsPlugin(),
                        // quotePlugin(),
                        // thematicBreakPlugin(),
                        // markdownShortcutPlugin()
                    ]}
                    ref={this.editorRef}
                 />
            </div>
            <dialog 
                key="confirm"
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
                key="newPass"
                tabIndex="-1" 
                className={'dialog '+(this.state.newPassDialog?"open":"")} 
                ref={this.newPassDialogRef}
                onClick={(e)=>this.handleDialogClick(e)}
                onKeyDown={(e)=>this.handleDialogKeyDown(e)}
            >
                <div className='dialogTitle'>Lock Note</div>
                <div className='dialogContent'>
                    <p>Create a new password for this note</p>
                    <form ref={this.newPassFormRef}>
                        <PasswordBox name="newPass" fullWidth label="New Password"/>
                        <PasswordBox name="newPassConfirm" fullWidth label="Confirm New Password" />
                    </form>
                    {this.state.errorMessage && <p className='error'>{this.state.errorMessage}</p>}
                </div>
                <div className='action'>
                    
                    <Button color="default" fullWidth onClick={()=>this.togglePassDialog()}>Cancel</Button>
                    <Button color="primary" fullWidth onClick={()=>this.handleNewPassword()}>Done</Button>
                </div>
            </dialog>
            <dialog 
                key="unlock"
                tabIndex="-1" 
                className={'dialog '+(this.state.unlockDialog?"open":"")} 
                ref={this.unlockDialogRef}
                onClick={(e)=>this.handleDialogClick(e)}
                onKeyDown={(e)=>this.handleDialogKeyDown(e)}
            >
                <div className='dialogTitle'>Unlock Note</div>
                <div className='dialogContent'>
                    <p>Unlock to remove password for this note</p>
                    <PasswordBox 
                        customRef={this.passRef} 
                        name="pass" 
                        fullWidth 
                        label="Password" 
                        onPressEnter={this.handleRemovePassword}
                    />
                    {this.state.errorMessage && <p className='error'>{this.state.errorMessage}</p>}
                </div>
                <div className='action'>
                    <Button color="default" fullWidth onClick={()=>this.toggleUnlockDialog()}>Cancel</Button>
                    <Button color="primary" fullWidth onClick={()=>this.handleRemovePassword()}>Unlock</Button>
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
        backgroundColor:"#212225",
        animation:"fadeUp 0.2s ease-out",
        display: 'flex',
        flexDirection:"column",
        alignItems: 'center',
        position:'relative',
        height:'calc(100vh - 45px)',
        overflowY:'scroll',
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
                fontFamily:"Fluent",
                "& p":{
                    margin:'0px',
                    marginBottom:'10px',
                    "&.error":{
                        fontFamily:"Fluent",
                        color:"#db3232"
                    },
                }
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
        "&>.floatingHeader":{
            gap:"20px",
            width:'100%',
            height:"45px",
            zIndex:"5",
            display: 'flex',
            justifyContent: 'center',
            transition:"0.2s ease-out",
            alignItems: 'center',
            borderBottom:"1px solid #555",
            gap:'10px',
            overflowY:"visible",
            
            "&>.title":{
                flexGrow:'1',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',  
            },
            '&>.tools':{
                display: 'flex',
                alignItems: 'center',
                gap:"5px",
                position:"relative",
                "&>.lastEdited":{
                    userSelect:"none",
                    position:"absolute",
                    bottom:"-35px",
                    right:"10px",
                    zIndex:'3',
                    // border:'1px solid #fff',
                    fontSize:"0.9em",
                    opacity:"0.6"
                }
            },
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
            padding:"0px 5px"
            // maxWidth:"calc(80vw - 150px)",
        }
    },
    colorSelector:{
        width:'18px',
        height:'18px',
        borderRadius:"50%",
        ...noteColors   
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(withStyles(styles)(Composer)))