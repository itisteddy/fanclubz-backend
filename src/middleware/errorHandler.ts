import { Request, Response, NextFunction } from 'express'

interface ErrorWithStatus extends Error {
  status?: number
  statusCode?: number
}

export const errorHandler = (
  error: ErrorWithStatus,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = error.status || error.statusCode || 500
  const message = error.message || 'Internal Server Error'

  console.error(`Error ${status}:`, message)
  console.error('Stack:', error.stack)

  res.status(status).json({
    error: {
      message,
      status,
      path: req.path,
      method: req.method,
      timestamp: new Date().toISOString()
    }
  })
}
