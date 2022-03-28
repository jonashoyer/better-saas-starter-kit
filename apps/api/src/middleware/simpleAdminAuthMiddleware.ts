// !MODULE oauth
import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';
import { ADMIN_KEY, JWT_SECRET } from '../config';
import ms from 'ms';

const cookieName = 'bs.admin-tok';
const expiresIn = '10m';

const simpleAdminAuthMiddleware: RequestHandler = (req, res, next) => {
  const tok = req.cookies[cookieName];
  const { key } = req.query;
  
  if (tok) {
    try {
      jwt.verify(tok, JWT_SECRET);
      if (key) return res.redirect(req.originalUrl.split("?").shift()!);
      return next();
      
    } catch(err) {
      res.clearCookie(cookieName);
    }
  }

  if (key) {
    if (key != ADMIN_KEY) return res.contentType('html').send(loginPage('Bad key'));
    const tok = jwt.sign(
      {},
      JWT_SECRET,
      {
        expiresIn,
      }
    );

    res.cookie(cookieName, tok, { expires: new Date(Date.now() + ms(expiresIn)), httpOnly: true, secure: true, sameSite: 'strict' });
    if (key) return res.redirect(req.originalUrl.split("?").shift()!);
    return next();
  }

  return res.contentType('html').send(loginPage(tok ? 'Session expired' : undefined));
}

export default simpleAdminAuthMiddleware;

const loginPage = (info?: string) => `<form method='get'><h3>Protected route</h3>${info ? `<p>${info}</p>` : ''}<label>Admin Key</label><input name="key" /><input type='submit' value='Submit' /></form>`;