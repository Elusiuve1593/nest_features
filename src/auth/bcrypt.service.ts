import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class BycryptService {
  async hash(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    return hashedPassword;
  }

  async compare(userPassword: string, hashedPassword: string) {
    return await bcrypt.compare(userPassword, hashedPassword);
  }
}
