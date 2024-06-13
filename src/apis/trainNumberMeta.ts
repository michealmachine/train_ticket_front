import { $http } from '@/apis/index';

interface TrainNumberMeta {
    id: number;
    availableSeats: number;
}
export const getTrainNumberMetas = (page: number, pageSize: number, id?: number) => {
    return $http({
        url: '/tSet/page',
        method: 'get',
        params: { page, pageSize, id }
    });
}

export const saveTrainNumberMeta = (meta: TrainNumberMeta) => {
    return $http({
        url: '/tSet',
        method: 'post',
        data: meta
    });
}

export const deleteTrainNumberMeta = (id: number) => {
    return $http({
        url: `/tSet/${id}`,
        method: 'delete'
    });
}

export const getAllTickets = (page: number, pageSize: number) => {
    return $http({
        url: '/tSet/allTickets',
        method: 'get',
        params: { page, pageSize }
    });
}