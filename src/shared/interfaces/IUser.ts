import IPermission from './IPermission';

export default interface IUser {
  id?: string;
  email: string;
  username: string;
  createdAt: string;
  name?: string;
  photo?: string;
  hashedPassword?: string;
  googleId?: string;
  token?: string;
  hasPassword?: boolean;
  permissions?: IPermission[];
}
