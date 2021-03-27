/** 
 * 监听token过期时间
 * @return: Boolean
 */
export const tokenExpressInTime = () => {
	let date = new Date()
	let tokenTime = localStorage.getItem('tokenTime')
	// 当前时间减去获取本地过期时间的值是否大于0   大于0为过期返回true 否则返回false
	return (date.getTime() - Number(tokenTime)) > 0 ? true : false
}
