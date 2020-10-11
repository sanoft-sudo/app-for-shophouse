import React from 'react';
import 'antd/dist/antd.css';
import {Tree, Input, Select} from 'antd';
import axios from "axios";
import {Authorization, PATH_PREFIX} from "../utils/path_controller";

const {DirectoryTree} = Tree;
const {Search} = Input;
const {Option} = Select;


class SearchTree extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            searchData: [],
            //selected
            selectedKeys: [],
            selectedKeysData: {title: null, key: null, children: null, isLeaf: null},
            //expanded
            expandedKeys: [],
            autoExpandParent: false,
            //search
            searchValue: '',
        }
    }

    componentDidMount() {
        this.categories()
    }

    reDrawTree=()=>{
        this.categories();
    };
    reDrawAll=()=>{
      this.setState({
          data: [],
          searchData: [],
          selectedKeys: [],
          selectedKeysData: {title: null, key: null, children: null, isLeaf: null},
          expandedKeys: [],
          autoExpandParent: false,
          searchValue: '',
      });
      this.categories();
      // this.props.reload();
    };

    categories= async ()=>{
        let {data}=await axios({
            url: PATH_PREFIX + '/api/category/tree',
            method: 'get',
            headers: {Authorization}
        });
        this.setState({
            data: data.object
        });
    };
    categorySearch = async () => {
        if (this.state.searchValue !== "") {
            await axios({
                url: PATH_PREFIX + '/api/category/tree/search',
                method: 'get',
                headers: {
                    Authorization
                },
                params: {
                    search: this.state.searchValue
                }
            }).then((response) => {
                if (response.data.success) {
                    this.setState({
                        searchData: response.data.object
                    });
                }
            })
        }
        if (this.state.searchValue === "") {
            this.setState({
                searchData: []
            })
        }
    };

    onSelect = async (keys, event) => {
        await this.setState({
            selectedKeys: keys,
            selectedKeysData: event.selectedNodes[0]
        });
        this.props.onSelect(event.selectedNodes[0])
    };
    onExpand = (expandedKeys) => {
        this.setState({
            expandedKeys,
            autoExpandParent: false,
        });
    };

    onSelectFromInput = (value) => {
        this.setState({
            autoExpandParent: true,
            expandedKeys: [value]
        })
    };
    onSearch = async (val) => {
        await this.setState({
            searchValue: val
        });
        this.categorySearch();
    };

    render() {

        const {searchData, selectedKeys, expandedKeys, selectedKeysData, autoExpandParent} = this.state;
        return (

            <div>
                <Select
                    // className='border-secondary text-secondary'
                    showSearch
                    style={{width: '100%'}}
                    placeholder="Mahsulotni qidiring"
                    optionFilterProp="children"
                    onChange={this.onSelectFromInput}
                    onSearch={this.onSearch}
                    filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                >
                    {
                        searchData.map(item =>
                            <Option style={{}} value={item.id}>{item.path}</Option>
                        )
                    }
                </Select>

                {
                    this.state.data.length===0?
                        <div className={'text-center'}>
                            sizda kategoriyalar yo'q
                        </div>:
                        <div>
                            <DirectoryTree
                                expandedKeys={expandedKeys}
                                selectedKeys={selectedKeys}
                                onSelect={this.onSelect}
                                autoExpandParent={autoExpandParent}
                                onExpand={this.onExpand}
                                treeData={this.state.data}
                            />
                            <div className={'text-center'}>
                                <button onClick={this.reDrawAll} className={'btn fas fa-undo text-dark'}></button>
                            </div>
                        </div>
                }

            </div>
        );
    }
}

export default SearchTree;