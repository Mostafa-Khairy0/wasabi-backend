import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterUserDto, VerifyUserDto } from './Auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(new ValidationPipe()) body: RegisterUserDto) {
    const { phoneNumber } = body;
    console.log({ phoneNumber });
    return this.authService.register(phoneNumber);
  }

  @Post('verify')
  async verify(@Body(new ValidationPipe()) body: VerifyUserDto) {
    const { phoneNumber, otp } = body;
    console.log({ phoneNumber, otp });
    return this.authService.verify(phoneNumber, otp);
  }
}
