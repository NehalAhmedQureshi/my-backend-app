import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { generate } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async sign_up(
    first_name: string,
    last_name: string,
    email: string,
    password: string,
  ): Promise<User> {
    // 1. Check if user already exists
    const exist = await this.userRepository.findOne({ where: { email } });
    if (exist) {
      throw new Error('Email already exists');
    }

    // 2. Create and save user
    const user = this.userRepository.create({
      first_name,
      last_name,
      email,
      password,
    });

    return await this.userRepository.save(user);
  }

  async sign_in(email: string, password: string): Promise<any> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new Error('User not found');
    }
    // Compare the plain text password with the hashed one in DB
    const isMatch = user
      ? await bcrypt.compare(password, user.password)
      : false;
    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    // 3. Create the "Data" for the ticket (Payload)
    const payload = { sub: user.id, email: user.email };

    return {
      user,
      access_token: await this.generateToken(payload),
    };
  }

  async generateToken(user: any) {
    const payload = { email: user.email, sub: user.id };
    return await this.jwtService.signAsync(payload);
  }
}
