import { NextFunction, Request, Response } from 'express';
import { sendResponse } from '../../../core/utils';
import { HttpCodes } from '../../../core/constants';
import { SMSProvider } from '../../sms/providers';

import { SMS } from '../interfaces/SMSInterface';

class SMSController {

  public sendSMS = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { to, message } = req.body;

      console.log({ dat: req.body })
      const mail = await (new SMSProvider).sendSMS({
        to: to,
        message: message
      })

      console.log({ mail })
      return sendResponse(res, HttpCodes.OK, 'Message sent successfully', mail)
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(error);
    }
  }

  public sendSMSSequence = async (req: Request, res: Response, next: NextFunction) => {
    try {

      console.log({ dat: req.body })
      const mail = await (new SMSProvider).sendSMSSequence(req.body as SMS[])

      console.log({ mail })
      return sendResponse(res, HttpCodes.OK, 'Messages sent successfully', mail)
      // return sendResponse(res, HttpCodes.OK, 'Message sent successfully', await this.userProvider.sendNotification({ userId: req.user._id, title: req.body.title, body: req.body.body }))
    } catch (error) {
      next(error);
    }
  }
}

export { SMSController };
