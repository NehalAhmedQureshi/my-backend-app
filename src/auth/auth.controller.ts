import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { error } from 'console';
import * as bcrypt from 'bcrypt';
import { ExtractJwt } from 'passport-jwt';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async sign_up(
    @Body()
    body: {
      first_name: string;
      last_name: string;
      email: string;
      password: string;
    },
  ) {
    try {
      const hashedPassword = await bcrypt.hash(body.password, 10);
      const user = await this.authService.sign_up(
        body.first_name,
        body.last_name,
        body.email,
        hashedPassword,
      );
      const { password, ...details } = user; // Exclude password from response
      console.log('🚀 ~ AuthController ~ sign_up ~ user:', user);
      return {
        message: 'User created successfully',
        status: 201,
        details,
      };
    } catch (error) {
      console.error('Error in sign_up:', error);
      return {
        message: 'Failed to create user',
        status: 401,
        error: error.message,
      };
    }
  }

  @Post('/signin')
  async sign_in(
    @Body()
    body: {
      email: string;
      password: string;
    },
  ) {
    try {
      const { user, access_token } = await this.authService.sign_in(body.email, body.password);
      console.log('🚀 ~ AuthController ~ sign_in ~ user:', user);
      const { password, ...details } = user; // Exclude password from response
      return {
        message: 'User signed in successfully',
        status: 200,
        details,
        extra:{
          access_token,
          expires_in: 3600, // This should match the signOptions in JwtModule
        },
      };
    } catch (error) {
      console.error('Error in sign_in:', error);
      return {
        message: 'Failed to sign in',
        status: 401,
        error: error.message,
      };
    }
  }
}
