import { Table, Icon, Divider } from 'antd';
import { ApplicationState } from '../../application-state';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import React from 'react';
import { updateGreeting } from '../../action-creators/index';
// import { connect } from "tls";
import './Greeting.css';
class Greeting extends React.Component<{}, {}> {
	columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			key: 'name',
			render: (text: any) => {
				console.log(text);
				return {
					children: text,
					props: {
						'data-tip': 'a very long text'
					}
				};
			}
		},
		{
			title: 'Age',
			dataIndex: 'age',
			key: 'age'
		},
		{
			title: 'Address',
			dataIndex: 'address',
			render: (text: any) => {
				console.log(text);
				return {
					children: text,
					props: {
						'data-tip': 'a very long text'
					}
				};
			}
		},
		{
			title: 'Action',
			key: 'action',
			render: (text: any, record: any) => (
				<span>
					<a href="#">Action 一 {record.name}</a>
					<Divider type="vertical" />
					<a href="#">Delete</a>
					<Divider type="vertical" />
					<a href="#" className="ant-dropdown-link">
						More actions <Icon type="down" />
					</a>
				</span>
			)
		}
	];
	data = [
		{
			key: '1',
			name: 'John Brown',
			age: 32,
			address: 'New York No. 1 Lake Park'
		},
		{
			key: '2',
			name: 'Jim Green',
			age: 42,
			address: 'London No. 1 Lake Park'
		},
		{
			key: '3',
			name: 'Joe Black',
			age: 32,
			address: 'Sidney No. 1 Lake Park'
		}
	];
	render() {
		return (
			<div id="con">
				<Table columns={this.columns} dataSource={this.data} />;
			</div>
		);
	}
}
export default Greeting;
