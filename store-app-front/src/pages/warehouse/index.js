import React, {Component} from "react";
import SearchTree from "../../components/SearchTree";
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {Select, Upload} from "antd";
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../../utils/path_controller";
import {PlusOutlined} from "@ant-design/icons";
import {toast, ToastContainer} from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import productImage from '../../assets/product.png'
const {Option} = Select;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //one
            productTab: "product-remain",
            searchToFindParentSelected: "",
            searchValue: "",
            deliverAllDescription: "",
            usd: 0,

            //object
            selected: {id: null, name: null, type: "not-selected"},
            product: null,
            category: null,
            oneDeliver: null,
            waste: {amount: 0},

            // modals
            addProduct: false,
            addDeliver: false,
            editProduct: false,
            addCategory: false,
            editCategory: false,
            productType: false,
            addWaste: false,
            addDeiverOut:false,

            //data
            searchToFindParent: [],
            delivers: [],
            productDelivers: [],
            productDeliversOuts: [],
            productTypes: [],
            stores:[],

            //id
            parentCategory: null,
            attachmentId: null,
            searchToFindParentId: null,
        };
    }

    componentDidMount() {
        axios({
            url: PATH_PREFIX + "/api/settings",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.setState({
                    usd: res.data.object.usd,
                });
            }
        });
    }

    //modals
    addCategoryM = async (value) => {
        let {selected, product} = this.state;

        if (value) {
            await this.setState({
                searchToFindParentId:
                    selected.type === "product" ? product.category_id : selected.id,
            });
            await this.getParentCategory();

            this.setState({
                addCategory: true,
            });
        }
        if (!value) {
            this.setState({
                addCategory: false,
                searchToFindParentId: null,
            });
        }
    };
    addProductM = async (value) => {
        let {selected, product} = this.state;
        if (value) {
            await this.getProductType();
            await this.setState({
                searchToFindParentId:
                    selected.type === "product" ? product.category_id : selected.id,
            });
            await this.getParentCategory();
            this.setState({
                addProduct: true,
            });
        }
        if (!value) {
            this.setState({
                addProduct: false,
                searchToFindParentSelected: "",
                parentCategory: null,
                attachmentId: null,
            });
        }
    };
    editProductM = async (value) => {
        if (value) {
            await this.getProductType();
            await this.setState({
                searchToFindParentId: this.state.product.category_id,
                attachmentId: this.state.product.attachment_id,
            });
            await this.getParentCategory();
            this.setState({
                editProduct: true,
            });
        }
        if (!value) {
            this.setState({
                editProduct: false,
                searchToFindParentSelected: "",
                parentCategory: null,
                attachmentId: null,
            });
        }
    };
    editCategoryM = async (value) => {
        let {category} = this.state;
        if (value) {
            await this.setState({
                searchToFindParentId: category.parent ? category.parent.id : null,
            });
            await this.getParentCategory();
            this.setState({
                editCategory: true,
            });
        }
        if (!value) {
            this.setState({
                editCategory: false,
                searchToFindParentId: null,
            });
        }
    };
    addDeliverM = async (value) => {
        const {product} = this.state;
        if (value) {
            await this.setState({
                oneDeliver: {
                    endingExpense: 0,
                    retailPricePercentage: 0,
                    retailPrice: product.retail_price,
                    fullSalePricePercentage: 0,
                    fullSalePrice: product.full_sale_price,
                    amount: 0,
                    price: product.price,
                    currency: product.currency,
                    customCost: product.custom_cost,
                    fareCost: product.fare_cost,
                    otherCosts: product.other_costs,
                    juan: product.juan
                },
            });
            this.oneDelivers("fake", "fake");
            await this.setState({
                addDeliver: true,
            });
        }
        if (!value) {
            await this.setState({
                addDeliver: false,
                oneDeliver: null,
            });
        }
    };
    productTypeM = async (value) => {
        this.setState({
            productType: value,
        });
    };
    addDeliverOutM = async (value) => {
        if(value){
            this.getStores();
        }
        this.setState({
            addDeliverOut: value,
        });
    };
    addWasteM = async (value, waste) => {
        if (value) {
            this.setState({
                waste,
                addWaste: true,
            });
        }
        if (!value) {
            this.setState({
                waste: {amount: 0},
                addWaste: false,
            });
        }
    };

    // controls
    productTab = (tab) => {
        this.setState({
            productTab: tab,
        });
        if (tab === "deliver-history") {
            this.getProductDelivers();
        }
        if (tab == "deliver-out-history"){
            this.getProductDeliverOut();
        }
    };
    onSelectFromTree = async (data) => {
        if (data.isLeaf) {
            await this.setState({
                selected: {id: data.key, name: data.title, type: "product"},
            });
            await this.getProduct();
        }
        if (!data.isLeaf) {
            this.setState({
                selected: {id: data.key, name: data.title, type: "category"},
            });
            await this.getCategory();
        }
    };
    onSearch = async (value) => {
        await this.setState({
            searchValue: value
        });
        this.getParentSearch();
    };

    onSelectFromInput=(value)=>{
        this.setState({
            parentCategory: value,
        })
    };

    reload = () => {
        this.setState({
            selected: {id: null, name: null, type: "not-selected"},
        });
    };
    forNumberInputs = (value) => {
        if (value == "" || value < 0) {
            return 0;
        }
        if (value.substr(0, 1) == 0 && value.length == 2) {
            let result = value.substr(1, value.size);
            return result;
        }
    };
    removeDeliver = (key) => {
        let delivers = this.state.delivers;
        let removed = delivers.filter((item) => item.key !== key);

        this.setState({
            delivers: removed,
        });
    };
    clearDeliver = () => {
        this.setState({
            delivers: [],
        });
    };
    deliverAllDescription = async (event) => {
        await this.setState({
            deliverAllDescription: event.target.value,
        });
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
        }).then((response) => {
            this.setState({
                attachmentId: response.data.id,
            });
        });
    };

    addDeliver = () => {
        let {product, delivers, usd, oneDeliver} = this.state;
        let endingPrice = 0,
            displayPrice = 0;
        if (oneDeliver.currency === "USD") {
            endingPrice = Number(oneDeliver.amount) * Number(oneDeliver.price) + " dollar";
            displayPrice = Number(oneDeliver.price) + " dollar";
        }
        if (oneDeliver.currency === "UZS") {
            displayPrice = Number(oneDeliver.price) + ` so'm`;
            endingPrice = Number(oneDeliver.amount) * Number(oneDeliver.price) + ` so'm`;
        }

        delivers.push({
            productId: product.id,
            currency: oneDeliver.currency,
            customCost: Number(oneDeliver.customCost),
            fareCost: Number(oneDeliver.fareCost),
            otherCosts: Number(oneDeliver.otherCosts),
            amount: Number(oneDeliver.amount),
            price: Number(oneDeliver.price),
            juan: Number(oneDeliver.juan),
            retailPrice: Number(oneDeliver.retailPrice),
            fullSalePrice: Number(oneDeliver.fullSalePrice),

            endingPrice,
            displayPrice,
            name: product.name,

        });
        this.setState({
            delivers,
        });
        this.addDeliverM(false);
    };
    addDeliverOut=(event)=>{
        event.preventDefault();
        axios({
            url:PATH_PREFIX+'/api/deliverOut',
            method:'post',
            headers:{Authorization},
            data:{
                amount:event.target[0].value,
                productId:this.state.product.id,
                storeId:event.target[1].value,
                price:this.state.product.price,
                usd:this.state.usd,
                currency:this.state.product.currency
            }
        }).then(res=>{
            this.addDeliverOutM(false);
            if(res.data.message==='failed'){
                this.notifyWarn("Omborda buncha mahsulot yo'q");
            }
            this.getProduct();
        })
    };
    oneDelivers = async (event, type) => {
        const {oneDeliver, usd} = this.state;
        if (type === "amount") {
            oneDeliver.amount =event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "price") {
            oneDeliver.price = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "currency") {
            if (event.target.value === 'UZS') {
                oneDeliver.currency ='UZS';
            } else if (event.target.value === 'USD') {
                oneDeliver.currency = 'USD';
            }
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "customCost") {
            oneDeliver.customCost =event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "fareCost") {
            oneDeliver.fareCost =event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "otherCosts") {
            oneDeliver.otherCosts = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "juan") {
            oneDeliver.juan =event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "retailPrice") {
            oneDeliver.retailPrice = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }
        if (type === "fullSalePrice") {
            oneDeliver.fullSalePrice = event.target.value;
            await this.setState({
                oneDeliver,
            });
        }

        let price = parseFloat(oneDeliver.price);
        let customCost = parseFloat(oneDeliver.customCost);
        let fareCost = parseFloat(oneDeliver.fareCost);
        let otherCosts = parseFloat(oneDeliver.otherCosts);
        let retailPricePercentage = 0, fullSalePricePercentage = 0,
            endingExpense = price + customCost + fareCost + otherCosts;


        if (oneDeliver.currency === 'UZS') {
            retailPricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneDeliver.retailPrice / 100) * 100 * 100);
            fullSalePricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) / oneDeliver.fullSalePrice / 100) * 100 * 100);
        } else if (oneDeliver.currency === 'USD') {
            retailPricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) * usd / oneDeliver.retailPrice / 100) * 100 * 100);
            fullSalePricePercentage = Math.round(100 - ((price + customCost + fareCost + otherCosts) * usd / oneDeliver.fullSalePrice / 100) * 100 * 100);
        }
        oneDeliver.retailPricePercentage = retailPricePercentage;
        oneDeliver.fullSalePricePercentage = fullSalePricePercentage;
        oneDeliver.endingExpense = endingExpense;

        this.setState({
            oneDeliver,
        });
    };

    //query
    //post
    addCategory = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category",
            method: "post",
            headers: {
                Authorization,
            },
            data: {
                name: event.target[1].value,
                enName: event.target[2].value,
                parentId: this.state.parentCategory,
            },
        });
        this.refs.tree.reDrawTree();
        this.addCategoryM(false);
    };
    addStore=(event)=>{
        event.preventDefault();
        axios({
            url:PATH_PREFIX+'/api/store',
            method:'post',
            headers:{Authorization},
            params:{
                name:event.target[0].value
            }
        }).then(res=>{
            if(res.data.success){
                this.getStores();
            }
        })
    };
    addProduct = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product",
            method: "post",
            headers: {Authorization},
            data: {
                name: event.target[1].value,
                productTypeId: event.target[2].value,
                attachmentId: this.state.attachmentId,
                categoryId: this.state.parentCategory,
            },
        });
        this.addProductM(false);
        this.refs.tree.reDrawTree();
    };
    addDeliverAll = async () => {
        let {data} = await axios({
            url: PATH_PREFIX + "/api/deliver",
            method: "post",
            headers: {Authorization},
            data: {
                reqDelivers: this.state.delivers,
                description: this.state.deliverAllDescription,
            },
        });
        if (data.success) {
            this.notifySuccess("Mahsulotlar omborga qo'shildi");
            this.setState({
                delivers: [],
                deliverAllDescription: "",
            });
            this.getProduct();
        }
    };
    addProductType = (event) => {
        event.preventDefault();
        axios({
            url: PATH_PREFIX + "/api/productType",
            method: "post",
            headers: {Authorization},
            params: {
                name: event.target[0].value,
            },
        }).then((res) => {
            if (res.data.success) {
                this.getProductType();
            }
        });
    };
    addWaste = (event) => {
        event.preventDefault();
        axios({
            url: PATH_PREFIX + "/api/waste",
            method: "post",
            headers: {Authorization},
            data: {
                deliverId: this.state.waste.id,
                amount: event.target[0].value,
                desc: event.target[1].value,
            },
        }).then((res) => {
            if (res.data.message === "success") {
                this.notifySuccess(
                    "Brak qo'shilishi uchun direktorga so'ro'v jo'natildi"
                );
            }
            if (res.data.message === "faild") {
                this.notifyWarn(
                    "Bu mahsulotga avval ham brak qo'shilgan! Uni tahrilashingiz mumkin"
                );
            }
            this.addWasteM(false);
        });
    };
    addDeliverToBackend = (event) => {
        event.preventDefault();
        let {product, usd} = this.state;
        axios({
            url: PATH_PREFIX + "/api/deliver",
            method: "post",
            headers: {Authorization},
            data: {
                reqDelivers: [{
                    price: product.price,
                    retailPrice: product.retail_price,
                    fullSalePrice: product.full_sale_price,
                    juan: product.juan,
                    usd: usd,
                    amount: event.target[0].value,
                    currency: product.currency,
                    productId: product.id,
                    otherCosts: product.other_costs,
                    customCost: product.custom_cost,
                    fareCost: product.fare_cost
                }],
                description: ''
            }
        }).then(res => {
            if (res.data.success) {
                this.notifySuccess('tezkor kirim qilindi');
                this.getProduct();
            }
        });
        document.getElementById("addDeliverToBackend").value='';
    };
    //get
    getStores=()=>{
        axios({
            url:PATH_PREFIX+'/api/store',
            method:'get',
            headers:{Authorization}
        }).then(res=>{
            if(res.data.success){
                this.setState({
                    stores:res.data.object
                })
            }
        })
    };
    getCategory = () => {
        let {selected, isSelectedProduct} = this.state;
        axios({
            url: PATH_PREFIX + "/api/category/one/" + selected.id,
            method: "get",
            headers: {Authorization},
        }).then((response) => {
            this.setState({
                category: response.data.object,
                isSelectedProduct: false,
            });
        });
    };
    getProduct = () => {
        let {isSelectedProduct, selected, productTab} = this.state;
        axios({
            url: PATH_PREFIX + `/api/product/store/${selected.id}`,
            method: "get",
            headers: {
                Authorization,
            },
        }).then((response) => {
            this.setState({
                product: response.data.object,
                isSelectedProduct: true,
            });
        });
        if (productTab === "deliver-history") {
            this.getProductDelivers();
        }
        if (productTab === "deliver-out-history") {
            this.getProductDeliverOut();
        }
    };
    getParentCategory = async () => {
        let {searchToFindParentId} = this.state;
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/parent",
            headers: {Authorization},
            params: {
                id: searchToFindParentId,
            },
        });
        if (data.success) {
            this.setState({
                searchToFindParentSelected: data.object.path,
                parentCategory: data.object.id,
            });
        }
    };
    getParentSearch = async () => {
        let {searchValue} = this.state;
        if (this.state.searchValue !== "") {
            const {data} = await axios({
                url: PATH_PREFIX + "/api/category/tree/search",
                method: "get",
                headers: {
                    Authorization,
                },
                params: {
                    search: searchValue,
                },
            });
            if (data.success) {
                let searchToFindParent = data.object.filter((item) => !item.isProduct);
                this.setState({
                    searchToFindParent,
                });
            }
        }
        if (this.state.searchValue === "") {
            this.setState({
                searchData: [],
            });
        }
    };
    getProductDelivers = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/deliver/history/" + this.state.product.id,
            headers: {Authorization},
        });

        if (data.success) {
            this.setState({
                productDelivers: data.object,
            });
        }
    };
    getProductDeliverOut = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/deliverOut/history/" + this.state.product.id,
            headers: {Authorization},
        });
        console.log(data.object);

        if (data.success) {
            this.setState({
                productDeliversOuts: data.object,
            });
        }
    };
    getProductType = () => {
        axios({
            url: PATH_PREFIX + "/api/productType/all",
            headers: {Authorization},
            method: "get",
        }).then((res) => {
            this.setState({
                productTypes: res.data.object,
            });
        });
    };
    //put
    editProduct = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product/" + this.state.selected.id,
            method: "patch",
            headers: {Authorization},
            data: {
                name: event.target[1].value,
                productTypeId: event.target[2].value,
                attachmentId: this.state.attachmentId,
                categoryId: this.state.parentCategory,
            },
        });
        this.getProduct();
        this.editProductM(false);
        this.refs.tree.reDrawTree();
    };
    editCategory = async (event) => {
        event.preventDefault();
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/" + this.state.selected.id,
            method: "patch",
            headers: {
                Authorization,
            },
            data: {
                name: event.target[1].value,
                enName: event.target[2].value,
                parentId: this.state.parentCategory,
            },
        });
        this.refs.tree.reDrawTree();
        this.getCategory();
        this.editCategoryM(false);
    };
    //delete
    deleteProduct = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/product/" + this.state.selected.id,
            method: "delete",
            headers: {Authorization},
        });
        if (data.success) {
            this.notifySuccess("mahsulot o'chirildi");
            this.setState({
                selected: {id: null, name: null, type: "not-selected"},
                isSelectedProduct: null,
            });
            this.refs.tree.reDrawTree();
        }
        if (!data.success) {
            this.notifyError("bu mahsulotni o'chirib bo'lmaydi");
        }
    };
    deleteCategory = async () => {
        const {data} = await axios({
            url: PATH_PREFIX + "/api/category/" + this.state.selected.id,
            method: "delete",
            headers: {Authorization},
        });
        if (data.success) {
            this.notifySuccess("kategoriya o'chirildi");
            this.setState({
                selected: {id: null, name: null, type: "not-selected"},
                isSelectedProduct: null,
            });
            this.refs.tree.reDrawTree();
        }
        if (!data.success) {
            this.notifyError("bu kategoriyani o'chirib bo'lmaydi");
        }
    };
    deleteProductType = (uuid) => {
        axios({
            url: PATH_PREFIX + "/api/productType/delete/" + uuid,
            method: "delete",
            headers: {Authorization},
        }).then((res) => {
            if (res.data.success) {
                this.notifySuccess("mahsulot turi o'chirildi");
                this.getProductType();
            }
            if (!res.data.success) {
                this.notifyWarn("bu mahsulot turni o'chira olmaysiz");
            }
        });
    };
    deleteDeliver = async (id) => {
        let accept = window.confirm(
            "Omborga kelgan mahsulotlarni o'chirishni xohlaysizmi"
        );
        if (accept) {
            await axios({
                url: PATH_PREFIX + "/api/deliver/" + id,
                headers: {Authorization},
                method: "delete",
            }).then((res) => {
                if (res.data.message === "success") {
                    this.notifySuccess("omborga kelgan mahsulotlar o'chirildi");
                    this.getProduct();
                }
                if (res.data.message === "failed") {
                    this.notifyWarn("omborda buncha mahsulot yo'q");
                }
                if (res.data.message === "error") {
                    this.notifyError("tizimda xatolik yuz berdi");
                }
            });
            this.getProductDelivers();
        }
    };

    notifySuccess = (text) => toast.success(text);
    notifyError = (text) => toast.error(text);
    notifyWarn = (text) => toast.warn(text);

    render() {
        const {
            productTab,
            searchToFindParentSelected,
            attachmentId,
            searchToFindParent,
            usd
        } = this.state;
        const {product, category, selected, oneDeliver} = this.state;
        const {
            addCategory,
            editCategory,
            addProduct,
            addDeliverOut,
            editProduct,
            productType,
            addDeliver,
            addWaste,
        } = this.state;
        const {productTypes, delivers, productDelivers, productDeliversOuts, stores} = this.state;
        return (
            <div className={"container-fluid"}>
                <div className="codes my-3">
                    <div className="row">
                        <div className="col-4">
                            <div className="btn-group btn-block">
                                <button
                                    onClick={(value) => this.addCategoryM(true)}
                                    className={
                                        "btn rounded-0 btn-outline-dark btn-light fas fa-folder-open p-2"
                                    }
                                >
                                    {" "}
                                    kategoriya qo'shish
                                </button>
                                <button
                                    onClick={(value) => this.addProductM(true)}
                                    className={
                                        "btn rounded-0 btn-outline-dark btn-light fas fa-file p-2"
                                    }
                                >
                                    {" "}
                                    mahsulot qo'shish
                                </button>
                            </div>
                        </div>
                        <div className="col-8 text-center">
                            {selected.type === "product" ? (
                                <div>
                                    <b className={"text-primary"}>mahsulot</b>
                                </div>
                            ) : selected.type === "category" ? (
                                <div>
                                    <b className={"text-info"}>kategoriya</b>
                                </div>
                            ) : selected.type === "not-selected" ? (
                                <div>
                                    <b className={"text-danger"}>tanlanmagan</b>
                                </div>
                            ) : (
                                <div>
                                    tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                    ko'ring
                                </div>
                            )}
                        </div>
                    </div>
                    <hr className={"my-1"}/>
                    <div className="row">
                        <div className="col-4">
                            <SearchTree
                                ref="tree"
                                onSelect={(data) => this.onSelectFromTree(data)}
                                reload={this.reload}
                            />
                        </div>
                        <div className="col-8">
                            {selected.type === "product" ? (
                                <div className={"product"}>
                                    {product ? (
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2>{product.name}</h2>
                                                </div>
                                                <div className="col">
                                                    <div className={"float-right"}>
                                                        <button onClick={(value) => this.editProductM(true)}
                                                                className={"fas fa-edit fa-md btn text-primary"}>
                                                            tahrirlash
                                                        </button>
                                                        <button onClick={this.deleteProduct}
                                                                className={"fas fa-trash-alt fa-md btn text-danger"}>
                                                            o'chirish
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="row my-1">
                                                <div className="col">
                                                    <button onClick={(tab) => this.productTab("product-remain")}
                                                            className="rounded-0 btn-sm btn btn-outline-dark fas fa-table">
                                                        ombordagi qoldiq
                                                    </button>
                                                    <button onClick={(tab) => this.productTab("deliver-history")}
                                                            className={
                                                                "rounded-0 btn-sm btn btn-outline-dark fas fa-history"
                                                            }
                                                    >
                                                        kirimlar tarixi
                                                    </button>
                                                    <button onClick={(tab) => this.productTab("deliver-out-history")}
                                                                 className={
                                                                     "rounded-0 btn-sm btn btn-outline-dark fas fa-history"
                                                                 }
                                                >
                                                    chiqimlar tarixi
                                                </button>
                                                    <button
                                                        onClick={(value) => this.addDeliverM(true)}
                                                        className={"btn btn-sm btn-outline-dark btn-light float-right rounded-0"}
                                                    >
                                                        mahsulot kirim qilish
                                                    </button>
                                                    {
                                                        product.deliver_amount !== 0 ?
                                                            <button
                                                                onClick={(value) => this.addDeliverOutM(true)}
                                                                className={"btn btn-sm btn-outline-dark float-right btn-light rounded-0"}
                                                            >
                                                                mahsulot chiqim qilish
                                                            </button> : <div></div>
                                                    }
                                                </div>
                                            </div>
                                            {productTab === "product-remain" ? (
                                                <div>
                                                    <div className="row">
                                                        <div className="col-7">
                                                            {
                                                                product.deliver_amount !== 0 ?
                                                                    <div className={"border p-3"}>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>omborda qolgan soni: </span>{Math.round(product.ending_amount*100)/100} {product.type} +
                                                                            <form className={'d-inline'}
                                                                                  onSubmit={this.addDeliverToBackend}>
                                                                                <input min={0}
                                                                                       step={0.001}
                                                                                       id={'addDeliverToBackend'}
                                                                                       placeholder={'necha ' + product.type + '?'}
                                                                                       className={'border rounded w-25'}
                                                                                       type="number"/>
                                                                            </form>
                                                                        </p>

                                                                        <p>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>pul birligi: </span>{product.currency}
                                                                        </p>

                                                                        <p style={{lineHeight:1}}>
                                                                            {
                                                                                product.juan ?
                                                                                    <div><span
                                                                                        className={"btn-outline-dark font-weight-bold"}>juan: </span>{product.juan}
                                                                                    </div> :
                                                                                    <div></div>
                                                                            }
                                                                        </p>
                                                                        <hr/>

                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>tannarx: </span>{product.price} {product.currency}
                                                                        </p>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>bojxona xarajat: </span>{product.custom_cost} {product.currency}
                                                                        </p>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>yo'lkira xarajat: </span>{product.fare_cost} {product.currency}
                                                                        </p>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>boshqa xarajatlar: </span>{product.other_costs} {product.currency}
                                                                        </p>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>umumiy xarajat: </span>{product.price+product.custom_cost+product.fare_cost+product.other_costs} {product.currency}
                                                                        </p>
                                                                        <hr/>

                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>chakana savdo: </span>{product.retail_price} UZS <h6 style={{lineHeight:0}}
                                                                                                                                                                                     className={'d-inline'}>{product.currency == 'UZS' ? (100 - Math.round((product.price + product.custom_cost + product.fare_cost + product.other_costs) / product.retail_price * 100)) : (100 - Math.round((product.price + product.custom_cost + product.fare_cost + product.other_costs) * usd / product.retail_price * 100))} %</h6>
                                                                        </p>
                                                                        <p style={{lineHeight:1}}>
                                                                            <span
                                                                                className={"btn-outline-dark font-weight-bold"}>ulgurji savdo: </span>{product.full_sale_price} UZS <h6 style={{lineHeight:0}}
                                                                                                                                                                                        className={'d-inline'}>{product.currency == 'UZS' ? (100 - Math.round((product.price + product.custom_cost + product.fare_cost + product.other_costs) / product.full_sale_price * 100)) : (100 - Math.round((product.price + product.custom_cost + product.fare_cost + product.other_costs) * usd / product.full_sale_price * 100))} %</h6>
                                                                        </p>
                                                                    </div>
                                                                    : <div className={'text-center'}>
                                                                        <b className={'text-center'}>To'liq ma'lumotni
                                                                            ko'rish uchun kirim qiling</b>
                                                                        <br/>
                                                                        <button
                                                                            onClick={(value) => this.addDeliverM(true)}
                                                                            className={"btn btn-sm btn-outline-primary btn-light rounded-0"}
                                                                        >
                                                                            mahsulot kirim qilish
                                                                        </button>
                                                                    </div>
                                                            }
                                                        </div>
                                                        <div className="col-5">
                                                            <img
                                                                className={"border font"}
                                                                style={{width: "100%", height: 250}}
                                                                src={
                                                                    product.attachment_id ?
                                                                        PATH_PREFIX + "/api/file/get/" + product.attachment_id
                                                                        : productImage
                                                                }
                                                                alt="product picture"
                                                            />
                                                            <div className={"text-center"}>
                                                                {product.created_at.substring(0, 10)}
                                                                <br/>{Math.round((product.size / 1024 / 1024) * 100) / 100} mb
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {delivers.length !== 0 ? (
                                                        <div>
                                                            <div className="row my-3">
                                                                <div className="col">
                                                                    <table className="table table-striped">
                                                                        <thead>
                                                                        <tr>
                                                                            <th className={"text-center"}>№</th>
                                                                            <th className={"text-center"}>
                                                                                mahsulot
                                                                            </th>
                                                                            <th className={"text-center"}>soni</th>
                                                                            <th className={"text-center"}>narxi</th>
                                                                            <th className={"text-center"}>
                                                                                umumiy narx
                                                                            </th>
                                                                            <th className={"text-center"}>
                                                                                operatiya
                                                                            </th>
                                                                        </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                        {delivers.map((item, index) => (
                                                                            <tr>
                                                                                <td className={"text-center"}>
                                                                                    {index + 1}
                                                                                </td>
                                                                                <td className={"text-center"}>
                                                                                    {item.name}
                                                                                </td>
                                                                                <td className={"text-center"}>
                                                                                    {item.amount}
                                                                                </td>
                                                                                <td className={"text-center"}>
                                                                                    {item.displayPrice}
                                                                                </td>
                                                                                <td className={"text-center"}>
                                                                                    {item.endingPrice}
                                                                                </td>
                                                                                <td className={"text-center"}>
                                                                                    <button
                                                                                        onClick={(key) =>
                                                                                            this.removeDeliver(item.key)
                                                                                        }
                                                                                        className="btn m-0 p-0 px-2 rounded-0 btn-outline-dark"
                                                                                    >
                                                                                        -
                                                                                    </button>
                                                                                </td>
                                                                            </tr>
                                                                        ))}
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                            <div className="row">
                                                                <div className="col-5 my-auto">
                                                                    <p className={"h-100"}>
                                                                        omborga mahsulotlar qo'shilsinmi?
                                                                    </p>
                                                                </div>
                                                                <div className="col-4">
                                                                </div>
                                                                <div className="col-3 my-auto">
                                                                    <div className="btn btn-group btn-block">
                                                                        <button
                                                                            className={
                                                                                "btn-outline-danger fas fa-trash-alt btn rounded-0"
                                                                            }
                                                                            onClick={this.clearDeliver}
                                                                        ></button>
                                                                        <button
                                                                            className={
                                                                                "btn-outline-primary fas fa-check-square btn rounded-0"
                                                                            }
                                                                            onClick={this.addDeliverAll}
                                                                        ></button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className={"text-center"}></div>
                                                    )}
                                                </div>
                                            ) : productTab === "deliver-history" ? (
                                                <div className={"row"}>
                                                    <div className="col">
                                                        <h5 className={"text-center"}>Kirimlar tarixi</h5>
                                                    </div>
                                                    <table className="table">
                                                        <thead>
                                                        <tr>
                                                            <td className={"text-center"}>
                                  <span
                                      className={"fas fa-sort-amount-down"}
                                  ></span>
                                                            </td>
                                                            <td className={"text-center"}>
                                                                <span className={"fas fa-file"}></span>
                                                                <b> mahsulot</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                                                <b>soni</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                                                <b>narxi</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                  <span
                                      className={"fas fa-hand-holding-usd"}
                                  ></span>
                                                                <b> dollar narxi</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                                                <b>xarajatlar</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                                                <b> sana</b>
                                                            </td>
                                                            <td className={"text-center"}>
                                  <span
                                      className={"fas fa-tools bg-white border-0"}
                                  ></span>
                                                                <b> tools</b>
                                                            </td>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {productDelivers ? (
                                                            productDelivers.map((item, index) => (
                                                                <tr>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {index + 1}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.product.name}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.amount}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {Math.round(item.price)} UZS
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {Math.round(item.usd)} USD
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {Math.round(
                                                                            item.otherCosts +
                                                                            item.fareCost +
                                                                            item.customCost
                                                                        )}{" "}
                                                                        {item.currencyType}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        {item.createdAt.substring(0, 10)}
                                                                    </td>
                                                                    <td
                                                                        style={{fontSize: "12px"}}
                                                                        className={"text-center"}
                                                                    >
                                                                        <div className="btn-group">
                                                                            {this.props.currentUser.roles.map(
                                                                                (role) =>
                                                                                    role.roleName ===
                                                                                    "ROLE_DIRECTOR" && (
                                                                                        <button
                                                                                            onClick={(id) =>
                                                                                                this.deleteDeliver(item.id)
                                                                                            }
                                                                                            className={
                                                                                                "btn rounded-0 btn-outline-dark fas fa-trash fa-sm"
                                                                                            }
                                                                                        ></button>
                                                                                    )
                                                                            )}
                                                                            <button
                                                                                onClick={(value, waste) =>
                                                                                    this.addWasteM(true, item)
                                                                                }
                                                                                className={
                                                                                    "btn rounded-0 btn-outline-dark fas fa-dumpster fa-sm"
                                                                                }
                                                                            >
                                                                                {" "}
                                                                                brak
                                                                            </button>
                                                                        </div>
                                                                    </td>
                                                                </tr>
                                                            ))
                                                        ) : (
                                                            <div>sth weird has happened</div>
                                                        )}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            ):productTab==='deliver-out-history'?
                                                <div>
                                                    <div className="col">
                                                        <h5 className={"text-center"}>Chiqimlar tarixi</h5>
                                                        <table className={'table'}>
                                                            <thead>
                                                            <tr>
                                                                <td className={"text-center"}>
                                  <span
                                      className={"fas fa-sort-amount-down"}
                                  ></span>
                                                                </td>
                                                                <td className={"text-center"}>
                                                                    <span className={"fas fa-file"}></span>
                                                                    <b> mahsulot</b>
                                                                </td>
                                                                <td className={"text-center"}>
                                                                    <b>soni</b>
                                                                </td>
                                                                <td className={"text-center"}>
                                                                    <b>narxi</b>
                                                                </td>
                                                                <td className={"text-center"}>
                                  <span
                                      className={"fas fa-hand-holding-usd"}
                                  ></span>
                                                                    <b> dollar narxi</b>
                                                                </td>
                                                                <td className={"text-center"}>
                                                                    <b>ombor</b>
                                                                </td>
                                                                <td className={"text-center"}>
                                  <span
                                      className={"fas fa-calendar-day"}
                                  ></span>
                                                                    <b> sana</b>
                                                                </td>
                                                            </tr>
                                                            </thead>
                                                            {
                                                                productDeliversOuts?
                                                                    <tbody>
                                                                    {
                                                                        productDeliversOuts.map((item,index)=>
                                                                            <tr>
                                                                                <td className={'text-center'}>{index+1}</td>
                                                                                <td className={'text-center'}>{item.product.name}</td>
                                                                                <td className={'text-center'}>{item.amount}</td>
                                                                                <td className={'text-center'}>{item.price}</td>
                                                                                <td className={'text-center'}>{item.usd}</td>
                                                                                <td className={'text-center'}>{item.store.name}</td>
                                                                                <td className={'text-center'}>{item.createdAt.substring(0,10)}</td>
                                                                            </tr>
                                                                        )
                                                                    }
                                                                    </tbody>
                                                                    :<div className={'text-center'}>
                                                                    loading...
                                                                    </div>
                                                            }
                                                        </table>
                                                    </div>
                                                </div>: (
                                                <div className={"row"}>
                                                    <div className="col text-center">
                                                        tizimda nimadir xatolik yuz berdi. Iltimos qaytadan
                                                        urinib ko'ring
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className={"text-center"}>
                                            tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                            ko'ring
                                        </div>
                                    )}
                                </div>
                            ) : selected.type === "category" ? (
                                <div className={"category"}>
                                    {category ? (
                                        <div>
                                            <div className="row">
                                                <div className="col">
                                                    <h2 className={"text-center"}>{category.name} </h2>
                                                    <b className={""}>{category.enName} </b>
                                                    <b className={""}>
                                                        - {category.createdAt.substring(0, 10)}
                                                    </b>
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col text-center">
                                                    <div>
                                                        <button
                                                            onClick={(value) => this.editCategoryM(true)}
                                                            className={"fas fa-edit fa-md btn text-primary"}
                                                        >
                                                            tahrirlash
                                                        </button>
                                                        <button
                                                            onClick={this.deleteCategory}
                                                            className={
                                                                "fas fa-trash-alt fa-md btn text-danger"
                                                            }
                                                        >
                                                            o'chirish
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={"text-center"}>
                                            tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                            ko'ring
                                        </div>
                                    )}
                                </div>
                            ) : selected.type === "not-selected" ? (
                                <div className={"not-selected"}>
                                    <div className="row">
                                        <div className="col text-center">
                                            <button
                                                onClick={(value) => this.addCategoryM(true)}
                                                className={"btn fas fa-folder-open fa-lg p-3"}
                                            >
                                                {" "}
                                                kategoriya qo'shish
                                            </button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <div className="col text-center">
                                            Mahsulot yoki kategoriya tanlangani yo'q.
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className={"text-center"}>
                                    tizimda nimadir xatolik yuz berdi. Iltimos qaytadan urinib
                                    ko'ring
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className="modals">
                    <Modal isOpen={addProduct}>
                        <ModalHeader>Mahsulot qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addProduct"} onSubmit={this.addProduct}>
                                {/*search*/}
                                <Select
                                    showSearch
                                    defaultValue={searchToFindParentSelected}
                                    style={{width: "100%"}}
                                    placeholder="Kategoriyani tanlang"
                                    optionFilterProp="children"
                                    onChange={this.onSelectFromInput}
                                    onSearch={this.onSearch}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {searchToFindParent.map((item) => (
                                        <Option style={{}} value={item.id}>
                                            {item.path}
                                        </Option>
                                    ))}
                                </Select>
                                {/*inputs*/}
                                <input
                                    placeholder={"nomi"}
                                    className={"form-control my-2"}
                                    type="text"
                                    required
                                />
                                <select
                                    name="productType"
                                    className={"btn border w-75"}
                                    required
                                >
                                    {productTypes.map((item) => (
                                        <option value={item.id}>{item.name}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={(value) => this.productTypeM(true)}
                                    className={"btn w-25 border"}
                                    type={"button"}
                                >
                                    o'zgartirish
                                </button>
                                <Upload
                                    name="attachment"
                                    showUploadList={false}
                                    beforeUpload={this.beforeUpload}
                                    customRequest={this.customRequest}
                                    className="btn btn-block"
                                >
                                    {attachmentId ?
                                        <img src={PATH_PREFIX + "/api/file/get/" + attachmentId} alt="product"
                                             style={{width: '40%'}}/>
                                        :
                                        <div>
                                            <PlusOutlined/>
                                            <div className="mt-2">rasm yuklash</div>
                                        </div>
                                    }
                                </Upload>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.addProductM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button form={"addProduct"} className={"btn btn-outline-primary"}>
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addDeliverOut}>
                        <ModalHeader>
                            Mahsulot chiqim qilish
                        </ModalHeader>
                        <ModalBody>
                            {
                                product?
                                    <div>
                                        <form id={'addDeliverOut'} onSubmit={this.addDeliverOut}>
                                            Mahsulot chiqim soni
                                            <input step={0.001} className={'form-control'} type="number" min={0} max={product.ending_amount}/>
                                            Omborni tanlang
                                            <select className={'form-control'}>
                                                {
                                                    stores.map(item=>
                                                        <option value={item.id}>{item.name}</option>
                                                    )
                                                }
                                            </select>
                                        </form>
                                        <form id={'addStore'} className={'my-1'} onSubmit={this.addStore}>
                                            <input className={'form-control w-75 float-left'} placeholder={"ombor qo'shish"} type="text" required/>
                                            <button className={'btn btn-outline-primary w-25 float-right'}>qo'shish</button>
                                        </form>
                                    </div>
                                    :<div className={'text-center'}>Tizimda nimadir xatolik yuz berdi</div>
                            }
                        </ModalBody>
                        <ModalFooter>
                            <button onClick={(value) => this.addDeliverOutM(false)}
                                    className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"addDeliverOut"}
                                className={"btn btn-outline-primary"}
                            >
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={addCategory}>
                        <ModalHeader>Kategoriya qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addCategory"} onSubmit={this.addCategory}>
                                {/*search*/}
                                joylashgan joyi
                                <Select
                                    showSearch
                                    defaultValue={searchToFindParentSelected}
                                    style={{width: "100%"}}
                                    placeholder="Select parent"
                                    optionFilterProp="children"
                                    onChange={this.onSelectFromInput}
                                    onSearch={this.onSearch}
                                    filterOption={(input, option) =>
                                        option.children
                                            .toLowerCase()
                                            .indexOf(input.toLowerCase()) >= 0
                                    }
                                >
                                    {searchToFindParent.map((item) => (
                                        <Option style={{}} value={item.id}>
                                            {item.path}
                                        </Option>
                                    ))}
                                </Select>
                                {/*inputs*/}
                                nomi
                                <input
                                    placeholder={"nomi"}
                                    className={"form-control my-2"}
                                    type="text"
                                    required
                                />
                                inglizchada nomi
                                <input
                                    placeholder={"inglizcha nomi"}
                                    className={"form-control my-2"}
                                    type="text"
                                />
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.addCategoryM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"addCategory"}
                                className={"btn btn-outline-primary"}
                            >
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={editCategory}>
                        <ModalHeader>Edit Category</ModalHeader>
                        <ModalBody>
                            {category ? (
                                <form id={"editCategory"} onSubmit={this.editCategory}>
                                    {/*search*/}
                                    joylashgan joyi
                                    <Select
                                        showSearch
                                        defaultValue={searchToFindParentSelected}
                                        style={{width: "100%"}}
                                        placeholder="Select parent"
                                        optionFilterProp="children"
                                        onChange={this.onSelectFromInput}
                                        onSearch={this.onSearch}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {searchToFindParent.map((item) => (
                                            <Option style={{}} value={item.id}>
                                                {item.path}
                                            </Option>
                                        ))}
                                    </Select>
                                    {/*inputs*/}
                                    nomi
                                    <input
                                        defaultValue={category.name}
                                        placeholder={"nomi"}
                                        className={"form-control my-2"}
                                        type="text"
                                        required
                                    />
                                    inglizchada nomi
                                    <input
                                        defaultValue={category.enName}
                                        placeholder={"inglizcha nomi"}
                                        className={"form-control my-2"}
                                        type="text"
                                    />
                                </form>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.editCategoryM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"editCategory"}
                                className={"btn btn-outline-primary"}
                            >
                                tahrirlash
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={editProduct}>
                        <ModalHeader>Mahsulotni tahrirlash</ModalHeader>
                        <ModalBody>
                            {product ? (
                                <form id={"editProduct"} onSubmit={this.editProduct}>
                                    <Select
                                        showSearch
                                        defaultValue={searchToFindParentSelected}
                                        style={{width: "100%"}}
                                        placeholder="Kategoriyani tanlang"
                                        optionFilterProp="children"
                                        onChange={this.onSelectFromInput}
                                        onSearch={this.onSearch}
                                        filterOption={(input, option) =>
                                            option.children
                                                .toLowerCase()
                                                .indexOf(input.toLowerCase()) >= 0
                                        }
                                    >
                                        {searchToFindParent.map((item) => (
                                            <Option style={{}} value={item.id}>
                                                {item.path}
                                            </Option>
                                        ))}
                                    </Select>
                                    {/*inputs*/}
                                    <input
                                        defaultValue={product.name}
                                        placeholder={"nomi"}
                                        className={"form-control my-2"}
                                        type="text"
                                        required
                                    />
                                    <select
                                        defaultValue={product.type_id}
                                        name="productType"
                                        className={"btn border w-75"}
                                        required
                                    >
                                        {productTypes.map((item) => (
                                            <option value={item.id}>{item.name}</option>
                                        ))}
                                    </select>
                                    <button
                                        onClick={(value) => this.productTypeM(true)}
                                        className={"btn w-25 border"}
                                        type={"button"}
                                    >
                                        o'zgartirish
                                    </button>
                                    <Upload
                                        name="attachment"
                                        showUploadList={false}
                                        beforeUpload={this.beforeUpload}
                                        customRequest={this.customRequest}
                                        className="btn btn-block"
                                    >
                                        {attachmentId ? (
                                            <img
                                                src={PATH_PREFIX + "/api/file/get/" + attachmentId}
                                                alt="product"
                                                style={{width: "150px", height: "150px"}}
                                            />
                                        ) : (
                                            <div>
                                                <PlusOutlined/>
                                                <div className="mt-2">rasm yuklash</div>
                                            </div>
                                        )}
                                    </Upload>
                                </form>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                onClick={(value) => this.editProductM(false)}
                                className={"btn btn-outline-danger"}
                            >
                                bekor qilish
                            </button>
                            <button
                                form={"editProduct"}
                                className={"btn btn-outline-primary"}
                            >
                                tahrirlash
                            </button>
                        </ModalFooter>
                    </Modal>

                    <Modal isOpen={productType} size={"lg"}>
                        <ModalBody>
                            <div className={"row"}>
                                {productTypes.map((item, index) => (
                                    <div className="col-6 my-2">
                                        <div className="card">
                                            <div className="card-body">
                                                {item.name}
                                                <a
                                                    onClick={(uuid) => this.deleteProductType(item.id)}
                                                    className={"text-danger float-right"}
                                                >
                                                    x
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <form onSubmit={this.addProductType}>
                                <input
                                    placeholder={"kg, litr, dona ..."}
                                    required
                                    type="text"
                                    className={"btn border w-75"}
                                />
                                <button className={"btn border w-25"}>add</button>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className={"btn btn-outline-danger"}
                                onClick={(value) => this.productTypeM(false)}
                            >
                                chiqish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addDeliver} size={"md"}>
                        <ModalHeader>Omborga mahsulot qo'shish</ModalHeader>
                        <ModalBody>
                            {oneDeliver ? (
                                <div className={'text-right'}>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Pul birligi: </b>
                                        <select
                                            onChange={(event, type) => this.oneDelivers(event, "currency")}
                                            value={oneDeliver.currency} className={'border btn d-inline'} required>
                                            <option value="UZS">so'm</option>
                                            <option value="USD">dollar</option>
                                        </select> <br/>
                                    </div>
                                    <div className={'my-1'}>
                                        <b className={'d-inline'}>Buyurtmadagi mahsulotlar soni: </b>
                                        <input onChange={(event, type) => this.oneDelivers(event, "amount")}
                                               value={oneDeliver.amount} className={'border btn d-inline'}
                                               type="number"/> <br/>
                                    </div>
                                    <div className="row border m-1 my-2">
                                        <div className="col-6">
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Tannarx:</b>
                                                <input onChange={(event, type) => this.oneDelivers(event, "price")}
                                                       value={oneDeliver.price} className={'border btn d-inline'}
                                                       type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Yo'lkira:</b>
                                                <input step={0.001} onChange={(event, type) => this.oneDelivers(event, "fareCost")}
                                                       value={oneDeliver.fareCost} className={'border btn d-inline'}
                                                       type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Bojxona:</b>
                                                <input onChange={(event, type) => this.oneDelivers(event, "customCost")}
                                                       value={oneDeliver.customCost} className={'border btn d-inline'}
                                                       type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Boshqa xarajatlar:</b>
                                                <input onChange={(event, type) => this.oneDelivers(event, "otherCosts")}
                                                       value={oneDeliver.otherCosts} className={'border btn d-inline'}
                                                       type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>jaun:</b>
                                                <input onChange={(event, type) => this.oneDelivers(event, "juan")}
                                                       value={oneDeliver.juan} className={'border btn d-inline'}
                                                       type="number"/> <br/>
                                            </div>
                                        </div>
                                        <div className="col-6 h-100 my-auto">
                                            <h6>Xarajatlar yig'indisi</h6>
                                            <hr/>
                                            <h4 className={'d-inline bg-white'}>{Math.round(oneDeliver.endingExpense * 100) / 100}</h4> {oneDeliver.currency === 'UZS' ?
                                            <div className={'d-inline'}>so'm</div> :
                                            <div className={'d-inline'}>dollar</div>}
                                        </div>
                                    </div>
                                    <div className="row border m-1 my-2">
                                        <div className="col-6">
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Chakana savdo:</b>

                                                <input
                                                    onChange={(event, type) => this.oneDelivers(event, "retailPrice")}
                                                    value={oneDeliver.retailPrice} className={'border btn d-inline'}
                                                    type="number"/> <br/>
                                            </div>
                                            <div className={'my-1'}>
                                                <b className={'d-inline'}>Ulgurji savdo:</b>
                                                <input
                                                    onChange={(event, type) => this.oneDelivers(event, "fullSalePrice")}
                                                    value={oneDeliver.fullSalePrice} className={'border btn d-inline'}
                                                    type="number"/> <br/>
                                            </div>
                                        </div>
                                        <div className="col-6 my-1">
                                            <div>
                                                chakana savdo foyda
                                                <br/>
                                                <h5 className={'d-inline'}>{oneDeliver.retailPricePercentage}</h5> %
                                            </div>
                                            <hr/>
                                            <div>
                                                ulgurji savdo foyda
                                                <br/>
                                                <h5 className={'d-inline'}>{oneDeliver.fullSalePricePercentage}</h5> %
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>sth weird has happened</div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <button
                                className={"btn btn-outline-danger"}
                                onClick={(value) => this.addDeliverM(false)}
                            >
                                bekor qilish
                            </button>
                            <button onClick={this.addDeliver} className={"btn btn-outline-primary"}>
                                qo'shish
                            </button>
                        </ModalFooter>
                    </Modal>
                    <Modal isOpen={addWaste}>
                        <ModalHeader>Brak qo'shish</ModalHeader>
                        <ModalBody>
                            <form id={"addWaste"} onSubmit={this.addWaste}>
                                <input type="number" placeholder={"brak mahsulotlar soni"}
                                       className={"form-control my-2"} max={this.state.waste.amount&&product.ending_amount} min={0} required/>
                                <input type="text" placeholder={"qo'shimcha izoh"} className={"form-control my-2"} required/>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <button className={"btn btn-outline-danger"}
                                    onClick={(value) => this.addWasteM(false)}>bekor qilish
                            </button>
                            <button form={"addWaste"} className={"btn btn-outline-primary"}>qo'shish</button>
                        </ModalFooter>
                    </Modal>

                    <div>
                        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false}
                                        newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable
                                        pauseOnHover/>
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;