import { loadEvents } from "./service";

/**
 * booking.state 参数类型
 *
 * @export
 * @interface BookingState
 */

export interface RoomEvent {
    bookedByID?: number,
    bookedByName: string,
    changekey?: string,
    description: string,
    endDate?: string,
    endTime: string,
    startDate?: string,
    startTime: string,
    subject: string,
    type: string,
}

export interface RoomData {
    description: string,
    email: string,
    name: string,
    roomCode: string
}
export interface RoomListDataEntry {
    listname: string,
    rooms: RoomData[]
}

export interface BookingState {
    currentStep: number,
    selectedListname: string,
    selectedListnameIndex: number,
    roomlistData: RoomListDataEntry[],
    selectedRoomCode: string,
    selectedRoomName: string,
    selectedRoomDescription: string,
    selectedDate: string,
    selectRoomEvent?: RoomEvent,
    bookingPostBody: {
        startDate: string,
        startTime: string,
        endTime: string,
        subject: string,
        description: string
    },
    bookingDeleteBody : {
        changekey: string
    }
    confirmLoading: boolean
}

/**
 * booking.props 参数类型
 *
 * @export
 * @interface BookingProps
 */
export interface BookingProps {
    dispatch: any,
    loadedEvents: RoomEvent[],
    loading: any,
    location: any
}
