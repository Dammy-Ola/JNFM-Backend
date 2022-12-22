import { Request, Response, NextFunction } from 'express'
import {
  addChurchService,
  deleteChurchService,
  editChurchService,
  getChurchServices,
  getSingleChurchServiceById,
  IBaseChurchService,
  IChurchService,
} from './index'
import { asyncHandler } from '../../middlewares'
import { ErrorResponse } from '../../utils'
import { IAttendance } from '../attendance'

export const getChurchServicesHandler = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const churchServices = await getChurchServices()
      .populate<{
        attendances: IAttendance[]
      }>({
        path: 'attendances',
        model: 'Attendance',
        select: 'member',
        populate: {
          path: 'member',
          model: 'Member',
          select: 'fullName',
        },
      })
      .sort('-date')

    return res
      .status(200)
      .json({ success: true, count: churchServices.length, churchServices })
  }
)

export const getSingleChurchServiceByIdHandler = asyncHandler(
  async (
    req: Request<{ id: IChurchService['_id'] }, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const churchService = await getSingleChurchServiceById(
      req.params.id
    ).populate<{
      attendances: IAttendance[]
    }>({
      path: 'attendances',
      model: 'Attendance',
      select: 'member',
      populate: {
        path: 'member',
        model: 'Member',
        select: 'fullName',
      },
    })

    if (!churchService) {
      return next(
        new ErrorResponse(
          `ChurchService with the id of ${req.params.id} not found`,
          404
        )
      )
    }

    return res.status(200).json({ success: true, churchService })
  }
)

export const addChurchServiceHandler = asyncHandler(
  async (
    req: Request<{}, {}, IBaseChurchService, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const churchService = await addChurchService(req.body)

    return res.status(201).json({ success: true, churchService })
  }
)

export const editChurchServiceHandler = asyncHandler(
  async (
    req: Request<{ id: IChurchService['_id'] }, {}, IChurchService, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const churchService = await editChurchService(req.params.id, req.body)

    return res.status(200).json({ success: true, churchService })
  }
)

export const deleteChurchServiceHandler = asyncHandler(
  async (
    req: Request<{ id: IChurchService['_id'] }, {}, {}, {}>,
    res: Response,
    next: NextFunction
  ) => {
    const churchService = await deleteChurchService(req.params.id)

    res.status(200).json({ success: true, churchService })
  }
)
