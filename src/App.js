import { Component } from 'react';

import './assets/styles/App.css';
import Welcome from './pages/welcome';

import Example from './pages/example';
import { Route, Routes } from 'react-router-dom';
import routes from './routes';
import checklists from './pages/checklists';
import notes from './pages/notes';
import Composer from './components/Composer';
import withRouter from './functions/withRouter';
import Sidebar from './layout/Sidebar';
import TitleBar from './layout/TitleBar';

//icon
import AppIcon from './assets/img/icon.png';
import { connect } from 'react-redux';
import { mapDispatchToProps, mapStateToProps } from './redux/redux';
import axios from 'axios';

class App extends Component {
  state = {
    isMaximized:false,
    isInitialized:false
  }

  componentDidMount(){
    if (!this.state.isInitialized) {
      this.getConfig()
    }
    if (window.electron?.getWindowState) {
      window.electron.getWindowState((event, {isMaximized})=>{
        this.setState({
          isMaximized
        })
      })
    }
  }

  getConfig = async () => {
    if (process.env.NODE_ENV === 'development') {
      setTimeout(()=>{
        this.setState({
          isInitialized:true
        })
      }, 1000)
    } else if (window.electron?.getData) {
      let dataPath = await window.electron.getData()
      axios.get("file://"+dataPath).then((response)=>{
        this.props.setData(response.data)
        this.setState({
          isInitialized:true
        })
      }).catch((error)=>{
        console.error(error)
      })
    }
  }

  handleClose = () => {
    if (window.electron?.quitApp) {
      window.electron.quitApp()
    }
  }

  handleMinimize = () => {
    if (window.electron?.minimizeApp) {
      window.electron.minimizeApp()
    }
  }

  toggleMaximize = () => {
    if (window.electron?.maximizeApp) {
      window.electron.maximizeApp()
    }
  }

  getWindowState = async () => {
    console.log("handle get")
    if (window.electron?.getWindowState) {
      let windowState = await window.electron.getWindowState()
      this.setState({
        isMaximized:windowState
      })
    }
  }

  render() {
    return (
      <div className="App">
        <div className='windowControl'>
          <button tabIndex={-1} onClick={()=>this.handleMinimize()}>&#xE921;</button>
          <button tabIndex={-1} onClick={()=>this.toggleMaximize()}>{this.state.isMaximized?<>&#xE923;</>:<>&#xE922;</>}</button>
          <button tabIndex={-1} className='close' onClick={()=>this.handleClose()}>&#xe8bb;</button>
        </div>
        {this.state.isInitialized
        ? <>
          <TitleBar/>
          <div className="main">
            <Sidebar routes={routes}/>
            <div className='content'>
              <Routes>
                <Route exact path="/" Component={Welcome}/>
                <Route exact path="/boards" Component={Example}/>
                <Route exact path="/checklists" Component={checklists}/>
                <Route exact path="/notes" Component={notes}/>
                <Route path="/notes/:id?" Component={Composer}/>
                <Route exact path="/notes/new" Component={Composer}/>
              </Routes>
            </div>
          </div>
        </>
        : <div className='splash-screen'>
          <div className='logo'>
              <img src={AppIcon}/>
          </div>
        </div>
        }
        
      </div>
    );
  }
  
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
