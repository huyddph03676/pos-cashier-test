export function processResponse(status: boolean, data = null) {
  const response = {
    success: status,
    message: status ? 'Success' : 'Fail',
    ...(data && { data }),
  };
  return response;
};