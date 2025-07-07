import api from '../const/api';

export const getClientOrders = async (isIndividualClient, statutOrderLessThan) => {
  try {
    const response = await api.get(`/client/commandes?clientIndividuel=${isIndividualClient}&statutOrderLessThan=${statutOrderLessThan}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client orders:', error);
    throw error;
  }
};

export const cancelOrder = async (commandeId, commandeIndividuelle) => {
  try {
    const response = await api.post('/client/cancel-order', { commandeId, commandeIndividuelle });
    return response.data;
  } catch (error) {
    console.error('Error cancelling order:', error);
    throw error;
  }
};

export const getHistoricalOrders = async (isIndividualClient, statutOrder) => {
  try {
    const response = await api.get(`/client/commandes?clientIndividuel=${isIndividualClient}&statutOrder=${statutOrder}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching historical orders:', error);
    throw error;
  }
};

export const createOrder = async (orderData) => {
  try {
    const response = await api.post('/client/create-order', orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};
