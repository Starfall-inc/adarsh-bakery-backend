import User, { IUser } from '../models/user.model';

class UserService {
  public async getAllUsers(): Promise<IUser[]> {
    return User.find();
  }

  public async getUserById(id: string): Promise<IUser | null> {
    return User.findById(id);
  }

  public async findByUsername(username: string): Promise<IUser | null> {
    return User.findOne({ username }).select('+password');
  }

  public async getUserCount(): Promise<number> {
    return User.countDocuments();
  }

  public async createUser(userData: Partial<IUser>): Promise<IUser> {
    const user = new User(userData);
    return user.save();
  }

  public async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    return User.findByIdAndUpdate(id, userData, { new: true });
  }

  public async deleteUser(id: string): Promise<IUser | null> {
    return User.findByIdAndDelete(id);
  }
}

export default new UserService();
