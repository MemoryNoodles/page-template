import React from "react";
import Api from "~/until/api";
import { SearchForm, TableData } from "cake-ui";
import { message } from "antd"
import UpdateInfoModal from "./component/UpdateInfoModal"

class CompanyManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            companyList: [],
            modalVisible: false,
            rowData:'',//修改的一行数据
        };
    }
    
    //请求列表数据
    componentDidMount(){
        this.getOrgCompanyManageTableInfo()
    }

    //点击搜索请求列表数据
    getOrgCompanyManageTableInfo = params => {
        let newParams = {
            ...this.searchForm.json,
            ...this.tableData.returnPage(),
            ...params
        };
        // 请求公司列表
        Api.getOrgCompanyManageTableInfo(newParams).then(res => {
            this.setState({
                companyList:res.content || []
            })
        });
    };

    //修改公司邮箱
    updateCompanyEmail=(json)=> {
        Api.updateCompanyEmail(json).then(res => {
            message.success('更新成功');
            this.setState({
                modalVisible:false
            })
            this.getOrgCompanyManageTableInfo()
        });  
    }

    showHideMode=(rowData)=>{
        this.setState(prevState=>{
            return {
                modalVisible:!prevState.modalVisible,
                rowData
            }
        })
    }
    //表格头部
    getInitialTableHead() {
        // 设置table的表头标题
        this.tableColumns = [
            {
                width: "30%",
                title: "公司全称", // 菜单内容
                key: "fullName", // key
                dataIndex: "fullName" // key
            },
            {
                width: "30%",
                title: "公司简称",
                key: "name",
                dataIndex: "name"
            },
            {
                width: "30%",
                title: "公司邮箱",
                key: "email",
                dataIndex: "email"
            },
            {
                title: "操作",
                key: "operation",
                render: rowData => (
                    <span>
                        <a
                            href="javascript:;"
                            onClick={() => {this.showHideMode(rowData);}}
                        >
                          修改
                        </a>
                    </span>
                )
            }
        ];
        return this.tableColumns;
    }

    render() {
        const searchConfig = [
            // 过滤表单配置示例
            {
                name: "公司全称",
                type: "text",
                keyName: "fullName",
                placeholder: "请输入全称",
            },
            {
                name: "公司简称",
                type: "text",
                keyName: "name",
                placeholder: "请输入简称"
            }
        ];
     
        return (
            <div>
                <SearchForm
                    config={searchConfig}
                    search={this.getOrgCompanyManageTableInfo}
                    ref={ins=>this.searchForm=ins}
                />
                <br />
                <TableData
                    columns={this.getInitialTableHead()}
                    dataSource={this.state.companyList}
                    queryData={params => this.getOrgCompanyManageTableInfo(params)}
                    ref={ins=>this.tableData=ins}
                />
                <UpdateInfoModal
                    modalVisible={this.state.modalVisible}
                    rowData = {this.state.rowData}
                    updateCompanyEmail={this.updateCompanyEmail}
                    onCancel={()=>this.showHideMode({})}
                />
            </div>
        );
    }
}
export default CompanyManagement;
