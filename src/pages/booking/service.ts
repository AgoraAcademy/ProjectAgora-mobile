
import Api from '../../utils/request'

export const testApi = data => Api.test(
    data
)

export const getRoomList = data => Api.getRoomList(
    data
)

export const loadEvents = data => Api.loadEvents(
    data
)