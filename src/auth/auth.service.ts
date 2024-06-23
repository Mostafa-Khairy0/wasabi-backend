import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from '../database/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(phoneNumber: string) {
    try {
      await this.usersService.rigster(phoneNumber);
      return {
        message: [`The OTP code has been sent to ${phoneNumber}`],
      };
    } catch (error) {
      console.error(error);
      return new HttpException(
        'Unknown error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  async verify(phoneNumber: string, otp: number) {
    try {
      const user = await this.usersService.checkOtp(phoneNumber, otp);
      console.log({ user });
      if (!user)
        return new HttpException(
          'The OTP code uncorrect',
          HttpStatus.BAD_REQUEST,
        );
      return { message: ['Verified successfully'], user };
    } catch (error) {
      console.error(error);
      return new HttpException(
        'Unknown error occurred',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
