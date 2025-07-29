export function successResponse(message: string, data: any = null) {
  return {
    success: true,
    message,
    data,
  };
}
