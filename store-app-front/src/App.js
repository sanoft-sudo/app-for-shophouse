import React, {Component} from 'react';
import axios from "axios";
// import './global.css';
import {PATH_PREFIX} from "./utils/path_controller";
import history from "./history";
import Login from "./pages/login/index";
import Sale from "./pages/sale/index";
import Warehouse from "./pages/warehouse/index";
import Report from "./pages/report/index";
import Income from "./pages/income/index";
import Client from "./pages/client/index";
import Dashboard from './pages/dashboard/index'
import {BrowserRouter as Router, Link, Route, Switch,} from "react-router-dom";
import './components/fontawesomescss/css/all.css'
import Redirect from "react-router-dom/es/Redirect";

class App extends Component {

    constructor(props) {
        super(props);

        this.state = {
            currentUser: "",
            redirect: true,
            currentPage:localStorage.getItem("currentPage")
        }
    }

    componentDidMount() {
        axios({
            url: PATH_PREFIX + "/api/user/me",
            method: "get",
            headers: {
                'Authorization': localStorage.getItem('token')
            }
        }).then(response => {
            if (!response.data.success) {


                this.setState({
                    redirect: true
                });
            } else {
                if (localStorage.getItem('currentPage') === null) {
                    if (response.data.object.roles[0].id === 30) {
                        history.push("/sale");
                    } else if (response.data.object.roles[0].id === 20) {
                        history.push("/warehouse");
                    } else {
                        history.push("/admin");
                    }
                }else {
                    history.push(localStorage.getItem("currentPage"))
                }
                this.setState({
                    redirect: false,
                    currentUser: response.data.object,
                })
            }
        })
    }

    handlePage = (param) => {
        localStorage.setItem('currentPage', param);
        this.setState({
            currentPage:param
        })
    };
    logout = () => {
        window.location.reload(true);
        localStorage.clear();
        localStorage.removeItem('token');
    };

    render() {

        const {redirect, currentUser, currentPage} = this.state;

        return (

            <div>
                <Router>
                    {redirect &&
                    window.location.pathname === "/" ? <Redirect to={'/'}/> : ''
                    }
                    {
                        !localStorage.getItem("currentPage") && currentUser.roles ?
                            currentUser.roles.map(item => {
                                return (
                                    item.roleName === "ROLE_DIRECTOR" ?
                                        <Redirect to={"/admin"}/> : item.roleName === "ROLE_CASHIER" ?
                                        <Redirect to={"/sale"}/> : item.roleName === "ROLE_WAREHOUSE" ?
                                            <Redirect to={"/warehouse"}/> : <Redirect to={"/"}/>
                                )
                            })
                            :()=>{
                                return(
                                    <Redirect to={"localStorage.getItem(\"currentPage\")"}/>
                                    )
                            }
                    }
                    {redirect
                        ? <Switch>
                            <Route path={"/"}>
                                <Login/>
                            </Route>
                        </Switch>
                        : <div>
                            <div className="row">
                                <div className={"col-md"}>
                                    <ul className="list-group list-group-horizontal justify-content-center text-light bg-secondary">
                                        {
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Link  to={"/admin"} onClick={() => this.handlePage("/admin")}>
                                                    <li style={{backgroundColor:currentPage==='/admin'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Admin</li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                (item.roleName === 'ROLE_DIRECTOR' || item.roleName === 'ROLE_CASHIER') &&
                                                <Link to={"/sale"} onClick={() => this.handlePage("/sale")}>
                                                    <li style={{backgroundColor:currentPage==='/sale'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Savdo</li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                (item.roleName === 'ROLE_DIRECTOR' || item.roleName === 'ROLE_WAREHOUSE') &&
                                                <Link to={"/warehouse"} onClick={() => this.handlePage("/warehouse")}>
                                                    <li style={{backgroundColor:currentPage==='/warehouse'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Ombor</li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Link to={"/client"}
                                                      onClick={() => this.handlePage("/client")}>
                                                    <li style={{backgroundColor:currentPage==='/client'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Mijoz</li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Link to={"/income"} onClick={() => this.handlePage("/income")}>
                                                    <li style={{backgroundColor:currentPage==='/income'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Foyda</li>
                                                </Link>
                                            )
                                        }
                                        {
                                            currentUser.roles &&
                                            currentUser.roles.map(item =>
                                                item.roleName === 'ROLE_DIRECTOR' &&
                                                <Link to={"/report"} onClick={() => this.handlePage("/report")}>
                                                    <li style={{backgroundColor:currentPage==='/report'&&'#5DADE2'}} className={"list-group-item rounded-0 myClass"}>Hisobot</li>
                                                </Link>
                                            )
                                        }
                                        <Link onClick={this.logout}>
                                            <li className={"list-group-item rounded-0 rounded-0 myClass"}>Chiqish</li>
                                        </Link>
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md">
                                    <Switch>
                                        <Route path={"/sale"}>
                                            <Sale currentUser={currentUser}/>
                                        </Route>
                                        <Route path={"/warehouse"}>
                                            <Warehouse currentUser={this.state.currentUser}/>
                                        </Route>
                                        <Route path={"/client"}>
                                            <Client/>
                                        </Route>
                                        <Route path={"/report"}>
                                            <Report/>
                                        </Route>
                                        <Route path={"/income"}>
                                            <Income/>
                                        </Route>
                                        <Route path={"/admin"}>
                                            <Dashboard currentUser={this.state.currentUser}/>
                                        </Route>
                                    </Switch>
                                </div>
                            </div>
                        </div>
                    }
                </Router>
            </div>
        )
    }
}

export default App;