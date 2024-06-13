import { $http } from '@/apis/index'
export const buyTicket = (trainId: number, startId: number, endId: number) => {
  return $http({
    url: '/ticket',
    method: 'post',
    params: {
      trainId,
      startId,
      endId,
    },
  });
};
export const getTicketPage = (page: number, pageSize: number) => {
  return $http({
    url: '/ticket/page',
    method: 'get',
    params: {
      page,
      pageSize,
    },
  });
};
export const getAllTickets = (page: number, pageSize: number) => {
  return $http({
    url: '/tSet/allTickes',
    method: 'get',
    params: {
      page,
      pageSize,
    },
  });
};