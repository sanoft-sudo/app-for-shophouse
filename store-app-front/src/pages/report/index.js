import React, {Component, PureComponent} from 'react';
import axios from 'axios';
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import productImage from '../../assets/product.png'
import Pagination from "react-js-pagination";

class Index extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            data:[],
            search:'',
            sort:'up',
            page:0,
            totalElements:0
        };
    }
    getData=()=>{
        axios({
            url:PATH_PREFIX+'/api/product/remain',
            headers:{Authorization},
            params:{
                search:this.state.search,
                sort:this.state.sort,
                page:this.state.page,
                size:10
            }
        }).then(res=>{
            if(res.data.success){
                console.log(res.data.object.content)
                this.setState({
                    data:res.data.object.content,
                    totalElements:res.data.object.totalElements
                });
            }
        })
    };
    handlePageChange=async (pageNumber)=>{
        await this.setState({
            page:pageNumber-1
        });
        this.getData();
    };

    searchChange=async (event)=>{
        await this.setState({
            search:event.target.value
        });
        this.getData();
    };
    sort=async (value)=>{
      await this.setState({
          sort:value
      });
      this.getData();
    };

    componentDidMount() {
        this.getData();
    }



    render() {
        return (
            <div className={"container-fluid"}>
                <div className="row my-2">
                    <div className="col">
                        <h3 className={'text-center'}>Ombor qoldig'i</h3>
                    </div>
                </div>
                <div className="row my-1">
                    <div className="col-9">
                        <a href="http://localhost/download/product.xlsx" className={'fas fa-download text-dark'}></a>
                    </div>
                    <div className="col-3">
                        <input placeholder={'izlash'} onChange={this.searchChange} className={'form-control'} type="text"/>
                    </div>
                </div>
                <div className="row my-1">
                    <div className="col">
                        <div className={'table'}>
                            <thead>
                            <tr>
                                <td className={'text-center'}><b className='font-weight-bold'>№</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Rasm</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Mahsulot nomi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Mahsulot nomiEn</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Miqdori {this.state.sort==='up'?<button onClick={value=>this.sort('down')} className='btn btn-white fas fa-sort-up'></button>:<button onClick={value=>this.sort('up')} className='btn btn-white fas fa-sort-down'></button>}</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Yuan narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Kelib tushish narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Kelib tushish narxi bo'yicha summa</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Tan narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Bojxona narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Yolkira narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Boshqa xarajtlar</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Sotish narxi</b></td>
                                <td className={'text-center'}><b className='font-weight-bold'>Sotish narxi boyicha summa</b></td>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                this.state.data.map((item, index)=>
                                    <tr>
                                        <td className='myFont text-center px-1'>{index+1}</td>
                                        <td className='myFont text-center px-1'><img style={{width:40, height:30}} src={item.content===null?productImage:'data:image/jpg;base64,'+item.content} alt={'mahsulot'}/></td>
                                        <td className='myFont text-center px-1'>{item.uz_name}</td>
                                        <td className='myFont text-center px-1'>{item.en_name}</td>
                                        <td className='myFont text-center px-1'>{item.amount.toLocaleString()}</td>
                                        <td className='myFont text-center px-1'>{item.juan.toLocaleString()}</td>
                                        <td className='myFont text-center px-1'>{item.ending_price.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.amount_ending_price.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.price.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.custom_cost.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.fare_cost.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.other_costs.toLocaleString()} {item.currency}</td>
                                        <td className='myFont text-center px-1'>{item.retail_price.toLocaleString()} UZS</td>
                                        <td className='myFont text-center px-0'>{item.amount_retail_price.toLocaleString()} UZS</td>
                                    </tr>
                                )
                            }
                            </tbody>
                        </div>
                        <Pagination
                            itemClass="page-item"
                            linkClass="page-link"
                            itemsCountPerPage={10}
                            totalItemsCount={this.state.totalElements}
                            pageRangeDisplayed={5}
                            onChange={this.handlePageChange}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Index;