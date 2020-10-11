import React, {Component} from 'react';
import axios from "axios";
import {PATH_PREFIX} from "../../utils/path_controller";

class Index extends Component {
    render() {

        const handleLogin = (event) => {
            event.preventDefault(); // prevent from F5
            const username = event.target[0].value;
            const password = event.target[1].value;

            return axios({
                url: PATH_PREFIX + '/api/auth',
                method: 'post',
                data: {
                    username,
                    password,
                }
            }).then(function (response) {
                localStorage.setItem('token', response.data.tokenType + " " + response.data.accessToken);
                window.location.reload(true);
            })
        };

        return (
            <div id={"login"}>
                <div class="container-fluid">
                    <div class="row main-content bg-success text-center">
                        <div class="col-md-5 text-center company__info">
                            <div className="col text-center company__info">
                                <span className="company__logo text-center"><h1 className={" mb-0 text-white"}><span className="fas fa-university"/></h1></span>
                                <h4 className="company_title text-white">Store APP</h4>
                            </div>
                        </div>
                        <div class="col-md-7 col-xs-12 col-sm-12 login_form ">
                            <div class="text-center">
                                <div class="row mt-3 ">
                                    <div className="col">
                                        <h2 className={"text-center"}>Tizimga kirish</h2>
                                    </div>
                                </div>
                                <div class="row">
                                    <div className="col">
                                        <form  className="form-group" onSubmit={handleLogin}>
                                            <div className="row">
                                                <div className="col-md-12">
                                                    <input type="text" name="username" id="username" className="form__input"
                                                           placeholder="Username"/>
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="password" name="password" id="password"
                                                           className="form__input" placeholder="Password"/>
                                                </div>
                                                <div className="col-md-12">
                                                    <input type="submit" value="Kirish" className="btn-custom"/>
                                                </div>
                                            </div>
                                        </form>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/*<div className="container">*/}
                {/*    <div className="row mt-5">*/}
                {/*        <div className="col-md-4 offset-4">*/}
                {/*            <div className="card">*/}
                {/*                <div className="card-header bg-primary text-white">*/}
                {/*                    <h3>Tizimga kirish</h3>*/}
                {/*                </div>*/}
                {/*                <div className="card-body ">*/}
                {/*                    <form onSubmit={handleLogin}>*/}
                {/*                        <input type="text" className={"form-control mt-2"} placeholder={"username"}/>*/}
                {/*                        <input type="password" className={"form-control mt-2"}*/}
                {/*                               placeholder={"password"}/>*/}
                {/*                        <button className={"btn btn-success mt-2"} type={"submit"}>Login</button>*/}
                {/*                    </form>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>
        );
    }
}

export default Index;