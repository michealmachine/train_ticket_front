import { $http } from '@/apis/index'

interface RailNode {
    id:number
    startTime:Date
    startStationId:number
    endTime:Date
    endStationId:number
    price:number
}

interface TrainNumberMetaToAdd {
    id: number
    availableSeats: number
}

export const saveTrainNumber = (railNodes: RailNode[]) => {
    return $http({
        url: '/number',
        method: 'post',
        data: railNodes
    })
}

export const getTrainNumbers = (page: number, pageSize: number, id?: number) => {
    return $http({
        url: '/number/page',
        method: 'get',
        params: { page, pageSize, id }
    })
}

export const findTrainsBetweenStations = (start: number, end: number) => {
    return $http({
        url: '/number',
        method: 'get',
        params: { start, end }
    })
}

export const deleteTrainNumber = (id: number) => {
    return $http({
        url: `/number/${id}`,
        method: 'delete'
    })
}

export const saveTrainNumberMeta = (trainNumberMeta: TrainNumberMetaToAdd) => {
    return $http({
        url: '/trainNumberMeta',
        method: 'post',
        data: trainNumberMeta
    })
}

export const getTrainNumberMetas = (page: number, pageSize: number) => {
    return $http({
        url: '/trainNumberMeta/page',
        method: 'get',
        params: { page, pageSize }
    })
}

export const deleteTrainNumberMeta = (id: number) => {
    return $http({
        url: `/trainNumberMeta/${id}`,
        method: 'delete'
    })
}
