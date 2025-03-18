import { Body, Controller, Get, Post, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentionals.dto';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  private logger = new Logger('AuthController');
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  signUp(
    @Body() body: AuthCredentialsDto,
  ): Promise<{ message: string } | undefined> {
    this.logger.log(body.username + ' has succesfully signed up');

    return this.authService.signUp(body);
  }

  @Post('sign-in')
  signIn(@Body() body: AuthCredentialsDto): Promise<{ accessToken: string }> {
    this.logger.log(body.username + ' has succesfully signed in');

    return this.authService.signIn(body);
  }

  @Get('users')
  getAllUsers(): Promise<User[]> {
    this.logger.log('You got all users data');

    return this.authService.getAllUsers();
  }
}
