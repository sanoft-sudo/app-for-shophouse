import React, {Component} from 'react';
import 'reactstrap';
import 'react-bootstrap';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import {Authorization, PATH_PREFIX} from "../../utils/path_controller";
import PaymentModal from "../../components/PaymentModal";
import ClientModal from "../../components/ClientModal";
import SearchTree from "../../components/SearchTree";
import {Card, CardImg, Label, Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faEdit, faTrashAlt} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {Popconfirm, Select} from "antd";
import {AvForm, AvGroup, AvInput,} from 'availity-reactstrap-validation';
import {toast, ToastContainer} from "react-toastify";
import productImage from '../../assets/product.png'


class Index extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            clients: [],
            paymentModalVisible: false,
            editModalVisible: false,
            clientModalVisible: false,
            currentClient: '',
            lastSaveClient: '',
            currentProduct: '',
            amountType: '',
            paymentList: [],
            productAmount: '',
            retailPrice: '',
            amount: '',
            totalSum: '',
            totalDiscountSum: '',
            totalAmountPrice: 0,
            inputValue: '',
            bank: 0,
            cash: 0,
            card: 0,
            debt: 0,
            change: 0,
            paymentSum: 0,
            discount: 0,
            discountPrice: 0,
            allDiscountSum: 0,
            payment: 0,
            searchedClient: '',
            tradeAll: '',
            isDiscount: false,
            editProductAmountModalVisible: false,
            editableProduct: [],
            editedAmount: '',
            selectedItem: '',
            lastSavedClient: '',
            isDebt: false,
            search: '',
            totalElements: 0,
            sortBy: "loan",
        };
    };

    componentDidMount() {
        this.getAllClients()
    }

    getAllClients = () => {
        axios({
            url: PATH_PREFIX + `/api/client`,
            method: 'get',
            params: {
                search: this.state.search,
                debt: this.state.isDebt,
                sort: this.state.sortBy,
                page: 1,
                size: 5
            },
            headers: {
                Authorization
            }
        }).then(res => {
            if (res.data.success) {
                this.setState({
                    clients: res.data.object.content
                })
            }
        })
    };
    openPaymentModal = () => {
        this.getAllClients();
        this.setState({
            paymentModalVisible: true,
            cash: this.state.totalSum
        })
    };
    closePaymentModal = () => {
        this.setState({
            paymentModalVisible: false,
            saleId: 0,
            cash: 0,
            card: 0,
            bank: 0,
            debt: 0,
            change: 0,
            discount: 0,
            payment: 0
        })
    };
    savePayment = (event) => {
        event.preventDefault();
        this.setState({
            paymentModalVisible: false,
            saleId: 0,
            cash: 0,
            card: 0,
            bank: 0,
            debt: 0,
            change: 0,
            discount: 0,
            payment: 0,
            data: []
        });
        axios({
            url: PATH_PREFIX + '/api/tradeAll',
            method: 'post',
            data: {
                totalSum: this.state.totalSum,
                clientId: this.state.currentClient,
                discount: this.state.discount + this.state.totalDiscountSum,
                card: this.state.card,
                cash: this.state.cash,
                bank: this.state.bank,
                debt: this.state.debt,
                receivedSum: this.state.payment,
                data: this.state.data
            },
            headers: {Authorization}
        }).then((response) => {
            if (response.data.success) {
                this.setState({
                    discountPrice: 0
                });
                this.getAllClients();
                axios({
                    url: PATH_PREFIX + '/api/product/store/' + this.state.currentProduct.id,
                    method: 'get',
                    headers: {Authorization}
                }).then((response) => {
                    if (response.data.success) {
                        let leftAmount = response.data.object.ending_amount;
                        this.setState({
                            currentProduct: response.data.object,
                            lastSelectedProduct: response.data.object,
                            productAmount: leftAmount,
                            productSalePrice: response.data.object.retail_price,
                            discountPrice: response.data.object.discountPrice
                        });
                        document.getElementById("amountInput").focus();
                    }
                });
            }
        });
    }
    handleChangeInput = (event) => {
        this.setState({inputValue: event.target.value});
    };
    handleRowDel = (index) => {
        const {data} = this.state;
        data.splice(index, 1);
        this.setState({data});
    };
    handlePress = (event) => {
        const {data, inputValue, currentProduct} = this.state;
        let filter = data.filter(item=>item.name===currentProduct.name);

            if (inputValue > 0) {
                let leftAmount = currentProduct.ending_amount;
                if (event.keyCode === 13) {
                    if(filter.length===0){
                        if (leftAmount >= inputValue) {
                            let newInput = {
                                name: this.state.currentProduct.name,
                                retailPrice: this.state.currentProduct.retail_price,
                                amount: parseFloat(inputValue),
                                amountType: this.state.currentProduct.type,
                                totalAmountPrice: this.state.currentProduct.retail_price * parseFloat(inputValue),
                                productId: this.state.currentProduct.id,
                                discountPrice: this.state.currentProduct.retail_price
                            };
                            data.length === 0 ? data.push(newInput) : data.unshift(newInput);
                            let total = 0;
                            data.map(item => total += item.retailPrice * item.amount);
                            this.setState({
                                data,
                                totalSum: total,
                                inputValue: '',
                            })
                        } else {
                            this.notifyWarn("Bizda bor miqdordan ortiq kiritdingiz!")
                        }
                    }else {
                        this.notifyWarn("Bu mahsulotni sotib oldingiz");
                    }
                }
            }
    };
    openEditProductAmountModal = (id, index) => {
        console.log(id)
        const {data} = this.state;
        this.setState({
            editProductAmountModalVisible: true,
            editableProduct: data[index],
            selectedItem: id
        })
    };
    closeEditProductAmountModal = () => {
        this.setState({
            editProductAmountModalVisible: false
        })
    }
    handleEdit = async (event) => {
        const {editableProduct, currentProduct} = this.state;
        if(event.target.value<=currentProduct.ending_amount){
            editableProduct.amount = event.target.value;
            await this.setState({
                editableProduct
            });
        }else {
            this.notifyWarn("Omborda buncha mahsulot yo'q")
        }
    };
    handleDiscountPrice = (event) => {
        const {editableProduct} = this.state;
        editableProduct.discountPrice = event.target.value;
        this.setState({
            editableProduct
        });

    }
    saveChanges = (event, errors, values) => {
        const {data, selectedItem, discountPrice} = this.state;
        let total = 0;
        let totalDiscounts = 0;
        data.map((item) => {
            if (item.id === selectedItem) {
                item.amount = values.amount;
                item.totalAmountPrice = values.totalAmountPrice;
                item.discountPrice = values.discountPrice;
            }
            if (item.discountPrice > 0) {
                total += item.amount * item.discountPrice;
                totalDiscounts += item.amount * item.retailPrice - item.amount * item.discountPrice;
            } else {
                total += item.amount * item.retailPrice;
            }
        });
        this.setState({
            data,
            totalSum: total,
            totalDiscountSum: totalDiscounts,
            lastSaveClient: ""
        });
        this.closeEditProductAmountModal();
    };
    handleSelect = (data) => {
        if (data.isLeaf) {
            axios({
                url: PATH_PREFIX + '/api/product/store/' + data.key,
                method: 'get',
                headers: {Authorization}
            }).then((response) => {
                if (response.data.success) {
                    let leftAmount = response.data.object.ending_amount;
                    this.setState({
                        currentProduct: response.data.object,
                        lastSelectedProduct: response.data.object,
                        productAmount: leftAmount,
                        productSalePrice: response.data.object.retail_price,
                        discountPrice: response.data.object.discountPrice
                    });
                    document.getElementById("amountInput").focus();
                }
            });
        }
    };
    onCancel = () => {
        this.setState({
            data: [],
        })
    };
    handleCash = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(event.target.value) + Number(card) + Number(bank) + Number(discount)
            this.setState({
                cash: Number(event.target.value)
            })
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount
                })
            }
        }

    }
    handleCard = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(event.target.value) + Number(cash) + Number(bank) + Number(discount)
            this.setState({
                card: Number(event.target.value)
            });
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount
                })
            }
        }

    }
    handleBank = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(event.target.value) + Number(cash) + Number(card) + Number(discount)
            this.setState({
                bank: Number(event.target.value)
            });
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - discount
                })
            } else {
                this.setState({
                    debt: totalSum - sum,
                    change: 0,
                    payment: sum - discount
                })
            }
        }
    }
    handleDiscount = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let abs = event.target.value
        if (event.keyCode === 8) {
            abs = abs.substring(0, abs.length - 1)
        }
        if (Number(abs) >= 0) {
            let sum = Number(event.target.value) + Number(card) + Number(cash) + Number(bank);

            this.setState({
                discount: Number(event.target.value)
            });
            if (sum >= totalSum) {
                this.setState({
                    change: sum - totalSum,
                    debt: 0,
                    payment: totalSum - Number(event.target.value)
                })
            } else {
                if (cash > 0 || card > 0 || bank > 0) {
                    this.setState({
                        debt: totalSum - sum,
                        change: 0,
                        payment: sum - Number(event.target.value)
                    })
                } else {
                    this.setState({
                        debt: totalSum - Number(event.target.value),
                        change: 0,
                        payment: 0
                    })
                }

            }
        }
    }
    handleChange = (event) => {
        const {cash, debt, change, card, bank, discount, payment, totalSum} = this.state;
        let sum = Number(cash) + Number(card) + Number(discount) + Number(bank)
        if (sum === 0) {
            this.setState({
                debt: totalSum,
                change: 0,
                payment: 0,
                discount: 0
            })
        } else if (totalSum > sum) {
            this.setState({
                debt: totalSum - sum,
                payment: Number(cash) + Number(card) + Number(bank),
                change: 0
            })
        } else {
            this.setState({
                change: sum - totalSum,
                payment: Number(cash) + Number(card) + Number(bank),
                debt: 0
            })
        }


    };
    openClientModal = (event) => {
        event.preventDefault()
        this.setState({
            clientModalVisible: true

        })
    };
    closeClientModal = () => {
        this.setState({
            clientModalVisible: false,
        })
    };
    saveClient = async (event) => {
        event.preventDefault();
        await axios({
            url: PATH_PREFIX + '/api/client',
            method: 'post',
            headers: {
                Authorization
            },
            data: {
                name: event.target[0].value,
                surname: event.target[1].value,
                number: this.myTrim(event.target[2].value),
                description: event.target[3].value
            }
        }).then((response) => {
            if (response.data.success) {
                this.getAllClients();
                this.setState({
                    currentClient: response.data.object
                })
            }
        });
        this.closeClientModal();
    };
    myTrim = (x) => {
        return x.split(/[ ]+/).join('');
    };

    onSelectInput = (value) => {
        this.setState({
            currentClient: value
        })
    };
    onSearch = async (value) => {
        await this.setState({
            search: value
        });
        this.getAllClients()

    };
    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);

    render() {
        const {
            paymentModalVisible, clientModalVisible, editProductAmountModalVisible,
            payment, discount, currentClient, data, totalDiscountSum,
            currentProduct, productAmount, retailPrice, card, bank, debt,
            change, cash, totalSum, allDiscountSum, inputValue, lastSaveClient, clients, lastSavedClient, editedAmount, editableProduct
        } = this.state;
        library.add(fab, faTrashAlt, faEdit);
        return (

            <div className={"container-fluid"}>
                <div>
                    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                    newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                    pauseOnHover/>
                </div>
                <PaymentModal paymentModalVisible={paymentModalVisible}
                              currentClient={currentClient}
                              clients={clients}
                              paymentSum={totalSum}
                              lastModified={lastSavedClient}
                              closePaymentModal={this.closePaymentModal}
                              savePayment={this.savePayment}
                              changeInput={this.handleChange}
                              handleBank={this.handleBank}
                              handleCash={this.handleCash}
                              handleCard={this.handleCard}
                              handleDiscount={this.handleDiscount}
                              bank={bank}
                              cash={totalSum}
                              card={card}
                              debt={debt}
                              change={change}
                              discount={discount}
                              payment={payment}
                              totalDiscountSum={totalDiscountSum}
                              openClientModal={this.openClientModal}
                              lastSaveClient={lastSaveClient}
                    //select
                              onSelectInput={this.onSelectInput}
                              onSearch={this.onSearch}

                />
                <ClientModal clientModalVisible={clientModalVisible}
                    // openClientModal={this.openClientModal}
                             closeClientModal={this.closeClientModal}
                             saveClient={this.saveClient}
                />
                <Modal isOpen={editProductAmountModalVisible}>
                    <ModalHeader> Maxsulot miqdorini taxrirlash</ModalHeader>
                    <ModalBody>
                        {
                            editableProduct &&
                            <AvForm id={"editProductAmount"} onSubmit={this.saveChanges}>
                                <AvGroup>
                                    <Label for="editableProductName"><b>Mahsulot nomi:</b></Label>
                                    <AvInput name="name" id="editableProductName" value={editableProduct.name}
                                             disabled={true}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductAmount"><b>Mahsulot miqdori:</b></Label>
                                    <input className={'form-control'} name="amount" id="editableProductAmount" value={editableProduct.amount}
                                             required onChange={this.handleEdit}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductretailPrice"><b>Mahsulot narxi:</b></Label>
                                    <AvInput name="retailPrice" id="editableProductretailPrice"
                                             value={editableProduct.retailPrice} disabled={true}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductretailPrice"><b>Chegirma narxi:</b></Label>
                                    <AvInput name="discountPrice" id="editableProductretailPrice"
                                             value={editableProduct.discountPrice} onChange={this.handleDiscountPrice}/>
                                </AvGroup>
                                <AvGroup>
                                    <Label for="editableProductSum"><b>Jami:</b></Label>
                                    <AvInput name="totalAmountPrice" id="editableProductSum"
                                             value={editableProduct.discountPrice ? editableProduct.discountPrice * editableProduct.amount
                                                 : editableProduct.retailPrice * editableProduct.amount}
                                             disabled={true}/>
                                </AvGroup>
                            </AvForm>
                        }

                    </ModalBody>
                    <ModalFooter>
                        <button className={'btn btn-outline-danger'} onClick={this.closeEditProductAmountModal}>Bekor
                            qilish
                        </button>
                        <button form='editProductAmount' className={'btn btn-outline-info'}>Saqlash</button>
                    </ModalFooter>
                </Modal>

                <div className="row mt-3">
                    <div className="col-md-4 ">

                        <div>
                            <SearchTree onSelect={(data) => this.handleSelect(data)}/>
                        </div>

                    </div>
                    <div className="col-md-8">
                        {
                            currentProduct ?
                                <div className="row m-2">
                                    <div className="col-md-4">
                                        {
                                            currentProduct.attachment_id ?
                                                <img style={{width: '100%', height: '250px'}} className='product_image border'
                                                     src={currentProduct.attachment_id
                                                     && PATH_PREFIX + "/api/file/get/" + currentProduct.attachment_id}
                                                     alt={'mahsulot'}
                                                />
                                                :
                                                <img style={{width: '100%', height: '250px'}} className='product_image border'
                                                     src={productImage}
                                                     alt={'mahsulot'}
                                                />
                                        }
                                    </div>
                                    <div className="col-md-8">
                                        <div className={'p-5'}>
                                            <h3 style={{lineHeight: 0}}
                                                className={'text-right'}>{currentProduct.retail_price} so'm</h3>
                                            <p style={{lineHeight: 1}} className='text-right'>narxi</p>

                                            <h3 style={{lineHeight: 0}}
                                                className={'text-right'}>{Math.round(productAmount*100)/100} {currentProduct.type}</h3>
                                            <p style={{lineHeight: 1}} className='text-right'>soni</p>

                                            {currentProduct && productAmount > 0 ?
                                                <input placeholder={"necha " + currentProduct.type + "?"}
                                                       id={"amountInput"} type="number" className={"form-control"}
                                                       name={"myFocus"}
                                                       aria-describedby="inputGroup-sizing-sm" value={inputValue}
                                                       onChange={this.handleChangeInput} onKeyDown={this.handlePress}/>
                                                :
                                                <input id={"amountInput"} type="number" className={"form-control"}
                                                       disabled={true}
                                                       aria-describedby="inputGroup-sizing-sm" value={inputValue}/>
                                            }
                                        </div>
                                    </div>
                                </div> :
                                <div className={''}>
                                    {
                                        <div>
                                            <h4 className={'text-center'}>{this.props.currentUser.firstName} {this.props.currentUser.lastName}</h4>
                                        </div>
                                    }
                                </div>
                        }
                        {
                            data.length !== 0 ?
                                <div className="row">
                                    <table className={'table stripped bordered condensed hover table-editable'}>
                                        <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Mahsulot</th>
                                            <th>Miqdori</th>
                                            <th>dona/kg/litr</th>
                                            <th>Narxi</th>
                                            <th>Umumiy narxi</th>
                                            <th>Chegirma narxi</th>
                                            <th>Chegirma umumiy</th>
                                            <th>Amallar</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {
                                            data.map((item, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item.name}</td>
                                                        <td className={"text-center"}>{item.amount}</td>
                                                        <td className={"text-center"}>{item.amountType}</td>
                                                        <td className={"text-center"}>{item.retailPrice}</td>
                                                        <td className={"text-center"}>{item.amount * item.retailPrice}</td>
                                                        <td className={"text-center"}>{item.discountPrice > 0 ? item.discountPrice : 0}</td>
                                                        <td className={"text-center"}>{item.discountPrice > 0 ? item.amount * item.discountPrice : 0}</td>
                                                        <td className={"text-center"}>
                                                            <div className={"justify-align-center"}>
                                                                <button className="btn btn-sm btn-outline-info mx-2"
                                                                        form={"inputAmount"}
                                                                        onClick={() => this.openEditProductAmountModal(item.productId, index)}>
                                                                    <FontAwesomeIcon icon={faEdit}/>
                                                                </button>
                                                                <Popconfirm onConfirm={() => this.handleRowDel(index)}
                                                                            title='O`chirmoqchimisiz?'
                                                                            okText="Ha" cancelText="Yoq">
                                                                    <button
                                                                        className="btn btn-sm btn-outline-danger mx-2">
                                                                        <FontAwesomeIcon icon={faTrashAlt}/>
                                                                    </button>
                                                                </Popconfirm>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                        {
                                            data.length !== 0 ?
                                                <tr>
                                                    <td></td>
                                                    <td style={{font: 'bold', color: 'blue'}}>Jami</td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td></td>
                                                    <td className={"text-center"}
                                                        style={{font: 'bold', color: 'blue'}}>{
                                                        totalSum
                                                    }</td>
                                                    <td></td>
                                                </tr> : ''
                                        }
                                        </tbody>
                                    </table>
                                    <div className={"ml-auto mt-4"}>
                                        {
                                            data.length !== 0 ?
                                                <div>
                                                    <button className={"btn btn-outline-primary mx-3"}
                                                            onClick={this.openPaymentModal}>
                                                        Davom etish
                                                    </button>
                                                    <button className={"btn btn-outline-danger"}
                                                            onClick={this.onCancel}>Bekor qilish
                                                    </button>
                                                </div> : ''
                                        }
                                    </div>
                                </div>
                                : <div></div>
                        }
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;