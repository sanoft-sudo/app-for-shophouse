import React, {Component} from 'react';
import { ModalBody, Modal} from "reactstrap";
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../utils/path_controller";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {
    faEdit,
    faTrashAlt,
    faUserPlus,
    faUserMinus,
    faInfoCircle,
    faUserEdit,
} from '@fortawesome/free-solid-svg-icons';


class InfoModal extends Component {
    constructor(props) {
        super(props);
        this.state={
            historyModal:false,
            historyId:'',
            historyContent:[]
        }
    }

    componentDidMount() {
    }

    getAllShoppingHistory= async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/trade/history`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                tradeall:this.state.historyId,
            }
        });
        console.log(data.object);
        this.setState({
            historyContent:data.object
        })
    }

    historyModal=async (value, id)=>{
        if(value){
            await this.setState({
                historyId:id
            })
            this.getAllShoppingHistory()
        }
        this.setState({
            historyModal:value
        })
    }

    render() {
        const info = {
            position:"fixed",
            zIndex:1,
            right:0,
            top:0,
            overflowY: "auto",
            height:"100%",
            width:"100%",
            backgroundColor:"rgba(110,110,110,0.4)",
            borderLeft: "1px solid #888",
            display:this.props.visible?"block":"none"
        };
        const infoContent = {
            display:"block",
            float:"right",
            width:"40%",
            minHeight:"100%",
            padding:"20px",
            backgroundColor:"white"
        };
        const blank = {
            display:"block",
            float:"left",
            width:"60%",
            minHeight:"100%",
        };

        const {client, editClient, addPayment, deleteClient, shoppingHistory, manageShoppingHistory, manageDebtHistory, debtHistory}=this.props
        const {historyModal, historyContent}=this.state

        return (
            <div>
                <div style={info}>
                    <div style={blank} onClick={(value)=>this.props.manageVisible(false)}>

                    </div>
                    <div style={infoContent}>
                        <div className="visible">
                            {
                                (client!=null)?
                                    <div className="userDetails">
                                        <div className="row">
                                            <div className="col-md-6">
                                                <h5 className={"ml-2"}>{client.name} {client.surname}</h5>
                                                <p className={"ml-2"}>{client.description}</p>
                                                <div className="btn btn-group btn-block">
                                                    <button onClick={(value)=>editClient(true)} className={'btn btn-outline-primary'}>
                                                        <FontAwesomeIcon icon={faUserEdit}/>
                                                    </button>
                                                    <button  className={'btn btn-outline-danger'} onClick={deleteClient}>
                                                        <FontAwesomeIcon icon={faUserMinus}/>
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="col-6 text-center">
                                                <h6 className={"mt-1 mb-2"}>{client.number}</h6>
                                                <button onClick={(value)=>addPayment(true)} className={'btn btn-outline-primary'}>To'lov qo'shish</button>
                                                <div className={'btn mb-2 mt-2 bg-primary form-control'}><b className={'text-light'}>{client.loan}</b></div>
                                                <p><i>{client.registered&&client.registered.substr(0 ,10)}da ro'yxatdan o'tgan</i></p>
                                            </div>
                                        </div>
                                    </div>
                                    :'Loading...'
                            }
                            {
                                (shoppingHistory!=null)?
                                    <div className="shoppingHistory my-3">
                                            <h5 style={{color:"green"}}>Harid tarixi</h5>
                                            <form id={'shoppingHistory'} className="form-group" onSubmit={manageShoppingHistory}>
                                                <div className="row d-flex">
                                                        <input style={{width:'15%'}} className={"form-control mx-3"} placeholder={'size'} defaultValue={5} type="number"/>
                                                        <input style={{width:'65%'}} className={"form-control mr-3"} placeholder={'search'} type="text"/>
                                                        <button className={"btn btn-outline-info"}>
                                                            <FontAwesomeIcon icon={faInfoCircle}/>
                                                        </button>
                                                </div>
                                            </form>
                                            <table className={"table table-striped table-hover"}>
                                                <thead>
                                                <tr>
                                                    <th className={'text-center'}>№</th>
                                                    <th className={'text-center'}>Jami</th>
                                                    <th className={'text-center'}>Qarz</th>
                                                    <th className={'text-center'}>Kassir</th>
                                                    <th className={'text-center'}>Sana</th>
                                                </tr>
                                                </thead>
                                                <tbody>
                                                {
                                                    shoppingHistory.map((item, index)=>
                                                        <tr onClick={(value, tradeAllId)=>this.historyModal(true, item.id)} key={item.id}>
                                                            <td className={'text-center'}>{index+1}</td>
                                                            <td className={'text-center'}>{item.total} so'm</td>
                                                            <td className={'text-center'}>{item.loan} so'm</td>
                                                            <td className={'text-center'}>{item.salesman}</td>
                                                            <td className={'text-center'}>{item.created.substring(0,10)}</td>
                                                        </tr>
                                                    )
                                                }
                                                </tbody>
                                            </table>
                                        </div>

                                    :'Loading...'
                            }
                            <hr className={"mt-4"}/>
                            <hr className={"mb-3"}/>
                            {
                                (debtHistory!=null)?
                                    <div className="debtHistory my-3">
                                        <h5 style={{color:'red'}}>Qarz tarixi</h5>
                                        <form id={'debtHistory'} className="form-group" onSubmit={manageDebtHistory}>
                                            <div className="row d-flex">
                                                <input style={{width:'15%'}} className={"form-control mx-3"} placeholder={'size'} defaultValue={5} type="number"/>
                                                <input style={{width:'65%'}} className={"form-control mr-3"} placeholder={'search'} type="text"/>
                                                <button className={"btn btn-outline-info"}>
                                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                                </button>
                                            </div>
                                        </form>
                                        <table className={"table table-striped table-hover"}>
                                            <thead>
                                            <tr>
                                                <th className={'text-center'}>№</th>
                                                <th className={'text-center'}>Miqdori</th>
                                                <th className={'text-center'}>Tolov</th>
                                                <th className={'text-center'}>Sana</th>
                                                <th className={'text-center'}>Turi</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {
                                                debtHistory.map((item, index)=>
                                                    <tr>
                                                        <td className={'text-center'}>{index+1}</td>
                                                        <td className={'text-center'}>{item.amount} so'm</td>
                                                        <td className={'text-center'}>{item.sum} so'm</td>
                                                        <td className={'text-center'}>{item.created.substring(0,10)}</td>
                                                        <td className={'text-center'}>{item.loan>0?`qarz`:`to'lo'v`}</td>
                                                    </tr>
                                                )
                                            }
                                            </tbody>
                                        </table>
                                    </div>
                                    :'Loading...'
                            }

                        </div>

                        <div className="not-visible">
                            <Modal isOpen={historyModal} size={'lg'}>
                                <ModalBody>
                                    <div className={'text-right text-danger'} onClick={(value, id)=>this.historyModal(false, null)} ><button className={'fas fa-times btn text-danger'}></button></div>
                                    <table className={"table table-striped table-hover"}>
                                        <thead>
                                        <tr>
                                            <th>№</th>
                                            <th>Mahsulot</th>
                                            <th>Miqdori</th>
                                            <th>Narxi</th>
                                            <th>Chegirma</th>
                                            <th>Jami</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            historyContent.map((item, index)=>
                                                <tr>
                                                    <td>{index+1}</td>
                                                    <td>{item.product}</td>
                                                    <td>{item.amount}</td>
                                                    <td>{item.price} so'm</td>
                                                    <td>{item.discountPrice} so'm</td>
                                                    <td>{item.amount*item.price} so'm</td>
                                                </tr>
                                            )
                                        }
                                        </tbody>
                                    </table>
                                </ModalBody>
                            </Modal>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default InfoModal;