import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, // This makes the "Stamper" available everywhere
      secret: process.env.JWT_SECRET, // This is your secret password
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN as any }, // The ticket expires in 60 seconds (for testing)
    }),
  ], // Add your entities here, e.g., User
  providers: [AuthService],
controllers: [AuthController],
})
export class AuthModule {}
