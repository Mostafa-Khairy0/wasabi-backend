import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UsersService {
  constructor(private prismaService: PrismaService) {}

  private generateOtp() {
    return Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
  }
  private async deleteUser(id: string, otp: number) {
    try {
      await this.prismaService.user.delete({
        where: { id, otp },
      });
    } catch (error) {
      console.error(error);
    }
  }
  private async resetOtp(id: string, otp: number) {
    try {
      await this.prismaService.user.update({
        where: { id, otp },
        data: { otp: null },
      });
    } catch (error) {
      console.error(error);
    }
  }
  async rigster(phoneNumber: string) {
    const otp = this.generateOtp();
    try {
      const user = await this.prismaService.user.upsert({
        where: { phoneNumber },
        create: { phoneNumber, otp },
        update: { otp },
      });
      setTimeout(
        () =>
          user?.name
            ? this.resetOtp(user.id, user.otp)
            : this.deleteUser(user.id, user.otp),
        60 * 1000 * 3,
      );
      console.log({ user });
    } catch (error) {
      console.error(error);
    }
  }
  async checkOtp(phoneNumber: string, otp: number) {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          phoneNumber,
          otp,
        },
      });
      return user;
    } catch (error) {
      console.error(error);
    }
  }
}
