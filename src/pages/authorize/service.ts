
import Api from '../../utils/request'

export const ping = () => Api.ping()
export const authorize = (data) => Api.authorize(data)
