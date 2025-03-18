import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';
import { Repository } from 'typeorm';
import { BycryptService } from './bcrypt.service';
import { AuthCredentialsDto } from './dto/auth-credentionals.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private bycryptService: BycryptService,
    private jwtService: JwtService,
  ) {}

  async signUp({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ message: string } | undefined> {
    try {
      const hashedPassword: string = await this.bycryptService.hash(password);

      const user: User = this.userRepository.create({
        username,
        password: hashedPassword,
      });

      await this.userRepository.save(user);

      return {
        message: `User with name: ${username} has succesfully created`,
      };
    } catch (err) {
      if (err.code === '23505')
        throw new ConflictException('User has already exists');
    }
  }

  async signIn({
    username,
    password,
  }: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const user: User | null = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(
        'User is not on system. Sighn up first, please',
      );
    }

    if (user && (await this.bycryptService.compare(password, user.password))) {
      const accessToken: string = this.jwtService.sign({ username });

      return { accessToken };
    } else {
      throw new UnauthorizedException('Check your credantionals, please');
    }
  }

  async getAllUsers(): Promise<User[]> {
    const users = await this.userRepository.find();
    return plainToInstance(User, users);
  }
}
