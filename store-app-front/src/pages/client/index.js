import React, {Component} from 'react';
import "react-bootstrap";
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import axios from 'axios';
import {Modal, ModalFooter, ModalHeader, ModalBody} from 'reactstrap'
import InfoModal from "../../components/InfoModal";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faEdit, faTrashAlt, faUserPlus, faUserMinus, faInfoCircle,} from '@fortawesome/free-solid-svg-icons';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import InputMask from 'react-input-mask';

class Index extends Component {

    constructor(props) {
        super(props);
        this.state= {
            clients:[],
            shoppingHistory:[],
            debtHistory:[],
            //clients
            activePage:1,
            isDebt:false,
            search:'',
            totalElements:0,
            size: 5,
            page: 1,
            sortBy:"loan",
            //shopping history
            shoppingHistorySearch:'',
            shoppingHistorySize:5,
            debtHistorySearch:'',
            debtHistorySize:5,
            //debt history

            currentClient:null,


            addModal:false,
            infoModal:false,
            editModal:false,
            addPaymentModal:false,


        }
    }

    myTrim=(x)=> {
        return x.split(/[ ]+/).join('');
    };
    componentDidMount() {
        this.getAllClients()
    }
    //get functions
    getAllClients=()=>{
        axios({
            url:PATH_PREFIX+`/api/client`,
            method:'get',
            params:{
                search:this.state.search,
                debt:this.state.isDebt,
                sort:this.state.sortBy,
                page:this.state.page,
                size:this.state.size
            },
            headers: {
                Authorization
            }
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    totalElements:res.data.object.totalElements,
                    clients:res.data.object.content
                })
            }
        })
    };

    getAllShoppingHistory= async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/tradeAll/history`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                client:this.state.currentClient.id,
                search:this.state.shoppingHistorySearch,
                size:this.state.shoppingHistorySize
            }
        });
        this.setState({
            shoppingHistory:data.object
        })
    };

    getAllDebtHistory=async ()=>{
        let {data} = await axios({
            url:PATH_PREFIX+`/api/loanPayment/debt`,
            method:'get',
            headers:{
                Authorization
            },
            params:{
                client:this.state.currentClient.id,
                search:this.state.debtHistorySearch,
                size:this.state.debtHistorySize
            }
        });
        this.setState({
            debtHistory:data.object
        })
    };
    //functions
    addClient= async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+'/api/client',
            method:'post',
            headers:{
                Authorization
            },
            data:{
                name:event.target[0].value,
                surname:event.target[1].value,
                number:this.myTrim(event.target[2].value),
                description:event.target[3].value
            }
        });
        this.getAllClients();
        this.addModal(false);
    };

    editClient=async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+`/api/client/${this.state.currentClient.id}`,
            method:'put',
            headers:{
                Authorization
            },
            data:{
                name:event.target[0].value,
                surname:event.target[1].value,
                number:event.target[2].value,
                description:event.target[3].value
            }
        });
        this.getAllClients();
        this.editModal(false);
        this.infoModal(false);
    };

    deleteClient=async ()=>{
        const {data}=await axios({
            url:PATH_PREFIX+`/api/client/${this.state.currentClient.id}`,
            method:'delete',
            headers:{
                Authorization
            },
        });
        this.getAllClients();
        if(data.message==='success'){
            alert('deleted');
            this.infoModal(false)
        }
        if(data.message==='failed'){
            alert('this client has done sale')
        }
    };

    addPayment=async (event)=>{
        event.preventDefault();
        await axios({
            url:PATH_PREFIX+`/api/loanPayment`,
            method:'post',
            headers:{
                Authorization
            },
            data:{
                amount:event.target[0].value,
                type:event.target[1].value,
                client:this.state.currentClient.id,
            }
        });
        this.getAllClients();
        this.addPaymentModal(false);
        this.infoModal(false);
    };
    //choose (by changing state) functions
    chooseClient=async (client)=>{
        await this.setState({
            currentClient:client
        });
        this.infoModal(true)
    };

    chooseShoppingHistory=async (event)=>{
        event.preventDefault();
        if(event.target[0].value>=0){
            await this.setState({
                shoppingHistorySearch:event.target[1].value,
                shoppingHistorySize:event.target[0].value
            })
        }else {
            alert('size should not be minus number')
        }
        this.getAllShoppingHistory()
    };

    chooseDebtHistory=async (event)=>{
        event.preventDefault();
        if(event.target[0].value>=0){
            await this.setState({
                debtHistorySearch:event.target[1].value,
                debtHistorySize:event.target[0].value
            })
        }else {
            alert('size should not be minus number')
        }
        this.getAllDebtHistory()
    };

    search=async (event)=>{
        await this.setState({
            search:event.target.value
        });
        this.getAllClients()
    };

    isDebt=async ()=>{
        await this.setState(prevState=>({
            isDebt:!prevState.isDebt
        }));
        this.getAllClients()
    };

    sortBy=async (event)=>{
        let value=event.target.value;
        await this.setState({
            sortBy:value
        });
        this.getAllClients()
    };

    addModal=(value)=>{
        this.setState({
            addModal:value
        })
    };

    editModal=(value)=>{
        this.setState({
            editModal:value
        })
    };

    addPaymentModal=(value)=>{
        this.setState({
            addPaymentModal:value
        })
    };

    infoModal=async (value)=>{
        if(value){
            this.getAllShoppingHistory();
            this.getAllDebtHistory()
        }
        await this.setState({
            infoModal:value
        })
    };

    handleThisPageChange = async (event, page) => {
        // const {page, totalElements} = this.state;
        await this.setState({
            page: page
        })
        this.getAllClients()
    };

    handleChangeRowsPerPage = async (event) => {
        const {page} = this.state
       await this.setState({
            size:(+event.target.value),
            page:page
        })
        this.getAllClients()
    };



    render() {
        const {clients, activePage,debtHistory, size, page, totalElements, addModal, infoModal, currentClient, editModal, addPaymentModal, shoppingHistory}=this.state;
        return (
            <div className='container-fluid my-2'>

                <div className="visible">
                    <h2 className='text-center'>Mijoz</h2>

                    <div className="form-group">
                        <div className="row">
                            <div className="col-md-6 d-flex">
                                <input className={"mr-3 form-control"} style={{width:'200px'}} onChange={this.search} placeholder={'search'} type="text"/>
                                <select  onChange={this.sortBy} className={"mr-3 form-control"} style={{width:'100px'}}>
                                    <option value="loan">qarz</option>
                                    <option value="name">ism</option>
                                    <option value="surname">familiya</option>
                                    <option value="phoneNumber">nomer</option>
                                </select>
                                <div className="form-check pt-2" style={{alignContent:'center'}}>
                                    <input className="form-check-input" type="checkbox" onChange={this.isDebt} id="defaultCheck1"/>
                                    <label className="form-check-label" htmlFor="defaultCheck1">
                                        Qarzdorlik
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <button onClick={value=>this.addModal(true)} className='btn btn-outline-success float-right'>
                                    <FontAwesomeIcon icon={faUserPlus}/>
                                </button>
                            </div>
                        </div>
                    </div>
                    <Paper >
                        <TableContainer >
                            <Table >
                                <TableHead>
                                        <TableRow>
                                            <TableCell>#</TableCell>
                                            <TableCell >Ism/Familiya</TableCell>
                                            <TableCell >Telefon</TableCell>
                                            <TableCell >Hisob</TableCell>
                                        </TableRow>
                                </TableHead>
                                <TableBody>
                                    {clients.map((client,index) => (
                                        <TableRow hover key={client.id} onClick={id=>this.chooseClient(client)}>
                                            <TableCell style={{width:'50px'}}>{index+1}</TableCell>
                                            <TableCell>{client.surname} {client.name}</TableCell>
                                            <TableCell>{client.number}</TableCell>
                                            <TableCell>{client.loan}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 15, 20]}
                            component="div"
                            count={totalElements}
                            rowsPerPage={size}
                            page={page}
                            onChangePage={this.handleThisPageChange}
                            onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
                    </Paper>
                </div>
                <div className="notVisible">
                    <Modal isOpen={addModal}>
                        <ModalHeader>
                            Client qo'shish
                        </ModalHeader>
                        <ModalBody>
                            <form id='addClient' onSubmit={(event)=>this.addClient(event)} className={'form-group mx-2'}>
                                <input placeholder={'ism'} type="text" className='form-control my-2'/>
                                <input placeholder={'familiya'} type="text" className='form-control my-2'/>
                                <InputMask placeholder={'telefon raqam'} className={'form-control my-2'} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                <textarea placeholder={'izoh'} className='form-control my-2'/>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.addModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='addClient' className={'btn btn-outline-info'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={editModal}>
                        <ModalHeader>
                            Mijozni tahrirlash
                        </ModalHeader>
                        <ModalBody>
                            {
                                currentClient!=null?
                                    <form id='editClient' onSubmit={this.editClient} className={'mx-2'}>
                                        <input defaultValue={currentClient.name} placeholder={'name'} type="text" className='form-control my-2'/>
                                        <input defaultValue={currentClient.surname} placeholder={'last name'} type="text" className='form-control my-2'/>
                                        <InputMask defaultValue={currentClient.number} placeholder={'telefon raqam'} className={'form-control my-2'} mask="+\9\9\8 99 999 99 99" maskChar=" " />
                                        <textarea defaultValue={currentClient.description} placeholder={'description'} className='form-control my-2'/>
                                    </form>
                                    :"Xatolik sodir bo'ldi!?"
                            }
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.editModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='editClient' className={'btn btn-outline-info'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addPaymentModal}>
                        <ModalHeader>
                            To'lov qilish
                        </ModalHeader>
                        <ModalBody>
                            <form id='addPayment' onSubmit={this.addPayment} className={'mx-2'}>
                                <input placeholder={'amount'} type={"number"} className='form-control my-2'/>
                                <select className={'form-control'}>
                                    <option value="CASH">naqd</option>
                                    <option value="CARD">card</option>
                                    <option value="BANK">bank</option>
                                </select>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={value=>this.addPaymentModal(false)} className={'btn btn-outline-danger'}>bekor qilish</button>
                            <button form='addPayment' className={'btn btn-outline-info'}>qo'shish</button>
                        </ModalFooter>
                    </Modal>

                    <InfoModal
                        client={currentClient}
                        shoppingHistory={shoppingHistory}
                        debtHistory={debtHistory}
                        deleteClient={this.deleteClient}
                        editClient={(value=>this.editModal(value))}
                        addPayment={(value)=>this.addPaymentModal(value)}
                        visible={infoModal}
                        manageDebtHistory={this.chooseDebtHistory}
                        manageShoppingHistory={this.chooseShoppingHistory}
                        manageVisible={(value)=>this.infoModal(value)}/>
                </div>
            </div>
        );
    }
}

export default Index;