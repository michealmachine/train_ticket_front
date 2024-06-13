import { $http } from '@/apis/index';

export const apiAddToCart = (ticket: { trainId: number; startId: number; endId: number; price: number }) => {
    return $http({
        url: '/cart/add',  // 这个是你的后端接口
        method: 'post',
        data: ticket,
    });
};
export const getCart = () => {
    return $http({
        url: '/cart/get',
        method: 'get'
    });
};

export const removeFromCart = (id: number) => {
    return $http({
        url: `/cart/remove/${id}`,
        method: 'delete'
    });
};