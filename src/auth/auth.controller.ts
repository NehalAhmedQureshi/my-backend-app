import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { error } from 'console';
import * as bcrypt from 'bcrypt';
import { ExtractJwt } from 'passport-jwt';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';

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
      const user = await this.authService.sign_up(
        body.first_name,
        body.last_name,
        body.email,
        body.password,
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
      const { user, extra } = await this.authService.sign_in(
        body.email,
        body.password,
      );
      const { password, ...details } = user; // Exclude password from response
      return {
        message: 'User signed in successfully',
        status: 200,
        details,
        extra
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

  @UseGuards(AuthGuard) // This protects the route with your AuthGuard
  @Get('/me')
  async get_me(@Request() req: any) {
    // Because the guard passed, req.user now has the ID from the token
      const {details, access_token: extra} = await this.authService.get_me(req.user.sub); // Pass the user ID to the service method
    // let expires_in = this.jwtService.decode(access_token)['exp'] - Math.floor(Date.now() / 1000); // Calculate remaining time until token expires
    return {
      message: 'User details retrieved successfully',
      status: 200, // req.user data that your AuthGuard provides to link the task to that specific person.
      details,
      extra,
    };
  }
}
