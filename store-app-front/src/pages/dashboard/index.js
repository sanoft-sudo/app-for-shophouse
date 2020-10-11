import React, {Component} from 'react';
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../../utils/path_controller";
import Pagination from "react-js-pagination";
import {toast, ToastContainer} from "react-toastify";
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs/es';
import 'react-web-tabs/dist/react-web-tabs.css'
import {Modal, ModalFooter, ModalBody, ModalHeader, CardImg} from 'reactstrap';
import InputMask from "react-input-mask";
import {Popconfirm, Upload} from "antd";
import divWithClassName from "react-bootstrap/cjs/divWithClassName";
import {PlusOutlined} from "@ant-design/icons";
import Avatar from '../../assets/avatar.png';

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            usd:null,
            apiUsd:null,
            pageR:0,
            pageA:0,
            totalElementsR:0,
            totalElementsA:0,
            wasteDataR:[],
            wasteDataA:[],
            users:[],
            addUser:false,
            editUser:false,
            user:null,
            attachmentId:''
        }
    }

    componentDidMount() {
        this.getUsd();
        this.getWasteRequested();
        this.getWasteAccepted();
        this.getApiUsd();
        this.getUsers();
    }

    getUsers=()=>{
        axios({
            url:PATH_PREFIX+'/api/user/all',
            method:'get',
            headers:{Authorization}
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    users:res.data.object
                })
            }
        })
    };

    getApiUsd=()=>{
        axios({
            url:"http://apilayer.net/api/live?access_key=60a3c3d1822f8bbe654640027801abe6&currencies=UZS&source=USD&format=1",
            method:"get"
        }).then(function (response) {
            this.setState({
                apiUsd:response.data.quotes.USDUZS
            })
        }.bind(this))
    };

    saveUsd=(event)=>{
        event.preventDefault();
        axios({
            url: PATH_PREFIX + "/api/settings",
            method:'put',
            params:{
                usd:event.target[0].value
            },
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    usd: res.data.object.usd,
                });
            }
        });
    };
    getUsd=async ()=>{
        await axios({
            url: PATH_PREFIX + "/api/settings",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    usd: res.data.object.usd,
                });
            }
        });
    };
    getWasteRequested=()=>{
        axios({
            url:PATH_PREFIX+'/api/waste',
            method:'get',
            params:{
                size:10,
                page:this.state.pageR,
                wasteStatus:"REQUESTED"
            },
            headers:{Authorization}
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    wasteDataR:res.data.object.content,
                    totalElementsR:res.data.object.totalElements,
                })
            }
        })
    };
    getWasteAccepted=()=>{
        axios({
            url:PATH_PREFIX+'/api/waste',
            method:'get',
            params:{
                size:10,
                page:this.state.pageA,
                wasteStatus:"ACCEPTED"
            },
            headers:{Authorization}
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    wasteDataA:res.data.object.content,
                    totalElementsA:res.data.object.totalElements,
                })
            }
        })
    };

    handlePageChangeR=async (pageNumber)=>{
        await this.setState({
            pageR:pageNumber-1
        });
        this.getWasteRequested();
    };
    handlePageChangeA=async (pageNumber)=>{
        await this.setState({
            pageA:pageNumber-1
        });
        this.getWasteAccepted();
    };
    accept=(id)=>{
        axios({
            url:PATH_PREFIX+'/api/waste/'+id,
            method:'put',
            headers:{Authorization}
        }).then(res=>{
            if(res.data.message==='success'){
                this.getWasteRequested();
                this.getWasteAccepted();
            }
            if(res.data.message==='failed'){
                this.notifyWarn("omborda buncha mahsulot yo'q");
            }

        })
    };
    delete=(id)=>{
        axios({
            url:PATH_PREFIX+'/api/waste/'+id,
            method:'delete',
            headers:{Authorization}
        }).then(res=>{
            if(res.data.message==='success'){
                this.getWasteRequested();
                this.getWasteAccepted();
            }
        })
    };

    addUserM=(value)=>{
        this.setState({
            addUser:value,
            attachmentId:""
        })
    };
    addUser=(event)=>{
        event.preventDefault();
        axios({
            url:PATH_PREFIX+'/api/user',
            method:'post',
            headers:{Authorization},
            data:{
                firstName:event.target[0].value,
                lastName:event.target[1].value,
                username:event.target[2].value,
                password:event.target[3].value,
                phoneNumber:this.myTrim(event.target[4].value),
                passportSerial:this.myTrim(event.target[5].value).substring(0,2),
                passportNumber:this.myTrim(event.target[5].value).substring(2,9),
                roleName:this.myTrim(event.target[6].value),
                attachmentId: this.state.attachmentId,

            }
        }).then(res=>{
            if(res.data.message==='success'){
                this.setState({
                    attachmentId: ''
                })
                this.addUserM(false);
                this.getUsers();
            }
            if(res.data.message==='failed'){
                this.notifyWarn('bunaqa usernameli ishchi mavjud')
            }
        })
    };

    deleteUser=(id)=>{
        axios({
            url: PATH_PREFIX + "/api/user/" +id,
            method: "delete",
            headers:{Authorization}

        }).then(response=>{
            if (response.data.success){
                this.notifySuccess("Hodim muofaqqiyatli ochirildi!")
                this.getUsers()
            }else{
                this.notifyError("Ochirishda xatolik! Mutahassisga murojaat qiling!")
            }
        })
    };


    myTrim=(x)=> {
        return x.split(/[ ]+/).join('');
    };

    beforeUpload = (file) => {
        const isJPG = file.type == "image/jpeg";
        const isPNG = file.type == "image/png";
        if (!isJPG && !isPNG) {
            this.notifyWarn(
                "Faqatgina jpg yoki png turdagi fayllarni yuklash mumkin"
            );
        }
        return isJPG || isPNG;
    };
    customRequest = (options) => {
        const data = new FormData();
        data.append("attachment", options.file);
        axios({
            url: PATH_PREFIX + "/api/file/save",
            method: "post",
            data: data,
            headers: {
                "Content-Type":
                    "multipart/form-data; boundary=----WebKitFormBoundaryqTqJIxvkWFYqvP5s",
                "X-Requested-With": "XMLHttpRequest",
            },
        }).then((payload) => {
            console.log(payload.data.id)
            this.setState({
                attachmentId: payload.data.id,
            });
        });
    };


    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);


    render() {
        const {wasteDataA, wasteDataR, apiUsd, users, attachmentId, addUser, user}=this.state;
        return (
            <div className={'container-fluid my-2'}>
                <div className="show">
                    <Tabs defaultTab="vertical-tab-one" vertical>
                        <TabList>
                            <Tab tabFor="vertical-tab-one">Dollar kursi</Tab>
                            <Tab tabFor="vertical-tab-two">Yangi Braklar</Tab>
                            <Tab tabFor="vertical-tab-three">Braklar</Tab>
                            <Tab tabFor="vertical-tab-four">Xodimlar</Tab>
                        </TabList>
                        <TabPanel className={'w-100'} tabId="vertical-tab-one">
                            <div className="row">
                                <div className="col-4 offset-4">
                                    <form onSubmit={this.saveUsd} className={'btn btn-group btn-block'}>
                                        <input step={0.0001} defaultValue={this.state.usd} placeholder={'dollar kursi'} className={'btn border'} type="number"/>
                                        <button className={'btn btn-outline-success'}>saqlash</button>
                                    </form>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col">
                                    <p className={'text-center'}>internetdagi ma'lumotlarga ko'ra dollar kursi <br/> <h5 className={'d-inline'}>{parseFloat(apiUsd).toLocaleString()}</h5> so'm</p>
                                </div>
                            </div>
                        </TabPanel>
                        <TabPanel className={'w-100'} tabId="vertical-tab-two">

                            {
                                wasteDataR.length!==0?
                                    <div>
                                        <div className="row">
                                            <div className="col">
                                                {
                                                    wasteDataR.map(item=>
                                                        <div className="card my-1 btn-outline-light text-dark">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    {item.deliver.product!=null?
                                                                        <div className="col-2 text-center"><b className='font-weight-bold'>{item.deliver.product.name}</b></div>
                                                                        :<div/>
                                                                    }
                                                                    {item.deliver.product.productType!=null?
                                                                        <div className="col-2 text-center"><b className='font-weight-bold'>{item.amount} {item.deliver.product.productType.name}</b></div>
                                                                        :<div/>
                                                                    }
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.description}</b></div>
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.createdAt.substring(0,10)}</b></div>
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.createdBy.firstName} {item.createdBy.lastName}</b></div>
                                                                    <div className="col-2 text-center">
                                                                        <button onClick={id=>this.delete(item.id)} className={'btn btn-outline-danger btn-sm fas fa-trash'}/>
                                                                        <button onClick={id=>this.accept(item.id)} className={'btn btn-outline-success btn-sm fas fa-check-circle'}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <Pagination
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    itemsCountPerPage={10}
                                                    totalItemsCount={this.state.totalElementsR}
                                                    pageRangeDisplayed={5}
                                                    onChange={this.handlePageChangeR}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={'text-center'}><h5>Ma'lumot yo'q</h5></div>

                            }

                        </TabPanel>
                        <TabPanel className={'w-100'} tabId="vertical-tab-three">
                            {
                                wasteDataA.length!==0?
                                    <div>
                                        <div className="row">
                                            <div className="col">
                                                {
                                                    wasteDataA.map(item=>
                                                        <div className="card my-1 btn-outline-light text-dark">
                                                            <div className="card-body">
                                                                <div className="row">
                                                                    {item.deliver.product!=null?
                                                                        <div className="col-2 text-center"><b className='font-weight-bold'>{item.deliver.product.name}</b></div>
                                                                        :<div/>
                                                                    }
                                                                    {item.deliver.product.productType!=null?
                                                                        <div className="col-2 text-center"><b className='font-weight-bold'>{item.amount} {item.deliver.product.productType.name}</b></div>
                                                                        :<div/>
                                                                    }
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.description}</b></div>
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.createdAt.substring(0,10)}</b></div>
                                                                    <div className="col-2 text-center"><b className='font-weight-bold'>{item.createdBy.firstName} {item.createdBy.lastName}</b></div>
                                                                    <div className="col-2 text-center">
                                                                        <button onClick={id=>this.delete(item.id)} className={'btn btn-outline-danger btn-sm fas fa-trash'}/>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                                <Pagination
                                                    itemClass="page-item"
                                                    linkClass="page-link"
                                                    itemsCountPerPage={10}
                                                    totalItemsCount={this.state.totalElementsA}
                                                    pageRangeDisplayed={5}
                                                    onChange={value=>this.handlePageChange('accepted')}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <div className={'text-center'}><h5>Ma'lumot yo'q</h5></div>

                            }
                        </TabPanel>
                        <TabPanel className={'w-100'} tabId="vertical-tab-four">
                            <div className="row">
                                <div className="col"><button onClick={value=>this.addUserM(true)} className={'btn btn-outline-success float-right'}>ishchi qo'shish</button></div>
                            </div>
                            <div className="row">

                                {
                                    users.map(user=>
                                        <div>
                                            <div className="card-container mx-3 mt-4">
                                                <span className="pro">{user.username}</span>
                                                {
                                                    user.attachment?
                                                        <img className="round users-image "
                                                             src={user.attachment.id
                                                             && PATH_PREFIX + "/api/file/get/" + user.attachment.id}
                                                             alt="user"/>:
                                                        <img className="round users-image "
                                                             src={Avatar}
                                                             alt="user"/>
                                                }

                                                <h3 className={"text-white"}>{user.firstName } { user.lastName}</h3>
                                                <h5 className={"text-white"}>{user.phoneNumber}</h5>
                                                <p>{user.passportSerial }: {user.passportNumber}</p>
                                                <div className="buttons">
                                                    <p className={"mt-5 mb-5"}>{
                                                        user.roles.map(item=>
                                                            <div className={'roleName'}>
                                                                {item.roleName === "ROLE_DIRECTOR"? "DIREKTOR" :
                                                                item.roleName === "ROLE_CASHIER" ? "SOTUVCHI" :
                                                                    item.roleName === "ROLE_WAREHOUSE"? "OMBORCHI":''
                                                                }
                                                            </div>
                                                        )
                                                    }</p>
                                                </div>
                                                <div className="skills text-center">
                                                    <Popconfirm className={"delete-portfolio"}
                                                                onConfirm={()=>this.deleteUser(user.id)}
                                                                title="Hodimni o'chirmoqchimisiz？"
                                                                okText="Ha" cancelText="Yoq">
                                                        <button className={'btn btn-outline-danger btn-sm'}><span className={'fas fa-trash'}/> Ishdan bo'shatish</button>
                                                    </Popconfirm>
                                                </div>
                                            </div>
                                        </div>

                                    )
                                }



                            </div>
                        </TabPanel>
                    </Tabs>
                    <div>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                        pauseOnHover/>
                    </div>
                </div>
                <div className="modal">
                    <Modal isOpen={addUser}>
                        <ModalHeader>
                            Ishchi Qo'shish
                        </ModalHeader>
                        <ModalBody>
                            <form id={'addUser'} onSubmit={this.addUser}>
                                <input placeholder={'ism'} className={'form-control my-2'} required type="text"/>
                                <input placeholder={'familiya'} className={'form-control my-2'} required type="text"/>
                                <input placeholder={'username'} className={'form-control my-2'} required type="text"/>
                                <input placeholder={'parol'} className={'form-control my-2'} required type="text"/>
                                <InputMask placeholder={'telefon raqam'} className={'form-control my-2'} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                <InputMask placeholder={'passport raqam'} className={'form-control my-2'} mask="aa 999 99 99" maskChar="-" />
                                <select className={'form-control my-2'} required>
                                    <option value="ROLE_CASHIER">kassir</option>
                                    <option value="ROLE_WAREHOUSE">omborchi</option>
                                </select>
                                <div>
                                    <Upload
                                        name="attachment"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        customRequest={this.customRequest}
                                        className="btn btn-block"
                                    >
                                        {attachmentId ?
                                            <img src={PATH_PREFIX + "/api/file/get/" + attachmentId} alt="user"
                                                 style={{width: '40%'}}/>
                                            :
                                            <div>
                                                <PlusOutlined/>
                                                <div className="mt-2">rasm yuklash</div>
                                            </div>
                                        }
                                    </Upload>
                                </div>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.addUserM(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form={'addUser'} className={'btn btn-outline-primary'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

export default Index;