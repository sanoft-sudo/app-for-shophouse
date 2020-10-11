import React, {Component} from 'react';
import axios from 'axios';
import {PATH_PREFIX, Authorization} from "../../utils/path_controller";
import {LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,} from 'recharts';
import { DatePicker } from 'antd';
import moment from 'moment';
import 'antd/dist/antd.css';

const { RangePicker } = DatePicker;

class Index extends Component {
    constructor(props) {
        super(props);
        this.state={
            incomeData:null,
            income:null,
            expense:null,
            loan:null,
            data:[],
            stat:[],
            start:[moment().startOf('month'), moment().endOf('month')][0],
            end:[moment().startOf('month'), moment().endOf('month')][1],
            table:false
        }
    }

    componentDidMount() {
        this.getIncomeData();
        this.getStat()
    }

    getIncomeData=async ()=>{
        const {data}=await axios({
            url:PATH_PREFIX+'/api/trade/income',
            headers:{Authorization}
        });
        if(data.success){
            let incomeData=data.object;

            let income=incomeData.trade+incomeData.deliver_out-incomeData.discount-incomeData.waste;
            let expense=incomeData.deliver+incomeData.custom_cost+incomeData.fare_cost+incomeData.other_costs;
            let loan=incomeData.loan-incomeData.loan_payment;

            this.setState({
                incomeData,
                income,
                expense,
                loan
            })
        }
    };
    getStat=async ()=>{
        const {data}=await axios({
            url:PATH_PREFIX+'/api/trade/stat',
            headers:{Authorization},
            params:{
                start:this.state.start,
                end:this.state.end
            }
        });

        if(data.success){
            let object=data.object;
            let stat=[];

            for (let i = 0; i < object.length; i++) {
                let one={name: object[i].name, income:object[i].income, cash:object[i].cash, card:object[i].card, bank:object[i].bank, dailyMoney:object[i].cash+object[i].card+object[i].bank-object[i].expense-object[i].customCost-object[i].fareCost-object[i].otherCosts-object[i].discount-object[i].waste-object[i].loan+object[i].loanPayment}
                stat.push(one)
            }

            this.setState({
                data:stat,
                stat:data.object
            })
        }
    };

    makePretty=(number)=>{
        return number.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
    };
    onDateSelect=async (dates, dateStrings)=> {
        if(dates!=null){
            await this.setState({
                start:dates[0],
                end:dates[1]
            });
            this.getStat()
        }
    };
    table=(value)=>{
        this.setState({
            table:value
        })
    };



    render() {
        const {incomeData, income, expense, loan, data, table}=this.state;
        return (
            <div className={'container-fluid'}>
                <div className={'my-3'}>
                    <div className="bg-light rounded my-4">
                        {
                            incomeData?
                                <div>
                                    <div style={{width:'100%'}}>
                                        <div className="row">
                                            <div className="col-6 text-center">
                                                <h3>{ Math.round(income-expense).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} so'm</h3>
                                                <p>sof foyda</p>
                                            </div>
                                            <div className="col-6 text-center">
                                                <h3>{Math.round(income-expense-loan).toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")} so'm</h3>
                                                <p>kassada bor</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{width:'100%'}} className='d-flex'>
                                        <div style={{margin:'1%', width:'34.5%', height: 170}} className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{this.makePretty(Math.round(expense))} so'm</h4>
                                                <p className={'text-light'}>xarajat</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.deliver))}</p>
                                                            <p style={{fontSize:'10px'}}>xarajat</p>
                                                        </div>
                                                        <div className="col-1 text-light">+</div>
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.custom_cost))}</p>
                                                            <p style={{fontSize:'10px'}}>bojxona</p>
                                                        </div>
                                                        <div className="col-1 text-light">+</div>
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.fare_cost))}</p>
                                                            <p style={{fontSize:'10px'}}>yo'lkira</p>
                                                        </div>
                                                        <div className="col-1 text-light">+</div>
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.other_costs))}</p>
                                                            <p style={{fontSize:'10px'}}>boshqa</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin:'1%', width:'25%', height: 170}} className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{this.makePretty(Math.round(loan))} so'm</h4>
                                                <p className={'text-light'}>qarz</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        <div className="col-4 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.loan))}</p>
                                                            <p style={{fontSize:'10px'}}>qarz</p>
                                                        </div>
                                                        <div className="col-4 text-light">-</div>
                                                        <div className="col-4 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.loan_payment))}</p>
                                                            <p style={{fontSize:'10px'}}>to'langan qarz</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div style={{margin:'1%', width:'34.5%', height: 170}} className='bg-secondary rounded'>
                                            <div className="text-center mt-3">
                                                <h4 className={'text-light'}>{(this.makePretty(Math.round(income)))} so'm</h4>
                                                <p className={'text-light'}>foyda</p>
                                                <div className={'mx-4'}>
                                                    <div className="row">
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.trade+incomeData.deliver_out))}</p>
                                                            <p style={{fontSize:'10px'}}>foyda</p>
                                                        </div>
                                                        <div className="col-1 text-light">-</div>
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.discount))}</p>
                                                            <p style={{fontSize:'10px'}}>chegirma</p>
                                                        </div>
                                                        <div className="col-1 text-light">-</div>
                                                        <div className="col-2 text-light">
                                                            <p style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.received))}</p>
                                                            <p style={{fontSize:'10px'}}>qabul qilingan pul</p>
                                                        </div>
                                                        <div className="col-1 text-light">-</div>
                                                        <div className="col-2 text-light">
                                                            <p  style={{lineHeight:'1px'}}>{this.makePretty(Math.round(incomeData.waste))}</p>
                                                            <p style={{fontSize:'10px'}}>brak</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                :
                                <div className={'text-center p-5'}>
                                    loading...
                                </div>
                        }
                    </div>

                    <div style={{width:'100%'}} className={'text-center'}>
                        <RangePicker
                            defaultValue={[moment().startOf('month'), moment().endOf('month')]}
                            ranges={{
                                'This Week': [moment().startOf('week'), moment().endOf('week')],
                                'This Month': [moment().startOf('month'), moment().endOf('month')],
                            }}
                            onChange={this.onDateSelect}
                        />
                    </div>

                    {
                        table?
                            <div>
                                <div style={{width:'100%'}} className={'text-center'}>
                                    <a onClick={(value)=>this.table(false)} className={'text-primary'}>jadvalni yopish</a>
                                </div>
                                <table className={'table table-striped table-hover'}>
                                    <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>vaqt</th>
                                        <th>tushum</th>
                                        <th>naqd</th>
                                        <th>plastik</th>
                                        <th>bank</th>
                                        <th>foyda</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {
                                        data.map((item, index)=>
                                            <tr>
                                                <td>{index+1}</td>
                                                <td>{item.name}</td>
                                                <td>{item.income}</td>
                                                <td>{item.cash}</td>
                                                <td>{item.card}</td>
                                                <td>{item.bank}</td>
                                                <td>{item.dailyMoney}</td>
                                            </tr>
                                        )
                                    }
                                    </tbody>
                                </table>
                            </div>
                            :
                            <div>
                                <div style={{width:'100%'}} className={'text-center'}>
                                    <a onClick={(value)=>this.table(true)} className={'text-primary'}>jadvalni ko'rsatish</a>
                                </div>
                                <LineChart width={1300} height={300} data={data}>
                                    <CartesianGrid strokeDasharray='4 4' />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Line type="monotone" dataKey="dailyMoney" stroke="green" />
                                </LineChart>
                            </div>
                    }

                </div>
            </div>
        );
    }
}

export default Index;