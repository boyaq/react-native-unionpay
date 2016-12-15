import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import * as Unionpay from "react-native-unionpay"

export default class App extends Component {
	constructor(props) {
		super(props)
		this.state = {
			tn: '',
		};
	}
	async _generateTN() {
		fetch('http://101.231.204.84:8091/sim/getacptn').then((res) => res.text()).then(res => {
			console.log(res, 'res')
			this.setState({
				tn: res.toString()
				
			})
		}).catch(err => {
			console.log(err)
			alert('获取订单失败')
		})
	}
	render() {
		return (
			<View style={styles.container}>
				<TouchableOpacity style={[styles.generateOrderNo, styles.border]} onPress={() => this._generateTN()}>
					<Text style={styles.click}>点击获取订单号</Text>
				</TouchableOpacity>

				<Text style={styles.tn}>订单号:{this.state.tn||'点击上面的按钮获取'}</Text>

				<TouchableOpacity
					style={styles.border}
					onPress={() => {
						
					Unionpay
						.startPay(this.state.tn, "01")
						.then(res => {
							alert("payment success")
							console.log(res, 'res')
						})
						.catch(err => {
							alert('payment failed');
							console.log(err, 'err')
						});
				}}>
					<Text style={styles.click}>点我开始支付</Text>
				</TouchableOpacity>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: '#F5FCFF'
	},
	border:{
		borderWidth: 1,
		borderRadius: 5,
	},
	generateOrderNo:{
		marginBottom: 100,
	},
	tn: {
		fontSize: 16,
		textAlign: 'center',
		margin: 10,
	},
	click: {
		fontSize: 20,
		textAlign: 'center',
		margin: 10,
		color: 'black'
	}
});